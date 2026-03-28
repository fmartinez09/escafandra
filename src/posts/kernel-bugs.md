---
title: "Kernel bugs hide for 2 years on average. Some hide for 20."
date: "2026-03-01"
author: "Jenny @ Pebblebed"
tag: "security"
summary: "I analyzed 125,183 Linux kernel bugs spanning 20 years of git history. Race conditions average 5.1 years to discovery. One refcount bug survived 19 years undetected. Here's what the data shows — and how I built a model that catches 92.2% of bug-introducing commits."
---

I analyzed 20 years of Linux kernel git history to understand how long bugs actually survive before someone finds them.

**TL;DR**: The average is 2.1 years. Race conditions average 5.1 years. One bug hid for 19 years. I built a model (VulnBERT) that catches 92.2% of bug-introducing commits with only 1.2% false positive rate.

---

## The dataset

125,183 bugs with valid lifetimes, extracted by mining `Fixes:` tags from git history:

```
git log --since="2005-04-16" --grep="Fixes:" --format="%H"
```

Each `Fixes:` tag points back to the introducing commit. Lifetime = date of fix − date of introduction.

**Coverage note**: The kernel has ~448,000 commits mentioning "fix" in some form, but only ~124,000 (28%) use proper `Fixes:` tags. My dataset captures the well-documented bugs — the ones where maintainers traced the root cause.

---

## It varies by subsystem

| Subsystem | Bug Count | Avg Lifetime |
|-----------|-----------|--------------|
| drivers/can | 446 | 4.2 years |
| networking/sctp | 279 | 4.0 years |
| networking/ipv4 | 1,661 | 3.6 years |
| usb | 2,505 | 3.5 years |
| tty | 1,033 | 3.5 years |
| netfilter | 1,181 | 2.9 years |
| networking | 6,079 | 2.9 years |
| memory | 2,459 | 1.8 years |
| gpu | 5,212 | 1.4 years |
| bpf | 959 | 1.1 years |

CAN bus and SCTP bugs persist longest — both are niche protocols with less testing coverage. GPU (especially Intel i915) and BPF bugs get caught fastest, thanks to dedicated fuzzing infrastructure.

---

## Some bug types hide longer than others

Race conditions are the hardest to find, averaging 5.1 years to discovery:

| Bug Type | Count | Avg Lifetime | Median |
|----------|-------|--------------|--------|
| race-condition | 1,188 | 5.1 years | 2.6 years |
| integer-overflow | 298 | 3.9 years | 2.2 years |
| use-after-free | 2,963 | 3.2 years | 1.4 years |
| memory-leak | 2,846 | 3.1 years | 1.4 years |
| buffer-overflow | 399 | 3.1 years | 1.5 years |
| refcount | 2,209 | 2.8 years | 1.3 years |
| null-deref | 4,931 | 2.2 years | 0.7 years |
| deadlock | 1,683 | 2.2 years | 0.8 years |

Why do race conditions hide so long? They're non-deterministic and only trigger under specific timing conditions that might occur once per million executions. Even sanitizers like KCSAN can only flag races they observe.

30% of bugs are self-fixes where the same person who introduced the bug eventually fixed it. Code ownership matters.

---

## Case study: 19 years in the kernel

One of the oldest networking bugs in my dataset was introduced in August 2006 and fixed in August 2025:

```c
// ctnetlink_dump_table() - the buggy code path
if (res < 0) {
    nf_conntrack_get(&ct->ct_general); // increments refcount
    cb->args[1] = (unsigned long)ct;
    break;
}
```

The irony: commit `d205dc40798d` was itself a fix — "[NETFILTER]: ctnetlink: fix deadlock in table dumping". Patrick McHardy was fixing a deadlock by removing a `_put()` call. In doing so, he introduced a refcount leak that would persist for 19 years.

The bug: the code doesn't check if `ct == last`. If the current entry is the same as the one we already saved, we've now incremented its refcount twice but will only decrement it once. The object never gets freed.

```c
// What should have been checked:
if (res < 0) {
    if (ct != last) // <-- this check was missing for 19 years
        nf_conntrack_get(&ct->ct_general);
    cb->args[1] = (unsigned long)ct;
    break;
}
```

The consequence: memory leaks accumulate. Eventually `nf_conntrack_cleanup_net_list()` waits forever for the refcount to hit zero. The netns teardown hangs. If you're using containers, this blocks container cleanup indefinitely.

Why it took 19 years: you had to run `conntrack_resize.sh` in a loop for ~20 minutes under memory pressure. Nobody ran that specific test sequence for two decades.

---

## The anatomy of a long-lived bug

Looking at bugs that survive 10+ years, I see common patterns:

**1. Reference counting errors**

```c
kref_get(&obj->ref);
// ... error path returns without kref_put()
```

These don't crash immediately. They leak memory slowly. In a long-running system, you might not notice until months later when OOM killer starts firing.

**2. Missing NULL checks after dereference**

