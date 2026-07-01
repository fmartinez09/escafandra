---
title: "Introducción a FoundationDB"
date: "20-09-2025"
category: "Engineering"
author: "Fernando Martínez"
cover: "/images/neuron.avif"
excerpt: "La base de los sistemas distribuidos"
---

Actualmente, podemos ejecutar **FoundationDB** desde el mirror oficial de Docker publicado por la CI: https://hub.docker.com/r/foundationdb/foundationdb

(También hay muchas otras cosas interesantes allí).

```bash
docker run -d foundationdb/foundationdb
```

Esta imagen viene con muchas configuraciones por defecto que ahorran tiempo. Luego, si queremos acceder al contenedor:

```bash
docker exec -it fdb bash
```

Ahora ejecuta:

```bash
fdbcli
```

para abrir la interfaz de línea de comandos de FoundationDB.

Puedes apuntar explícitamente al archivo de clúster dentro del contenedor:

```bash
fdbcli -C /var/fdb/fdb.cluster
```

Verifica el estado (**status**) y observa si ya viene con una base de datos o no — podría decir *unavailable* (no disponible).

> Nota: El archivo de clúster es cómo los clientes y servidores descubren el clúster.
> 
> 
> Por defecto, se encuentra en `/etc/foundationdb/fdb.cluster` en Linux; dentro del contenedor suele estar en `/var/fdb/fdb.cluster`.
> 
> Copiar ese archivo es *cómo* agregas nuevos clientes o hosts al clúster — no debe editarse manualmente excepto para propósitos de coordinación.
> 

---

## Creando una Base de Datos

Si no hay ninguna base de datos, consulta la documentación:

[**(Re)creating a database**](https://apple.github.io/foundationdb/administration.html#re-creating-a-database)

> La instalación de los paquetes de FoundationDB generalmente crea una nueva base de datos de forma automática.
> 
> 
> Sin embargo, si un clúster no tiene una base de datos configurada (por ejemplo, la instalación falló, se eliminaron los datos o no se usaron los paquetes),
> 
> puedes crearla manualmente con `configure new` en `fdbcli`:
> 

```bash
configure new single memory
```

Este comando crea una nueva base de datos lista para usar.

Ten en cuenta que las instalaciones de paquetes — y los mirrors de Docker — pueden no incluir una base de datos pre-creada, por lo que es mejor hacerlo tú mismo, ya que los datos predeterminados suelen ser solo para pruebas.

---

## Verificando el Contenido

No puedes consultar cuántas bases de datos o tablas existen usando algo como `SELECT * FROM table-name`,

porque **FoundationDB no es una base de datos relacional** — **no tiene tablas**.

Es un **Almacén de Clave-Valor Ordenado (OKVS - Ordered Key-Value Store)**.

Todos los datos residen en un único espacio de nombres global de clave-valor.

En `fdbcli`:

```bash
getrangekeys "" \xff
```

Esto itera desde `""` hasta `"\xff"` — el límite superior típico del espacio de claves del usuario.

Opcionalmente, puedes añadir `LIMIT 50`.

> Nota: Al realizar consultas en fdbcli, utiliza comillas dobles ("") en lugar de comillas simples.
> 
> 
> Las comillas simples no son caracteres especiales ahí y no funcionarán correctamente.
> 

---

## Filosofía de FoundationDB

FoundationDB no viene con tablas listas para usar ni con un panel de administración.

Es **pura infraestructura** — piensa en él como si fuera un kernel.

Si no montas nada encima, no hace mucho más allá de manejar operaciones `get` y `set`.

La belleza radica en el hecho de que a partir de aquí, puedes elegir *qué capa construir encima* — incluso sistemas distribuidos completos.

---

## Matriz de Comparación

(marcador de posición para tabla o gráfico del blog) [https://en.wikipedia.org/wiki/Ordered_key–value_store](https://en.wikipedia.org/wiki/Ordered_key%E2%80%93value_store)

---

### OKVS Puro (LMDB, RocksDB, LevelDB, Kyoto, BerkeleyDB, WiredTiger, etc.)

- Librerías embebidas diseñadas para ejecutarse **dentro de un solo proceso**.
- Proporcionan operaciones básicas: `put`, `get`, `range` y, a veces, **transacciones locales**.
- Ejemplos de casos de uso:
    - LevelDB en Chrome para almacenamiento en caché.
    - RocksDB en Kafka Streams.
    - LMDB en OpenLDAP.

---

### OKVS Distribuido (FoundationDB, TiKV)

- No son solo librerías — son **clústeres** completos con **consenso, replicación, particionamiento (sharding) y tolerancia a fallos**.
- Exponen la misma API de clave-valor pero garantizan **transacciones ACID a nivel de todo el clúster**.
- **FoundationDB** utiliza un **diseño determinista** con un **registro de transacciones centralizado** para serializar los commits.
- **TiKV** implementa el **modelo Spanner/Percolator** (MVCC + Raft).

---

### Bases de Datos Distribuidas de Alto Nivel

*(Cassandra, Spanner, Aurora, Bigtable, etc.)*

- Ya no exponen APIs crudas de clave-valor — proporcionan servicios completos de **SQL/NoSQL**.
- Algunas (Aurora, PostgreSQL, MySQL, Oracle, Percona, etc.) son **RDBMS** tradicionales con mecanismos de replicación.
- Otras (Cassandra, Bigtable, MongoDB, Redis) son sistemas **NoSQL** con diferentes modelos de consistencia.
- FoundationDB se sitúa *por debajo* de estas — no ofrece consultas SQL, sino que proporciona el **sustrato transaccional** sobre el cual podrías construir una (por ejemplo, **Record Layer**).

---

### Infraestructura Colateral

*(BookKeeper, S3/MinIO, ElasticSearch, MeiliSearch)*

- No son bases de datos principales, sino **componentes especializados**:
    - Registros (logs) duraderos.
    - Almacenamiento de objetos.
    - Motores de búsqueda.
- Sin embargo, todos comparten el mismo patrón subyacente: **persistencia de datos con diferentes APIs y modelos de consistencia**.

---

### Capas de Valor Agregado

*(Record Layer, DeepSeek 3FS, Snowflake FrostDB, Adobe Identity Graph, eBay NuGraph — todos construidos sobre FDB, aunque rara vez se reconoce)*

- Utilizan un **sustrato transaccional de clave-valor** como base confiable para implementar **características de alto nivel**:
    - Motores SQL.
    - Almacenes de documentos.
    - Streams (flujos de datos).
    - Conjuntos de datos para aprendizaje automático.
- El ejemplo más claro es **FoundationDB + Record Layer** — Apple construyó **CloudKit** completamente sobre esto.

---

## Nota Final

Siguen surgiendo nuevas tecnologías — **TigrisData**, **Neon**, **FaRM**, **FastACS**, **Yugabyte**, **ScyllaDB**, **TigerBeetle**…

FoundationDB **no es NoSQL**, **no es NewSQL** —

es **el kernel de almacenamiento distribuido**.
