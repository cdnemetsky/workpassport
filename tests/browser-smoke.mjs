import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('playwright');
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1360,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({contentType:'application/javascript',body:`
let callback, user=null;const records={work_samples:[],ability_assessments:[],passport_shares:[],talent_preferences:[]};
export function createClient(){return {auth:{onAuthStateChange(fn){callback=fn},async getSession(){return {data:{session:null}}},async signInWithPassword(){user={id:'11111111-1111-4111-8111-111111111111',email:'test@example.invalid'};callback('SIGNED_IN',{user});return {data:{session:{user}}}},async signUp(){return {data:{session:null}}},async signOut(){callback('SIGNED_OUT',null);return {}},async resend(){return {}}},from(name){let op='select',payload,id;let q={select(){return q},eq(k,v){if(k==='id')id=v;return q},order(){return q},maybeSingle(){return q},single(){q.one=true;return q},insert(v){op='insert';payload=v;return q},update(v){op='update';payload=v;return q},upsert(v){op='upsert';payload=v;return q},delete(){op='delete';return q},then(resolve){if(op==='insert'){const row={...payload,id:crypto.randomUUID(),created_at:new Date().toISOString(),token:crypto.randomUUID()};records[name].unshift(row);resolve({data:q.one?row:records[name]});}else if(op==='update'){Object.assign(records[name].find(r=>r.id===id)||{},payload);resolve({data:[]});}else if(op==='delete'){records[name]=records[name].filter(r=>r.id!==id);resolve({data:[]});}else if(op==='upsert'){records[name]=[payload];resolve({data:payload});}else resolve({data:q.one?records[name][0]||null:records[name]});}};return q},functions:{async invoke(){return {error:{context:{async json(){return {error:'AI assessment is not connected yet. Your private sample is saved; no abilities have been invented.'}}}}}}};}
`}));
await page.goto('http://127.0.0.1:8765/');await page.waitForTimeout(300);
assert.equal(await page.locator('#workspace').isVisible(),false);
await page.locator('#begin').click();await page.locator('#authSwitch').click();
await page.locator('#email').fill('test@example.invalid');await page.locator('#password').fill('password1');await page.locator('#confirmPassword').fill('different');await page.locator('#authSubmit').click();
await page.waitForFunction(()=>document.getElementById('message').textContent.includes('Passwords must match'));
await page.locator('#authSwitch').click();await page.locator('#authSubmit').click();await page.locator('#workspace').waitFor({state:'visible'});
await page.locator('#sampleTitle').fill('Work sample test');await page.locator('#sampleContent').fill('I compared three failed runs and added a validation check.');await page.locator('#consent').check();await page.locator('#assessButton').click();
await page.waitForFunction(()=>document.getElementById('message').textContent.includes('not connected yet'));
assert.equal(await page.locator('#samples .record').count(),1);
await page.locator('[data-tab="privacy"]').click();await page.locator('#createShare').click();
assert.match(await page.locator('#message').textContent(),/Select approved assessments/);
await page.screenshot({path:'/workspace/scratch/9de9e4bf5814/workpassport-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await page.locator('[data-tab="discover"]').click();
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.locator('#signout').click();await page.locator('#workspace').waitFor({state:'hidden'});
assert.equal(await page.locator('#sampleContent').inputValue(),'');
assert.deepEqual(errors,[]);console.log('Browser smoke passed: signup validation, sign-in UI, private save, honest AI failure, share selection, mobile layout, sign-out clearing. SDK mocked; not a real account/AI test.');
await browser.close();
