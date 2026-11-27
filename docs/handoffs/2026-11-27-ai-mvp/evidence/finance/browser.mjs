import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { chromium } from '@playwright/test';

const token = process.env.SYNTHETIC_UI_TOKEN;
const backend = process.env.SYNTHETIC_UI_BACKEND;
const journalId = process.env.SYNTHETIC_UI_JOURNAL_ID;
const revision = Number(process.env.SYNTHETIC_UI_REVISION);
const foreignToken = process.env.SYNTHETIC_UI_FOREIGN_TOKEN;
if (
  !token ||
  !foreignToken ||
  !journalId ||
  !Number.isInteger(revision) ||
  !/^http:\/\/127\.0\.0\.1:\d+$/.test(backend ?? '')
)
  throw new Error('synthetic fixture configuration missing');
const temporary = createServer();
await new Promise((resolve) => temporary.listen(0, '127.0.0.1', resolve));
const port = temporary.address().port;
await new Promise((resolve) => temporary.close(resolve));
const child = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      VITE_SYNTHETIC_JOURNAL_REVIEW: 'true',
      FINANCE_API_PROXY_TARGET: backend,
    },
    stdio: 'ignore',
  },
);
let browser;
try {
  const origin = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 150; i++) {
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!ready) throw new Error('Vite did not start');
  browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ locale: 'ko-KR', viewport: { width: 1000, height: 800 } });
  await page.goto(origin, { waitUntil: 'networkidle' });
  const denied = await page.evaluate(async (id) => {
    const response = await fetch(`/finance/journals/${id}/synthetic-ai-review`, {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid', 'X-Synthetic-Journal-Revision': '0' },
    });
    return response.status;
  }, journalId);
  if (denied !== 401) throw new Error('unauthenticated request was not rejected');
  await page.evaluate(
    (value) => sessionStorage.setItem('syntheticJournalReviewToken', value),
    token,
  );
  await page.goto(`${origin}/app/journal/${journalId}`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'AI 복기' }).waitFor();
  await page.getByRole('button', { name: 'AI 복기 시작' }).click();
  await page.getByRole('heading', { name: '기록된 사실' }).waitFor();
  await page.getByRole('heading', { name: '사용자 판단' }).waitFor();
  await page.getByRole('heading', { name: '확인되지 않은 가정' }).waitFor();
  await page.getByRole('heading', { name: '누락 근거와 복기 질문' }).waitFor();
  await page.getByRole('heading', { name: '출처' }).waitFor();
  if (!(await page.locator('body').innerText()).includes(`revision ${revision}`))
    throw new Error('source revision missing');
  if (!(await page.locator('body').innerText()).includes('A기업'))
    throw new Error('source journal missing');
  const staleStatus = await page.evaluate(
    async ({ id, token: credential, staleRevision }) => {
      const response = await fetch(`/finance/journals/${id}/synthetic-ai-review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credential}`,
          'X-Synthetic-Journal-Revision': String(staleRevision),
        },
      });
      return response.status;
    },
    { id: journalId, token, staleRevision: revision + 1 },
  );
  if (staleStatus !== 409) throw new Error('stale revision was not rejected');
  const foreignStatus = await page.evaluate(
    async ({ id, token: credential, currentRevision }) => {
      const response = await fetch(`/finance/journals/${id}/synthetic-ai-review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${credential}`,
          'X-Synthetic-Journal-Revision': String(currentRevision),
        },
      });
      return response.status;
    },
    { id: journalId, token: foreignToken, currentRevision: revision },
  );
  if (foreignStatus !== 404) throw new Error('foreign journal was not rejected');
  await page.screenshot({ path: process.env.SYNTHETIC_UI_SCREENSHOT, fullPage: true });
  await page.goto(`${origin}/app/synthetic-conversation`, { waitUntil: 'networkidle' });
  await page.getByText('합성 사용자를 선택하세요.').waitFor();
  await page.getByLabel('로컬 합성 사용자').selectOption('fixture-a');
  await page.getByLabel('이 대화를 저장할게요').check();
  await page.getByRole('button', { name: '새 대화' }).click();
  await page.getByText('저장할 대화를 만들었습니다.').waitFor();
  await page.getByLabel('질문').fill('합성 대화 질문');
  await page.getByRole('button', { name: '보내기' }).click();
  await page.getByText('나: 합성 대화 질문').waitFor();
  await page.getByText('답변: 합성 예시 답변입니다. 실제 금융 분석이 아닙니다.').waitFor();
  const bLoaded = page.waitForResponse((response) => response.url().endsWith('/synthetic-conversations') && response.request().method() === 'GET' && response.status() === 200);
  await page.getByLabel('로컬 합성 사용자').selectOption('fixture-b');
  await bLoaded;
  await page.getByText('나: 합성 대화 질문').waitFor({ state: 'detached' });
  if (await page.getByRole('button', { name: '저장된 대화' }).count()) throw new Error('foreign synthetic conversation visible');
  await page.getByRole('button', { name: '합성 사용자 로그아웃' }).click();
  await page.getByText('합성 사용자를 선택하세요.').waitFor();
  await page.goto(`${origin}/app/journal/${journalId}`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'AI 복기' }).waitFor();
  if (await page.getByRole('heading', { name: '기록된 사실' }).count()) throw new Error('previous transient review survived navigation');
  console.log('unified FE: Journal then conversation A/B isolation, conversation logout, return to Journal PASS');
  console.log(
    'synthetic browser: unauthorized 401 PASS; real detail GET PASS; Korean result and source PASS; foreign 404 PASS; stale revision 409 PASS',
  );
} finally {
  await browser?.close();
  child.kill('SIGTERM');
}
