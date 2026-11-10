import test from 'node:test';
import assert from 'node:assert/strict';
import {listenerPids,boundedCommand} from './driver-diagnostic.mjs';
test('listener field parser preserves distinct actual PIDs, ignores names and duplicates',()=>{
  assert.deepEqual(listenerPids('p234\ncdriver\nu501\nn127.0.0.1:456\np234\np567\n'),[234,567]);
  assert.deepEqual(listenerPids(''),[]);
});
test('nonzero command exit and raw streams remain observable',async()=>{
  const result=await boundedCommand(process.execPath,['-e','process.stdout.write("raw out");process.stderr.write("raw err");process.exit(7)']);
  assert.equal(result.exitCode,7);assert.equal(result.stdout,'raw out');assert.equal(result.stderr,'raw err');assert.equal(result.timedOut,false);
});
test('command timeout remains distinct from nonzero exit',async()=>{
  const result=await boundedCommand(process.execPath,['-e','setTimeout(()=>{},10000)'],100);
  assert.equal(result.timedOut,true);assert.equal(result.signal,'SIGTERM');assert.equal(result.exitCode,null);
});
