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
import type {ProjectStorage} from '@application/project-storage';
import './prototype.css';
const projectId='precision-review';
const color=(components:[string,string,string],alpha='1')=>createColorLiteral({colorSpace:'srgb',components,alpha});
const token=(id:string,localName:string,extra:Partial<Parameters<typeof createToken>[0]>={})=>createToken({id,projectId,localName,parentGroupId:null,regeneration:'allowed',...extra},[]);
export const descriptions = {
 prose: 'Primary background for interactive elements. Keep the surrounding interface quiet so designers can concentrate on meaningful relationships, accessibility guidance and reusable foundations. Review foreground contrast before choosing this color for navigation or documentation.',
 lines: 'First paragraph: use for quiet application surfaces.\nKeep this instruction on its own authored line.\n\nSecond paragraph: preserve this blank line and  two internal spaces.\nFinal note: no automatic rewriting.',
 unbroken: 'Reference: https://design.example.test/foundations/background/InteractiveSurfacePrimaryForDocumentationAndNavigationWithoutAdditionalSeparators0123456789\nIdentifier: SurfaceBackgroundInteractivePrimary',
 cjk: '背景色はインターフェースの階層を示します。重要な操作と説明文の読みやすさを確認してください。「主背景」、補助背景、境界線を区別します。\n设计令牌应保留原始说明、标点符号和语义；不要自动改写作者的内容。',
 rtl: 'شرح اللون الأساسي: يُستخدم للخلفيات الهادئة وعناصر التنقل. راجع وضوح النص قبل اعتماد اللون. Token background.primary / الإصدار 2 — مثال مختلط باللغة العربية والإنجليزية.\nצבע רקע ראשי: בדקו קריאות וניגודיות לצד foreground.primary.',
 marks: 'Combining marks: Cafe\u0301, nai\u0308ve, A\u030Angstro\u0308m. Emoji sequences: 👩🏽‍💻 👨‍👩‍👧‍👦 🏳️‍🌈 🇫🇷. Review these characters beside ordinary description words such as accessibility, documentation and background. Preserve every authored character.',
};
const initial={project:createProject({id:projectId,name:'Precision tokens'}),groups:[createTokenGroup({id:'colors',projectId,localName:'color',parentGroupId:null})],tokens:[
 ...Object.entries(descriptions).map(([id,description],i)=>token(id,id,{parentGroupId:'colors',layer:i===1?'semantic':'primitive',semanticRole:i===1?'content.primary':undefined,description,definition:{type:'color',assignments:[{condition:[],value:i===1?createTokenReference({targetTokenId:'prose',valuePath:[]}):color(['0.231372549019607843','0.509803921568627451','0.964705882352941176'])}]}})),
 token('empty','unassigned')
]};
function Prototype(){
 const [preparation,setPreparation]=useState<Preparation>('complete');
 const [wrapping,setWrapping]=useState('candidate');
 const [revision,setRevision]=useState(1);
 const [storage]=useState<ProjectStorage>(()=>{const inner=new InMemoryProjectStorage([initial]);return {load:id=>inner.load(id),commit:snapshot=>{const result=inner.commit(snapshot);if(result.status==='ok')setRevision(r=>r+1);return result;}};});
 return <ReviewContext.Provider value={{preparation,revision}}>
  <div className="review-harness border-b border-border bg-muted px-4 py-2 flex items-center gap-4 text-xs" aria-label="External design review controls">
   <strong>Design review · V5</strong><label className="flex items-center gap-2">Description wrapping<select aria-label="Description wrapping" className="border border-border rounded-md bg-background px-2 py-1" value={wrapping} onChange={e=>setWrapping(e.target.value)}><option value="candidate">Candidate · break-all</option><option value="current">Current · wrap-anywhere</option></select></label><label className="flex items-center gap-2">Preparation state<select aria-label="Preparation state" className="border border-border rounded-md bg-background px-2 py-1" value={preparation} onChange={e=>setPreparation(e.target.value as Preparation)}><option value="complete">Complete after feedback</option><option value="held">Preparing · held</option><option value="fail-once">Failure · Retry succeeds</option></select></label>
   <a href="./DESIGN-V5.md" target="_blank" rel="noreferrer" className="underline text-muted-foreground">Review notes</a>
  </div>
  <div className="review-product" data-wrapping={wrapping}><App storage={storage} initialProjectId={projectId}/></div>
 </ReviewContext.Provider>;
}
createRoot(document.getElementById('root')!).render(<Prototype/>);
