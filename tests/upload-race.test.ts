import test from 'node:test';
import assert from 'node:assert/strict';
import { createLatestUpload } from '../src/lib/latest-upload.ts';
function deferred<T>() { let resolve!: (value:T)=>void; let reject!: (error:Error)=>void; const promise=new Promise<T>((r,j)=>{resolve=r;reject=j});return {promise,resolve,reject} }

test('a late earlier upload cannot overwrite a newer result or settle its loading state',async()=>{
 const gate=createLatestUpload(),a=deferred<string>(),b=deferred<string>();let text='',settles=0;
 const callbacks={success(value:string){text=value},error(){text='error'},settled(){settles++}};
 const first=gate.run(()=>a.promise,callbacks),second=gate.run(()=>b.promise,callbacks);
 a.resolve('stale A');await first;assert.equal(text,'');assert.equal(settles,0);
 b.resolve('latest B');await second;assert.equal(text,'latest B');assert.equal(settles,1);
});
test('direct text edit or clear invalidates in-flight result and error callbacks',async()=>{
 for(const reject of [false,true]){
  const gate=createLatestUpload(),a=deferred<string>();let text='typed edit',errors=0,settles=0;
  const pending=gate.run(()=>a.promise,{success(value){text=value},error(){errors++},settled(){settles++}});
  gate.invalidate();text='';if(reject)a.reject(new Error('stale failure'));else a.resolve('stale file');
  await pending;assert.equal(text,'');assert.equal(errors,0);assert.equal(settles,0);
 }
});
