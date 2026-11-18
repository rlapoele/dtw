import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import type {CatalogueEntry} from '@application/retention/ports';
import {WorkbenchLayout} from '@presentation/App/components/WorkbenchLayout/WorkbenchLayout';
import {ApplicationHeader} from '@presentation/App/components/ApplicationHeader/ApplicationHeader';
import {ProjectList} from '@presentation/App/components/ProjectsWorkbench/components/ProjectList/ProjectList';
import {ProjectInspector} from '@presentation/App/components/ProjectsWorkbench/components/ProjectInspector/ProjectInspector';
import {CreateProjectForm} from '@presentation/App/components/ProjectsWorkbench/components/CreateProjectForm/CreateProjectForm';
import {StorageProtection} from '@presentation/App/components/ProjectsWorkbench/components/StorageProtection/StorageProtection';
import {Button} from '@presentation/ui/button';
import {Icon} from '@presentation/ui/icon';
import './prototype.css';

const projects:CatalogueEntry[]=[
 {rowKey:'precision',id:'8ab642af-e806-4925-9038-ef5637d4c291',status:'supported',name:'Precision',revision:'1',tokens:42,groups:8},
 {rowKey:'editorial',id:'3c470e98-501d-40ab-b156-07f2e6c84052',status:'supported',name:'Editorial foundation',revision:'1',tokens:18,groups:5},
 {rowKey:'explorations',id:'b1590451-1ccd-42dc-99f8-21ed33d80206',status:'supported',name:'Color explorations',revision:'1',tokens:9,groups:3},
];
function App(){
 const [selected,setSelected]=useState(projects[0]),[collapsed,setCollapsed]=useState(false),[narrow,setNarrow]=useState(innerWidth<880),[surface,setSurface]=useState<'browse'|'inspect'>('browse');
 const browseRef=useRef<HTMLElement>(null),inspectorRef=useRef<HTMLElement>(null),inspectButtonRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const resize=()=>setNarrow(innerWidth<880);addEventListener('resize',resize);return()=>removeEventListener('resize',resize)},[]);
 function show(next:'browse'|'inspect'){setSurface(next);requestAnimationFrame(()=>{if(next==='inspect')inspectorRef.current?.focus();else inspectButtonRef.current?.focus()});}
 const workspace=<main ref={browseRef} tabIndex={-1} hidden={narrow&&surface==='inspect'} className="projects-browse min-w-0 min-h-0 overflow-auto p-7 touch:px-4 touch:py-5"><div className="projects-content">
  <p className="eyebrow text-muted-foreground uppercase mb-2">Your workspace</p>
  <h1>Projects in this browser</h1>
  <p className="text-muted-foreground mt-3">Applied work is retained automatically. Keep independent backups: browser storage can be cleared or become unavailable.</p>
  <div className="flex items-center justify-between gap-3 border-t-hairline border-border mt-7 pt-4 mb-4"><h2>Local collection</h2><span className="font-mono text-caption text-muted-foreground">3 projects</span></div>
  <ProjectList entries={projects} disabled={false} selected={selected.rowKey} onSelect={setSelected}/>
  {narrow&&<Button ref={inspectButtonRef} className="w-full" onClick={()=>show('inspect')}>Inspect selected project</Button>}
  <CreateProjectForm name="" disabled pending={false} error="" nameRef={null} onNameChange={()=>{}} onSubmit={()=>{}}/>
  <section className="mt-8 border-t-hairline border-border pt-6"><h2 className="mb-3">Restore backup</h2><label className="text-caption block">Project backup file<input className="block mt-3 max-w-full min-h-9" type="file" disabled/></label></section>
  <StorageProtection status="protected" disabled onRetry={()=>{}}/>
  <p id="project-error" className="sr-only"/>
 </div></main>;
 const inspector=<section ref={inspectorRef} tabIndex={-1} aria-label="Project inspector" hidden={narrow&&surface!=='inspect'} className="projects-inspector min-w-0 min-h-0 overflow-auto border-l-hairline border-border bg-surface">
  {narrow?<div className="p-4 border-b-hairline border-border"><Button variant="outline" onClick={()=>show('browse')}><Icon name="chevron-left"/>Back to projects</Button></div>:<div className="inspector-rail-heading"><span hidden={collapsed}>INSPECTOR</span><Button variant="ghost" aria-label={collapsed?'Expand inspector':'Collapse inspector'} aria-expanded={!collapsed} onClick={()=>setCollapsed(!collapsed)}><Icon name={collapsed?'chevron-left':'chevron-right'}/></Button></div>}
  {(!collapsed||narrow)&&<ProjectInspector entry={selected} missing={false} disabled onOpen={()=>{}} onDownload={()=>{}}/>}
 </section>;
 return <div className={'preview-page '+(collapsed&&!narrow?'preview-collapsed':'')}>
  <aside className="preview-toolbar" aria-label="Mockup controls"><strong>Layout preview</strong><label>Inspector <select aria-label="Preview inspector state" disabled={narrow} value={narrow?'compact':collapsed?'collapsed':'expanded'} onChange={e=>setCollapsed(e.target.value==='collapsed')}>{narrow&&<option value="compact">Compact</option>}<option value="expanded">Expanded</option><option value="collapsed">Collapsed</option></select></label><span>{narrow?'Compact browse / inspect':collapsed?'Collapsed rails: 3.25rem each':'Expanded sides: up to 25rem each'}</span><small>Sample data · actions disabled</small></aside>
  <WorkbenchLayout narrow={narrow} surface={surface} header={<ApplicationHeader actions={<span className="projects-header-context text-caption text-muted-foreground">Browser local</span>}/>} workspace={workspace} inspector={inspector}/>
 </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
