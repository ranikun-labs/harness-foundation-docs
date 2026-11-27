# Carelog Assistant synthetic loopback HTTP evidence

Latest local BE `175452a36f583bda8200f7b39f6f5c52f623fa16`, tree `111a3eea67c7164cf446285fb911c90d1c17fb0b`, local FE `101e664ee7c49833e5cd4bc3ada11226f79a5629`. Cumulative patch `carelog-loopback-http-candidate.patch`; earlier patches and results remain pinned to earlier checkpoint revisions.

`AiMemoLoopbackHttpIntegrationTest` covers real loopback HTTP for prepare, save, normal PATCH and stale save. `AtomicSavePostgresIntegrationTest` includes the existing Assistant dev browser, which reaches the same real Spring HTTP test path through the synthetic protocol bridge. Use both focused test classes with local PostgreSQL Testcontainers and the existing FE fixture. The two JUnit files dated 2026-11-27 14:50 UTC record 10/10 on the latest BE. The previous seven session race tests passed at parent `e3258f1949cbcbb36c41927b0562d5c91b3d6417` and were not rerun at the latest commit.
