const { chromium } = require('playwright');
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:1835,height:910}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file:///C:/Users/user/Desktop/demo-ccbot-platform/index.html#live-conversations');
  for(const index of [1,2]) await page.locator('.conversation-table .el-table__row').nth(index).locator('.el-checkbox').click();
  await page.getByRole('button',{name:'監控',exact:true}).click();
  await page.locator('.monitor-page').waitFor({state:'visible'});
  await page.locator('.agent-switch .el-switch').click();
  await page.getByRole('button',{name:'結案',exact:true}).click();
  await page.locator('.el-message-box').waitFor({state:'visible'});
  await page.screenshot({path:'.qa/close-confirm.png'});
  await page.locator('.el-message-box').getByRole('button',{name:'取消',exact:true}).click();
  if(await page.evaluate(()=>!!monitorApp.activeRow.closed)) throw Error('Cancel closed case');
  await page.getByRole('button',{name:'結案',exact:true}).click();
  await page.locator('.el-message-box').getByRole('button',{name:'確定',exact:true}).click();
  await page.getByRole('button',{name:'已結案',exact:true}).waitFor();
  if(!await page.getByRole('button',{name:'已結案',exact:true}).isDisabled())throw Error('Close button enabled');
  if(!await page.locator('.chat-composer textarea').isDisabled())throw Error('Composer enabled');
  await page.locator('.el-message').waitFor({state:'visible'});
  if(await page.locator('.closed-conversation-label').count())throw Error('Premature label');
  await page.screenshot({path:'.qa/close-notification.png'});
  await page.locator('.el-message').waitFor({state:'hidden',timeout:7000});
  await page.locator('.closed-conversation-label').waitFor({state:'visible'});
  await page.screenshot({path:'.qa/close-finished.png'});
  await page.locator('.conversation-choice').nth(1).click();
  if(await page.evaluate(()=>!!monitorApp.activeRow.closed))throw Error('Other case closed');
  await page.locator('.agent-switch .el-switch').click();
  if(!await page.getByRole('button',{name:'結案',exact:true}).isEnabled())throw Error('Other case affected');
  await page.locator('#conversation-records-link').click();
  await page.locator('.records-page').waitFor({state:'visible'});
  const closedStatus = page.locator('.records-table .el-table__row').nth(1).locator('td').nth(12);
  if(await closedStatus.locator('.el-tag--success').innerText() !== '結案')throw Error('Record closed tag');
  for (const index of [0,2]) {
   if((await page.locator('.records-table .el-table__row').nth(index).locator('td').nth(12).innerText()).trim())throw Error('Open status should be blank');
  }
  if(errors.length)throw Error(errors.join('\n'));
  console.log('PASS: cancel, confirm, 5-second notification, delayed label, disabled closed case, independent conversations, record status');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