```c
struct foo *f = get_foo();
f->bar = 1;        // dereference happens first
if (!f) return -EINVAL; // check comes too late
```

The compiler might optimize away the NULL check since you already dereferenced. These survive because the pointer is rarely NULL in practice.

**3. Integer overflow in size calculations**

```c
size_t total = n_elements * element_size; // can overflow
buf = kmalloc(total, GFP_KERNEL);
memcpy(buf, src, n_elements * element_size); // copies more than allocated
```

**4. Race conditions in state machines**

```c
spin_lock(&lock);
if (state == READY) {
    spin_unlock(&lock);
    // window here where another thread can change state
    do_operation(); // assumes state is still READY
}
```

---

## Can we catch these bugs automatically?

I built **VulnBERT**, a model that predicts whether a commit introduces a vulnerability.

| Model | Recall | FPR | F1 | Notes |
|-------|--------|-----|----|-------|
| Random Forest | 76.8% | 15.9% | 0.80 | Hand-crafted features only |
| CodeBERT (fine-tuned) | 89.2% | 48.1% | 0.65 | High recall, unusable FPR |
| VulnBERT | 92.2% | 1.2% | 0.95 | Best of both approaches |

The problem with vanilla CodeBERT: 89% recall but 48% false positive rate. Unusable. The model learns shortcuts — "big diff = dangerous", "lots of pointers = risky" — that correlate in training data but don't generalize.

### Architecture

```
┌─────────────────────────────────────────┐
│           INPUT: Git Diff               │
└──────────────────┬──────────────────────┘
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
┌──────────────┐     ┌──────────────────────┐
│ Chunked Diff │     │ Handcrafted Feature  │
│   Encoder    │     │     Extractor        │
│ (CodeBERT +  │     │  (51 features)       │
│  Attention)  │     └──────────┬───────────┘
└──────┬───────┘                │
  [768-dim]                [51-dim]
       └───────────┬────────────┘
                   ▼
         ┌─────────────────┐
         │ Cross-Attention │
         │     Fusion      │
         └────────┬────────┘
                  ▼
         ┌─────────────────┐
         │ Risk Classifier │
         └─────────────────┘
```

Three innovations drove performance:

**Chunked encoding for long diffs.** CodeBERT's 512-token limit truncates most kernel diffs (often 2000+ tokens). Split into chunks, encode each, use learned attention to aggregate:

```python
chunk_attention = nn.Sequential(
    nn.Linear(hidden_size, hidden_size // 4),
    nn.Tanh(),
    nn.Linear(hidden_size // 4, 1)
)
attention_weights = F.softmax(chunk_attention(chunk_embeddings), dim=1)
pooled = (attention_weights * chunk_embeddings).sum(dim=1)
```

**Feature fusion via cross-attention.** 51 handcrafted features extracted using regex and AST-like analysis of the diff. Key bug-pattern features:

```python
'unbalanced_refcount': 1,     # kref_get without kref_put → leak
'unbalanced_lock': 1,          # spin_lock without spin_unlock → deadlock
'has_deref_no_null_check': 0,  # *ptr without if(!ptr) → null deref
'has_alloc_no_free': 0,        # kmalloc without kfree → leak
```

**Focal loss for hard examples.** Standard cross-entropy wastes gradient updates on easy examples. Focal loss shrinks the gradient for confident predictions by ~400×, forcing the model to focus on ambiguous commits.

### Results on temporal validation (train ≤2023, test 2024)

| Metric | Target | Result |
|--------|--------|--------|
| Recall | 90% | **92.2%** ✓ |
| FPR | less than 10% | **1.2%** ✓ |
| Precision | — | **98.7%** |
| F1 | — | **95.4%** |
| AUC | — | **98.4%** |

The model correctly differentiates the same bug at different stages:

| Commit | Description | Risk |
|--------|-------------|------|
| `acf44a2361b8` | Fix for UAF in xe_vfio | 12.4% LOW ✓ |
| `1f5556ec8b9e` | Introduced the UAF | 83.8% HIGH ✓ |

---

## Limitations

- Only captures bugs with `Fixes:` tags (~28% of fix commits). Selection bias: well-documented bugs tend to be more serious.
- Mainline only — doesn't include stable-branch-only fixes or vendor patches.
- 92.2% recall is on a held-out 2024 test set, not a guarantee for future bugs.
- Can't catch semantic bugs (logic errors with no syntactic signal).
- Cross-function blind spots (bug spans multiple files).
- Tested only on Linux kernel code.

VulnBERT is a triage tool, not a guarantee. It catches 92% of bugs with recognizable patterns. The remaining 8% and novel bug classes still need human review and fuzzing.

---

## Dataset

Full miner code and dataset: [github.com/quguanni/kernel-vuln-data](https://github.com/quguanni/kernel-vuln-data)

If you're working on kernel security, vulnerability detection, or ML for code analysis — [jenny@pebblebed.com](mailto:jenny@pebblebed.com)
