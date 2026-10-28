const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
 const p=await b.newPage({viewport:{width:1835,height:910}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file:///C:/Users/user/Desktop/demo-ccbot-platform/index.html#phrase-categories');
 const rows=p.locator('.category-management-table .el-table__row');await rows.first().waitFor();if(await rows.count()!==3)throw Error('Grouped rows');
 const search=p.getByPlaceholder('請輸入主分類或次分類');await search.fill('次分類A');if(await rows.count()!==3)throw Error('Premature search');await p.locator('.category-search button').click();if(await rows.count()!==1||await rows.first().locator('.el-tag').count()!==2)throw Error('Full group search');
 await search.fill('');await p.locator('.category-search button').click();await p.screenshot({path:'.qa/grouped-categories.png'});
 await p.getByRole('button',{name:'新增分類',exact:true}).click();const add=p.getByRole('dialog',{name:'新增分類',exact:true});await add.waitFor({state:'visible'});
 await add.getByPlaceholder('請輸入主分類名稱').fill('付款問題');await add.getByPlaceholder('請輸入次分類名稱').fill('信用卡');await add.getByRole('button',{name:'新增',exact:true}).click();
 await add.getByPlaceholder('請輸入次分類名稱').fill('轉帳');await add.getByRole('button',{name:'確定',exact:true}).click();await add.waitFor({state:'hidden'});if(await rows.count()!==4)throw Error('Save group');
 const newRow=rows.filter({hasText:'付款問題'});if(await newRow.locator('.el-tag').count()!==2)throw Error('Children');await newRow.getByRole('button',{name:'付款問題',exact:true}).click();
 const edit=p.getByRole('dialog',{name:'編輯分類',exact:true});await edit.waitFor({state:'visible'});await p.waitForTimeout(350);await p.screenshot({path:'.qa/grouped-category-edit.png'});
 await edit.getByPlaceholder('請輸入主分類名稱').fill('取消測試');await edit.getByRole('button',{name:'取消',exact:true}).click();await edit.waitFor({state:'hidden'});if(!(await newRow.innerText()).includes('付款問題'))throw Error('Cancel');
 await newRow.getByRole('button',{name:'付款問題',exact:true}).click();await edit.locator('.draft-subcategory input').first().fill('信用卡付款');await edit.getByRole('button',{name:'確定',exact:true}).click();await edit.waitFor({state:'hidden'});if(!(await newRow.innerText()).includes('信用卡付款'))throw Error('Edit');
 await newRow.getByRole('button',{name:'刪除',exact:true}).click();const box=p.locator('.el-message-box');await box.waitFor({state:'visible'});if(!(await box.innerText()).includes('2 個次分類'))throw Error('Delete warning');await box.getByRole('button',{name:'確定',exact:true}).click();await box.waitFor({state:'hidden'});if(await rows.count()!==3)throw Error('Delete');
 await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'新增分類',exact:true}).click();await add.waitFor({state:'visible'});await p.waitForTimeout(350);await p.screenshot({path:'.qa/grouped-category-mobile.png'});
 if(errors.length)throw Error(errors.join('\n'));console.log('PASS: grouped rows/tags, explicit search, create multiple subs, edit/cancel, pending sub save, delete confirmation, mobile modal');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
