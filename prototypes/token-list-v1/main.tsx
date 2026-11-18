import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {WorkbenchLayout} from '@presentation/App/components/WorkbenchLayout/WorkbenchLayout';
import {ApplicationHeader} from '@presentation/App/components/ApplicationHeader/ApplicationHeader';
import {Button} from '@presentation/ui/button';
import {Input} from '@presentation/ui/input';
import {ColorEditor} from '@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ColorEditor/ColorEditor';
import {baseline} from '@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session';
import {createColorLiteral, type ColorLiteralValue} from '@domain/color-literal';
import {Icon} from './Icon';
import {literalColors, previewHex, ColorSpaces} from './color-values';
import './prototype.css';

type Token = {id:string;name:string;parent:string;type:string;layer:string;description:string;value:string;detail?:string;color?:string;protected?:boolean;target?:string; specimen?:string};
const tokens:Token[] = [
{id:'brand',name:'600',parent:'color / brand',type:'Color',layer:'Primitive',description:'Primary brand blue for interactive elements.',value:'OKLCH',detail:'L 0.5461 · C 0.2152 · H 262.8809°',color:'oklch(0.5461 0.2152 262.8809)',protected:true},
{id:'ink',name:'900',parent:'color / neutral',type:'Color',layer:'Primitive',description:'Deep neutral for high-contrast text.',value:'sRGB',detail:'R 0.0902 · G 0.0902 · B 0.0902',color:'#171717'},
{id:'action',name:'primary',parent:'color / action',type:'Color',layer:'Semantic',description:'Default fill for primary actions.',value:'color / brand / 600',color:'oklch(0.5461 0.2152 262.8809)',target:'brand'},
{id:'text',name:'primary',parent:'color / text',type:'Color',layer:'Semantic',description:'Primary reading color on light surfaces.',value:'color / neutral / 900',color:'#171717',target:'ink',protected:true},
{id:'space',name:'4',parent:'space',type:'Dimension',layer:'Primitive',description:'Base spacing for controls and compact layouts.',value:'16 px',specimen:'space'},
{id:'radius',name:'control',parent:'radius',type:'Dimension',layer:'Semantic',description:'Corner radius shared by buttons and inputs.',value:'6 px',specimen:'radius'},
{id:'button',name:'background',parent:'button / primary',type:'Color',layer:'Component',description:'Resting background of the primary button.',value:'color / action / primary',color:'oklch(0.5461 0.2152 262.8809)',target:'action'},
{id:'duration',name:'fast',parent:'motion / duration',type:'Duration',layer:'Primitive',description:'Short transitions for immediate feedback.',value:'150 ms',specimen:'duration'},
{id:'experimental',name:'accent',parent:'exploration',type:'Color',layer:'—',description:'Candidate accent, awaiting classification.',value:'OKLCH',detail:'L 0.702 · C 0.148 · H 68.4°',color:'oklch(0.702 0.148 68.4)'}
];
function Protection(){return <span className="protection" title="Protected from regeneration" role="img" aria-label="Protected from regeneration"><Icon name="lock" className="size-3.5"/></span>}
function Specimen({token:t}:{token:Token}){return <span className={'specimen '+(t.specimen??'')} style={t.color?{background:t.color}:undefined} aria-hidden="true">{t.specimen==='duration'?<Icon name="clock"/>:null}</span>}
function resolvedColor(t:Token, seen=new Set<string>()):ColorLiteralValue | undefined {
 if(seen.has(t.id)) return undefined;
 seen.add(t.id);
 if(!t.target) return literalColors[t.id];
 const target=tokens.find(candidate=>candidate.id===t.target);
 return target?resolvedColor(target,seen):undefined;
}
function TypeLabel({type}:{type:string}){return <span className="type-label"><Icon name={type==='Color'?'swatch':type==='Dimension'?'measure':'clock'} className="size-3.5"/>{type}</span>}
function Value({token:t}:{token:Token}) {
 const source=resolvedColor(t);
 return <span className="row-value"><Specimen token={t}/><span>
 <span className="value-main">{t.target?<><Icon name="link" className="size-3.5"/>{t.value}</>:t.type==='Color'?previewHex(source):t.value}</span>
 {t.target&&<span className="reference-hex">{previewHex(source)}</span>}
 {t.type==='Color'&&<ColorSpaces source={source} authored={!t.target}/>}
 </span></span>;
}
function App(){
 const [selected,setSelected]=useState('brand'),[query,setQuery]=useState(''),[scope,setScope]=useState('All tokens'),[compact,setCompact]=useState(innerWidth<1120),[inspect,setInspect]=useState(false);
 useEffect(()=>{const fn=()=>setCompact(innerWidth<1120);addEventListener('resize',fn);return()=>removeEventListener('resize',fn)},[]);
 const chosen=tokens.find(t=>t.id===selected)!;
 const shown=tokens.filter(t=>(scope==='All tokens'||t.parent===scope||t.parent.startsWith(scope+' /'))&&`${t.parent} ${t.name} ${t.type} ${t.layer} ${t.description}`.toLowerCase().includes(query.toLowerCase()));
 const select=(id:string)=>{setSelected(id);};
 const navigation=<nav className="sidebar border-r-hairline border-border min-h-0 overflow-auto" aria-label="Project groups"><div className="nav-heading">NAVIGATION<Icon name="chevron-left"/></div><div className="nav-project"><span className="project-tile">T</span><div><strong>Precision</strong><small>Token workbench</small></div></div><div className="nav-label">Library</div><button className={'nav-entry '+(scope==='All tokens'?'active':'')} onClick={()=>setScope('All tokens')}><Icon name="grid"/>All tokens<span>9</span></button><button className="nav-entry" disabled>All content</button><div className="nav-label groups-label">Groups</div>{['color','space','radius','button','motion','exploration'].map(name=><button key={name} className={'nav-entry '+(scope===name?'active':'')} onClick={()=>setScope(name)}><Icon name="folder"/>{name}<span>{tokens.filter(t=>t.parent===name||t.parent.startsWith(name+' /')).length}</span></button>)}<button className="nav-entry new-group" disabled><Icon name="plus"/>New group</button></nav>;
 const inspector=<aside hidden={compact&&!inspect} className="mock-inspector border-l-hairline border-border min-h-0 overflow-auto" aria-label="Inspector pane">{compact&&<Button variant="outline" onClick={()=>setInspect(false)}>Back to tokens</Button>}<div className="inspector-heading"><div><small>{chosen.type.toUpperCase()} TOKEN</small><h2>{chosen.name}</h2><p>{chosen.parent}</p></div><div><small>Current</small><Specimen token={chosen}/></div></div><div className="inspector-tabs"><strong>Authored value</strong><span>Resolved &amp; trace</span></div><div className="inspector-body">{chosen.type==='Color'&&!chosen.target?<><div className="source-toggle"><strong>Literal color</strong><span>Reference</span></div><ColorEditor session={baseline(createColorLiteral(chosen.id==='brand'?{colorSpace:'oklch',components:['0.5461','0.2152','262.8809'],alpha:'1'}:chosen.id==='ink'?{colorSpace:'srgb',components:['0.0902','0.0902','0.0902'],alpha:'1'}:{colorSpace:'oklch',components:['0.702','0.148','68.4'],alpha:'1'}))} readOnly onChange={()=>{}} onError={()=>{}}/></>:chosen.target?<><div className="source-toggle"><span>Literal color</span><strong>Reference</strong></div><label className="reference-label">Referenced token</label><div className="reference-value">{chosen.value}</div><p className="text-caption text-muted-foreground mt-3">The value follows the referenced token.</p></>:<><label className="reference-label">Authored value</label><div className="reference-value">{chosen.value}</div></>}
 <div className="inspector-actions"><Button variant="outline" disabled>Cancel</Button><Button disabled>Apply changes</Button></div><section className="metadata"><h3>Metadata · read only</h3><dl><div><dt>Description</dt><dd>{chosen.description}</dd></div><div><dt>Layer</dt><dd>{chosen.layer==='—'?'Unspecified':chosen.layer}</dd></div><div><dt>Regeneration</dt><dd>{chosen.protected?'Protected':'Allowed'}</dd></div>{chosen.layer==='Component'&&<div><dt>Component</dt><dd>Button</dd></div>}</dl></section></div></aside>;
 const workspace=<main hidden={compact&&inspect} className="token-panel mock-workspace min-w-0 min-h-0 overflow-auto p-6 compact:px-4 compact:py-5"><div className="workspace-heading"><div><small>TOKENS</small><h1>{scope}</h1></div><div className="flex gap-2"><Button variant="outline" disabled><Icon name="folder"/>New group</Button><Button disabled><Icon name="plus"/>New token</Button></div></div><p className="workspace-subtitle">Browse and create tokens.</p><div className="search-wrap"><Icon name="search"/><Input aria-label="Search tokens" placeholder="Search tokens" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="list" role="group" aria-label="Tokens"><div className="list-heading"><span>Token</span><span className="type-column">Type</span><span className="layer-column">Layer</span><span>Value</span></div>{shown.map(t=><button key={t.id} className={'list-row '+(selected===t.id?'selected':'')} aria-pressed={selected===t.id} onClick={()=>select(t.id)}><span className="identity"><span className="identity-name"><strong>{t.name}</strong>{t.protected&&<Protection/>}</span><span className="parent-path">{scope===t.parent?'':scope!=='All tokens'&&t.parent.startsWith(scope+' / ')?t.parent.slice(scope.length+3):t.parent}</span><span className="full-path">{t.parent} / {t.name}</span><span className="compact-meta"><TypeLabel type={t.type}/> · {t.layer==='—'?'Unspecified layer':t.layer}</span><span className="description" title={t.description}>{t.description}</span></span><span className="type-column"><TypeLabel type={t.type}/></span><span className={'layer-column '+(t.layer==='—'?'unspecified':'')}>{t.layer}</span><Value token={t}/></button>)}{shown.length===0&&<p className="empty-list">No matching tokens.</p>}</div><details className="diagnostics"><summary>Project diagnostics · namespace and references</summary><p>No resolution issues.</p></details>{compact&&<div className="compact-inspect"><span>Selected: {chosen.parent} / {chosen.name}</span><Button variant="outline" onClick={()=>setInspect(true)}>Inspect token<Icon name="chevron-right"/></Button></div>}</main>;
 return <WorkbenchLayout compact={compact} narrow={compact} surface={inspect?'inspect':'browse'} header={<ApplicationHeader compactBrand={compact} navigation={compact?<Button variant="outline" onClick={()=>setScope(scope==='All tokens'?'color':'All tokens')}><Icon name="menu"/>Browse</Button>:undefined} context={<span><span className="text-foreground">Projects</span><span className="crumb-separator">/</span>Precision</span>} actions={<><Button variant="outline" disabled><Icon name="undo"/>Undo</Button><Button variant="outline" disabled><Icon name="redo"/>Redo</Button></>}/>} navigation={navigation} workspace={workspace} inspector={inspector} afterBody={<footer className="mock-footer"><span>9 tokens · Applied state</span><span>Retained locally</span><span>▸ About retention</span></footer>}/>;
}
createRoot(document.getElementById('root')!).render(<App/>);
