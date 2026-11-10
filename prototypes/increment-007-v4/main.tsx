import {createRoot} from 'react-dom/client';
import {useState} from 'react';
import {App} from './App';
import {ReviewContext,type Preparation} from './ExactSource';
import {InMemoryProjectStorage} from '@adapters/in-memory-project-storage';
import {createProject} from '@domain/project';
import {createToken} from '@domain/token';
import {createTokenGroup} from '@domain/token-group';
import {createColorLiteral} from '@domain/color-literal';
import {createTokenReference} from '@domain/token-reference';
import {createFontFamilyLiteral} from '@domain/font-family-literal';
import type {ProjectStorage} from '@application/project-storage';
import './prototype.css';
const projectId='precision-review';
const color=(components:[string,string,string],alpha='1')=>createColorLiteral({colorSpace:'srgb',components,alpha});
const token=(id:string,localName:string,extra:Partial<Parameters<typeof createToken>[0]>={})=>createToken({id,projectId,localName,parentGroupId:null,regeneration:'allowed',...extra},[]);
const names=['Inter','Helvetica Neue','Arial','Noto Sans','Liberation Sans','Source Sans 3','IBM Plex Sans','Work Sans','Public Sans','Figtree','Atkinson Hyperlegible','Lato','Manrope','Mulish','Open Sans','Roboto','system-ui','sans-serif'];
const initial={project:createProject({id:projectId,name:'Precision tokens'}),groups:[createTokenGroup({id:'colors',projectId,localName:'color',parentGroupId:null})],tokens:[
 token('brand','brand',{parentGroupId:'colors',layer:'primitive',semanticRole:'brand.primary',description:'Primary brand color for interactive elements.',definition:{type:'color',assignments:[{condition:[],value:color(['0.231372549019607843','0.509803921568627451','0.964705882352941176'])}]}}),
 token('content','content',{parentGroupId:'colors',layer:'semantic',semanticRole:'content.primary',description:'Text and icon color; linked to the brand token.',definition:{type:'color',assignments:[{condition:[],value:createTokenReference({targetTokenId:'brand',valuePath:[]})}]}}),
 token('surface','surface',{parentGroupId:'colors',layer:'primitive',description:'Quiet surface with independent alpha.',definition:{type:'color',assignments:[{condition:[],value:color(['0.96','0.97','0.98'],'0.8')}]}}),
 token('empty','unassigned'),
 token('family','font-family',{description:'Fallback family list with a long authored family name.',layer:'primitive',definition:{type:'fontFamily',assignments:[{condition:[],value:createFontFamilyLiteral([...names,'Long family '+ 'authored-name-'.repeat(60)].map(name=>({kind:'named' as const,name})))}]}})
]};
function Prototype(){
 const [preparation,setPreparation]=useState<Preparation>('complete');
 const [revision,setRevision]=useState(1);
 const [storage]=useState<ProjectStorage>(()=>{const inner=new InMemoryProjectStorage([initial]);return {load:id=>inner.load(id),commit:snapshot=>{const result=inner.commit(snapshot);if(result.status==='ok')setRevision(r=>r+1);return result;}};});
 return <ReviewContext.Provider value={{preparation,revision}}>
  <div className="review-harness border-b border-border bg-muted px-4 py-2 flex items-center gap-4 text-xs" aria-label="External design review controls">
   <strong>Design review · V4</strong><label className="flex items-center gap-2">Preparation state<select aria-label="Preparation state" className="border border-border rounded-md bg-background px-2 py-1" value={preparation} onChange={e=>setPreparation(e.target.value as Preparation)}><option value="complete">Complete after feedback</option><option value="held">Preparing · held</option><option value="fail-once">Failure · Retry succeeds</option></select></label>
   <a href="./DESIGN-V4.md" target="_blank" rel="noreferrer" className="underline text-muted-foreground">Review notes</a>
  </div>
  <div className="review-product"><App storage={storage} initialProjectId={projectId}/></div>
 </ReviewContext.Provider>;
}
createRoot(document.getElementById('root')!).render(<Prototype/>);
