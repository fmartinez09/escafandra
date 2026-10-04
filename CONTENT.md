# Publishing content

Create a Markdown file in the section that fits the work:

- `src/research/`: papers, preprints, and work intended to make an original contribution.
- `src/projects/`: built artifacts, tools, experiments, repositories, and systems, whether or not related to research.
- `src/notes/`: surveys, lecture notes, reading notes, technical notes, paper reproductions, idea explorations, and small experiments.

The filename becomes the URL slug. For example, `src/notes/reading-log.md` is published at `/notes/reading-log`.

```yaml
---
title: "Reading log"
date: "04-10-2026"
author: "Fernando Martínez"
summary: "Notes on recent reading."
tags:
  - Distributed Systems
  - "My new topic"
---
```

Tags are optional, free-form text labels. Add as many as you need, omit `tags`, or use `tags: []` for an untagged article. New tags automatically appear in the section's filters when an article is published; there is no separate tag registry to edit. Clicking a tag opens a shareable filter URL. Tag names are case-sensitive, so reuse the same spelling for the same topic. Quote labels containing YAML punctuation such as colons or hashes.

Possible labels include Automata Theory, Distributed Systems, LLM Agents & Harnesses, Model Checking, Computability, Software Testing, and Observability. These are examples, not a required or exhaustive list.

Use `draft: true` to keep work out of the lists and prevent its article URL from being published. Remove it or set `draft: false` when ready. Research and Projects can remain empty until there is work to publish.

`excerpt` is still supported as an alternative to `summary`. Existing `/blog` links redirect to `/notes`.
