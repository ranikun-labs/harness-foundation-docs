import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createWriteStream } from 'node:fs';
import { once } from 'node:events';

const finance = '/workspace/work/finance-journal-complete';
const conversation = '/workspace/work/finance-conversation-synthetic';
const platform = '/workspace/work/platform-journal-complete';
const fe = process.env.UNIFIED_FE_DIR;
if (!fe) throw new Error('UNIFIED_FE_DIR required');
const { Client } = createRequire(conversation + '/local-conversation/package.json')('pg');
const name = `finance-unified-${process.pid}`;
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let server;
try {
  docker('run', '--rm', '-d', '--name', name, '-e', 'POSTGRES_PASSWORD=fixture-only', '-e', 'POSTGRES_DB=conversation_fixture', '-p', '127.0.0.1::5432', 'postgres:16-alpine');
  const pgPort = docker('port', name, '5432/tcp').split(':').pop();
  const db = `postgres://postgres:fixture-only@127.0.0.1:${pgPort}/conversation_fixture`;
  let ready = false;
  for (let i = 0; i < 80; i++) {
    const c = new Client({ connectionString: db });
    try { await c.connect(); await c.end(); ready = true; break; }
    catch { await new Promise((resolve) => setTimeout(resolve, 250)); }
  }
  if (!ready) throw new Error('synthetic database unavailable');
  server = spawn(process.execPath, ['local-conversation/server.mjs'], { cwd: conversation, env: { ...process.env, CONVERSATION_DATABASE_URL: db, CONVERSATION_PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  const [first] = await once(server.stdout, 'data');
  const target = first.toString().trim();
  if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(target)) throw new Error('invalid synthetic conversation endpoint');
  const log = createWriteStream('/workspace/work/finance-unified-stacked-84822b1-test.log');
  const env = { ...process.env, GRADLE_USER_HOME: '/workspace/.cloud-setup/cache/gradle', PLATFORM_SYNTHETIC_CHECKOUT: platform,
    PLATFORM_SYNTHETIC_CLASSPATH_FILE: '/workspace/work/platform-journal-complete-final.log', FINANCE_SYNTHETIC_UI_DIR: fe,
    FINANCE_SYNTHETIC_UI_NODE: '/workspace/work/finance-unified-harness/run-browser', FINANCE_SYNTHETIC_UI_SCREENSHOT: '/workspace/work/finance-unified-stacked-84822b1.png',
    VITE_SYNTHETIC_CONVERSATION: 'true', CONVERSATION_FIXTURE_TARGET: target };
  delete env.OPENAI_API_KEY;
  const gradle = spawn('./gradlew', ['-I', 'integration-fixtures/finance-platform/bridge.init.gradle', 'test', '--rerun', '--tests', 'labs.ranikun.finance.generalanalysis.adapter.SyntheticSpringBrowserTest', '--no-daemon', '--offline'], { cwd: finance, env, stdio: ['ignore', 'pipe', 'pipe'] });
  gradle.stdout.pipe(log); gradle.stderr.pipe(log);
  const [code] = await once(gradle, 'exit');
  if (code !== 0) throw new Error(`synthetic combined test failed with exit ${code}`);
  console.log('combined synthetic route harness: PASS');
} finally {
  if (server) { server.kill('SIGTERM'); await Promise.race([once(server, 'exit'), new Promise((resolve) => setTimeout(resolve, 3000))]); }
  try { docker('rm', '-f', name); } catch {}
}
