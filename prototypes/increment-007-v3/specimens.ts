import type {LiteralDraft} from '@presentation/session';
// Small UI specimens, not a persistence schema or a production decoder.
export type Group={id:string;name:string;parentGroupId:string|null};
export type Token={id:string;name:string;value:string;description:string;alias?:string;parentGroupId?:string|null;authored?:unknown;componentDefinitionId?:string;layer?:'primitive'|'semantic'|'component';semanticRole?:string;regeneration?:'allowed'|'protected';color?:LiteralDraft;inspectOnly?:boolean};
export type Project={id:string;name:string;updated:string;tokens:Token[];groups?:Group[];diagnostics?:boolean};
export const supplementalScenarios=[
 ['resource-edit','Resource · ordinary edit refused'],['resource-form','Resource · create form refused'],['resource-retained','Resource · retained record unavailable'],['resource-backup','Resource · backup representation refused'],['resource-capacity','Resource · project capacity refused'],
 ['costly','Derived calculation unavailable'],['report-limit','Diagnostics report incomplete'],
 ['changed-literal','Recovered literal · baseline changed'],['changed-reference','Recovered reference · baseline changed'],['changed-create','Recovered creation · parent changed'],['changed-rename','Recovered rename · group changed'],['removed','Recovered edit · target removed'],['ineligible','Recovered edit · target ineligible'],['broken-context','All content · broken namespace / opaque identities'],
 ['unknown-failed','Interrupted · result check fails'],['unknown-exit-blocked','Interrupted · exit not yet safe']
] as const;
export type ExtraScenario=typeof supplementalScenarios[number][0];
export const isExtra=(s:string):s is ExtraScenario=>supplementalScenarios.some(([id])=>id===s);
export const workspaceExtra=(s:string)=>isExtra(s)&&!['resource-retained','resource-backup','resource-capacity','unknown-failed','unknown-exit-blocked'].includes(s);
export function specimen(s:string,base:Project):Project {
 const p=structuredClone(base);p.groups=[{id:'g-color',name:'color',parentGroupId:null}];
 if(s==='changed-create'||s==='changed-rename')p.groups=[{id:'g-color',name:'Foundations revised',parentGroupId:null}];
 if(s==='changed-literal')p.tokens[0].value='0.42';
 if(s==='changed-reference')p.tokens[1].alias='t-surface';
 if(s==='removed')p.tokens=p.tokens.filter(t=>t.id!=='t-brand');
 if(s==='ineligible'){p.tokens[0].inspectOnly=true;p.tokens[0].layer='component';p.tokens[0].componentDefinitionId='button';}
 if(s==='costly')p.tokens.push({id:'t-expression',name:'size.calculated',value:'',description:'Authored expression preserved; derived evaluation is unavailable.',inspectOnly:true,authored:{kind:'expression',operation:'portable.math.scale.v1',operands:[{kind:'token-reference',targetTokenId:'t-expression-base',valuePath:[]},{kind:'literal',valueType:'number',value:'2'}]}} ,{id:'t-expression-base',name:'size.base',value:'',description:'Exact numeric source.',inspectOnly:true,authored:{kind:'literal',valueType:'number',value:'4'}});
 if(s==='report-limit'){p.diagnostics=true;p.tokens[1].alias='missing-target';}
 if(s==='broken-context'){
  p.id='';p.name='Diagnostic collection';p.diagnostics=true;
  p.groups=[{id:'',name:'Empty identity parent',parentGroupId:null},{id:'shared',name:'Orphan group',parentGroupId:'missing-parent'},{id:'cycle-a',name:'Cycle A',parentGroupId:'cycle-b'},{id:'cycle-b',name:'Cycle B',parentGroupId:'cycle-a'},{id:'empty-group',name:'Empty group',parentGroupId:null}];
  p.tokens=[{id:'',name:'At actual root',value:'0.1',description:'Null parent is actual project root.',parentGroupId:null},{id:'shared',name:'Child of empty identity',value:'0.2',description:'Parent ID is the empty string; this is not root.',parentGroupId:''},{id:'orphan',name:'Orphan color',value:'0.3',description:'Missing parent preserved.',parentGroupId:'missing-parent'},{id:'cyclic-token',name:'In cycle',value:'0.4',description:'Cyclic ancestry is not a partial path.',parentGroupId:'cycle-a'},{id:'component',name:'button.foreground',value:'0.5',description:'Association preserved without owned component context.',parentGroupId:null,layer:'component',componentDefinitionId:'',inspectOnly:true},{id:'  ',name:' ',value:'',alias:'',description:'Whitespace ID and empty target ID remain exact.',parentGroupId:null}];
 }
 return p;
}
export function pathInfo(p:Project,e:{name:string;parentGroupId?:string|null}):{path:string;reason?:string}{
 const parts=[e.name];let parent=e.parentGroupId??null;const seen=new Set<string>();
 while(parent!==null){if(seen.has(parent))return {path:'Path unavailable',reason:'group-cycle'};seen.add(parent);const g=p.groups?.find(x=>x.id===parent);if(!g)return {path:'Path unavailable',reason:'missing-parent-group'};parts.unshift(g.name);parent=g.parentGroupId;}
 return {path:parts.map(x=>JSON.stringify(x)).join(' / ')};
}
export const authoredText=(t:Token)=>t.color?JSON.stringify({kind:'literal',valueType:'color',...t.color},null,2):t.authored?JSON.stringify(t.authored,null,2):t.alias!==undefined?`Reference → ${JSON.stringify(t.alias)} (whole value)`:`sRGB (${t.value}, 0.36, 0.72) / 1`;
