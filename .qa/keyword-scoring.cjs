const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1835, height: 910 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('file:///C:/Users/user/Desktop/demo-ccbot-platform/index.html#live-conversations');
    await page.locator('.conversation-table .el-table__row').nth(1).locator('.el-checkbox').click();
    await page.getByRole('button', { name: '監控', exact: true }).click();
    await page.locator('.monitor-page').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: '模擬用戶訊息', exact: true }).click();
    const input = page.getByPlaceholder('例如：我要找主管');
    await input.fill('我要找主管');
    await page.getByRole('button', { name: '送出用戶訊息', exact: true }).click();
    await input.waitFor({ state: 'hidden' });
    const getScore = () => page.evaluate(() => conversations.rows[1].warning);
    if (await getScore() !== 3) throw Error('Initial +3');
    await page.evaluate(() => keywordApp.groups.push({ id: 99, flag: '警示', weight: 2, enabled: true, words: '退款', description: '退款測試' }));
    await page.getByRole('button', { name: '模擬用戶訊息', exact: true }).click();
    await input.fill('我要退款');
    await page.getByRole('button', { name: '送出用戶訊息', exact: true }).click();
    await input.waitFor({ state: 'hidden' });
    if (await getScore() !== 5) throw Error('Cumulative +2');
    await page.locator('#live-conversations-link').click();
    await page.locator('.conversations-page').waitFor({ state: 'visible' });
    if (await page.locator('.conversation-table .el-table__row').nth(1).locator('td').nth(1).innerText() !== '5') throw Error('Live table');
    await page.locator('#conversation-records-link').click();
    await page.locator('.records-page').waitFor({ state: 'visible' });
    if (await page.locator('.records-table .el-table__row').nth(1).locator('td').nth(1).innerText() !== '5') throw Error('Record table');
    const checks = await page.evaluate(() => {
      const groups = [{ id: 1, words: '找主管,找主管', weight: 3, enabled: true }, { id: 2, words: '退款', weight: 2, enabled: true }, { id: 3, words: '停用', weight: 9, enabled: false }];
      const results = [scoreKeywords('找主管找主管', groups).total, scoreKeywords('找主管及退款', groups).total, scoreKeywords('停用', groups).total];
      const other = conversations.rows[2].warning;
      const before = conversations.rows[1].warning;
      monitorApp.human = true;
      monitorApp.draft = '找主管退款'; monitorApp.send();
      return { results, other, unchanged: conversations.rows[1].warning === before };
    });
    if (JSON.stringify(checks.results) !== '[3,5,0]' || checks.other !== 0 || !checks.unchanged) throw Error(JSON.stringify(checks));
    if (errors.length) throw Error(errors.join('\n'));
    console.log('PASS: inbound UI +3 then +2=5, both tables, per-chat isolation, disabled groups, duplicate words, multi-keyword sum, staff replies excluded');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
