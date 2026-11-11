import {it,expect} from 'vitest';
import {encodeBackup} from '@application/retention/codec';
import {decodeRetainedRecord} from '@application/retention/record';
const snapshot={project:{id:'p',name:'P'},groups:[],tokens:[]};
const record={recordVersion:1,authoredVersion:1,revision:' ',lastAcceptedCommand:{commandId:' ',operation:'createProject',result:{entityKind:'project',id:'p'}},snapshot};
it('demonstrates whitespace internal revision/command accepted',()=>{expect(decodeRetainedRecord(record,'p').revision).toBe(' ')});
it('demonstrates retained metadata getter executes',()=>{let calls=0;const value={...record,get revision(){calls++;return 'r'}};decodeRetainedRecord(value,'p');expect(calls).toBeGreaterThan(0)});
it('demonstrates wrapper order differs from required schema order',()=>{expect(Object.keys(JSON.parse(encodeBackup(snapshot,'2026-11-10T12:00:00.000Z')))).toEqual(['authoredVersion','createdAt','format','formatVersion','snapshot'])});

import {createRetainedWorkbench} from '@application/retention/service';
import type {RetentionPort,WriteAttempt} from '@application/retention/ports';
it('demonstrates readback available despite database incarnation change',async()=>{let n=0;let attempt:WriteAttempt;const port:RetentionPort={async catalogue(){return []},async acquire(){return true},owns(){return true},async release(){},async read(){return ++n===1?{incarnation:'old',record:undefined}:{incarnation:'new',record:attempt.record}},async commit(a){attempt=a;return {status:'retained'}}};let id=0;const app=createRetainedWorkbench(port,()=>`id${++id}`);const result=await app.createProject({id:'p',name:'P'});expect(result.status).toBe('retained');if(result.status==='retained')expect(result.readback).toBe('available');});
it('demonstrates check accepts mismatched operation/result receipt sharing commandId',async()=>{let attempt:WriteAttempt|undefined;const port:RetentionPort={async catalogue(){return []},async acquire(){return true},owns(){return true},async release(){},async read(){return {incarnation:'db',record:attempt?{...attempt.record,lastAcceptedCommand:{commandId:attempt.record.lastAcceptedCommand.commandId,operation:'createGroup',result:{entityKind:'group',id:'missing'}}}:undefined}},async commit(a){attempt=a;return {status:'unknown',reason:'lost'}}};let id=0;const app=createRetainedWorkbench(port,()=>`id${++id}`);expect((await app.createProject({id:'p',name:'P'})).status).toBe('unknown');expect((await app.checkRetainedResult()).status).toBe('retained');});
