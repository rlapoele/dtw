// Reuse current domain/readback helpers for tiny synthetic UI fixtures only.
import {createAuthoringOperations} from '@application/authoring';
import {createProject} from '@domain/project';
import {createToken,type ImplementedAuthoredValue} from '@domain/token';
import {createTokenGroup} from '@domain/token-group';
import {createColorLiteral} from '@domain/color-literal';
import {baseline,type DraftSession} from '@presentation/session';
import type {Project,Token} from './specimens';
export function tokenValue(t:Token):ImplementedAuthoredValue {
 if(t.authored!==undefined)return t.authored as ImplementedAuthoredValue;
 if(t.alias!==undefined)return {kind:'token-reference',targetTokenId:t.alias as never,valuePath:[]};
 return createColorLiteral(t.color??{colorSpace:'srgb',components:[t.value,'0.36','0.72'],alpha:'1'});
}
export function readFixture(p:Project){
 const snapshot={project:createProject({id:p.id,name:p.name}),groups:(p.groups??[]).map(g=>createTokenGroup({id:g.id,projectId:p.id,localName:g.name,parentGroupId:g.parentGroupId})),tokens:p.tokens.map(t=>{
  const value=tokenValue(t);return createToken({id:t.id,projectId:p.id,localName:t.name,parentGroupId:t.parentGroupId??null,description:t.description,layer:t.layer,semanticRole:t.semanticRole,componentDefinitionId:t.componentDefinitionId,regeneration:t.regeneration??'allowed',definition:{type:value.kind==='literal'?value.valueType:value.kind==='expression'?'number':'color',assignments:[{condition:[],value}]}},[]);
 })};
 const ops=createAuthoringOperations({load:id=>({status:'ok',value:id===p.id?snapshot:undefined}),commit:()=>({status:'failure',message:'Read-only fixture adapter'})});
 const result=ops.readProject(p.id);if(result.status==='failure')throw Error('Invalid fixture readback');
 return {project:result.value,validation:ops.validateProject(p.id),inspect:(id:string)=>{const r=ops.inspectToken(p.id,id);return r.status==='ok'?r.value:undefined;}};
}
export function initialSession(p:Project,s:string):DraftSession {
 const t=p.tokens.find(t=>t.id===(s==='changed-reference'?'t-content':'t-brand'))??p.tokens[0];
 const session=baseline(t?tokenValue(t):undefined);
 if(['changed-literal','changed-reference','removed','ineligible','ownership-editor','stale-editor'].includes(s)){
  session.literal={colorSpace:'srgb',components:['0.','0.36','0.72'],alpha:'1'};session.viewSpace='srgb';session.reference='t-brand';session.edited=true;
 }
 if(s==='resource-edit'){session.literal.components[0]='0.25';session.edited=true;}
 return session;
}
export function updatedToken(t:Token,s:DraftSession):Token {
 const next={...t};delete next.authored;
 if(s.mode==='reference'){next.alias=s.reference;next.value='';delete next.color;}
 else{delete next.alias;next.color=structuredClone(s.literal);next.value=s.literal.components[0];}
 return next;
}
