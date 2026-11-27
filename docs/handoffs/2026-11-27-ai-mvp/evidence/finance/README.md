# Synthetic unified Finance route check

This is an external test harness, not product code or an approval to run real data. It uses unchanged local checkouts: Finance FE `76f11c9ed99f0211ca265fbb783cf7c1585614b7`, Finance BE `6c396ebdcc42e5452be2e14d8a1cb44e95799665`, Platform `14d78f00387fe2669e54a4678f1a60ae0c359e74`, synthetic Conversation BE `9acb5b1e5cc509b3f6f6637cf9e77f8f795d74e9`. `browser.mjs` extends the existing Journal browser test without modifying the FE checkout; `run-browser` invokes it. `/workspace/work/finance-unified-local-run.mjs` starts a disposable local conversation Postgres container and Node backend, runs the Finance Spring/Postgres/mTLS browser test with both Vite proxies enabled, then stops its own backend/container. The Finance test owns and stops its Spring/Platform processes and temporary certificate material.

Prerequisites are the four fixed checkouts at the paths in the orchestrator, a built Platform synthetic child runtime classpath at `/workspace/work/platform-journal-complete-final.log`, FE dependencies, Conversation `local-conversation/node_modules`, `/usr/bin/chromium`, local Docker image `postgres:16-alpine`, JDK 21, Node 22 and the offline Gradle cache. The Platform checkout can build its test runtime classpath using the `platform-classpath.init.gradle` and instructions in Finance `integration-fixtures/finance-platform/README.md`. The paths are local-only and must be adjusted deliberately if the workspace changes.

Run from this workspace with `OPENAI_API_KEY` unset:

```sh
env -u OPENAI_API_KEY UNIFIED_FE_DIR=/workspace/work/finance-unified-final-fe /workspace/.cloud-setup/tools/node/bin/node /workspace/work/finance-unified-local-run.mjs
```

The test uses synthetic owner tokens and a separate user-selected synthetic conversation actor. It checks Journal 401/GET/review/foreign/stale/mTLS and then a saved conversation under actor A, actor B isolation after B's GET completes, conversation-local logout and return to Journal with the old transient result cleared. It deliberately does not claim a shared user identity, shared session epoch, global logout or automatic cross-feature revocation: the conversation selector and Journal token are independent fixtures. Those contracts belong to Normal Main and must be decided and integrated before any real-user activation. Finance's product data allowlist/retention and Shared AI production service authentication and authorization are separate gates. No real account, Journal, model or external market data is used.

## Updated FE candidate

Apply `finance-selection-races.patch` on top of FE `76f11c9ed99f0211ca265fbb783cf7c1585614b7` to reproduce tree `c544891fe18fd8dfcec0cc9ebb28c576b3da7dc5`, local commit `84822b1bb00a6894c44a1c7c6d692b5bc218d62b`. Run the same harness via `finance-unified-stacked-84822b1-run.mjs`. The corresponding screenshot and JUnit result use the new candidate; the three backend revisions are unchanged. The Journal race-focused frontend tests passed 3/3. The Conversation identity-switch browser scenario passed on the parent `2b65499`; browser cancellation cannot roll back a message already committed by the synthetic backend.
