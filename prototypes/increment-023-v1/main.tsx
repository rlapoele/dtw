import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Tabs } from "@base-ui/react/tabs";
import { Button } from "@presentation/ui/button";
import { Field } from "@presentation/ui/field";
import { Select } from "@presentation/ui/select";
import { Icon } from "@presentation/ui/icon";
import { ColorEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/ColorEditor/ColorEditor";
import { baseline, literalIssue, type DraftSession } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/state/editor-session";
import { createColorLiteral } from "@domain/color-literal";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
import { hexPreview } from "@presentation/App/components/TokensWorkbench/helpers/hex-preview";
import { authoredColorCoordinates } from "@presentation/App/components/TokensWorkbench/helpers/authored-color";
import { spaceName } from "@presentation/App/helpers/color-space";
import "./prototype.css";

type SectionKey = "edit" | "applied" | "metadata" | "source" | "resolved" | "trace" | "diagnostics" | "raw";
type Scenario = "ordinary" | "failure" | "conflict" | "readonly" | "source-failure";
const initialSections: Record<SectionKey, boolean> = {edit:true,applied:true,metadata:true,source:false,resolved:true,trace:true,diagnostics:true,raw:false};
const blue = createColorLiteral({colorSpace:"srgb",components:["0.2","0.4","0.6"],alpha:"1"});
const sample = {description:"Primary action background. Use with the on-accent text color.", session:baseline(blue,"semantic")};
const reference = createColorLiteral({colorSpace:"oklch",components:["0.55","0.14","250"],alpha:"1"});

function Section({title,open,onToggle,children,footer,badge}:{title:string;open:boolean;onToggle:()=>void;children:ReactNode;footer?:ReactNode;badge?:string}) {
  const id=useId();
  return <section className="preview-section">
    <h3><button type="button" className="preview-section-trigger" aria-expanded={open} aria-controls={id} onClick={onToggle}>
      <span>{title}</span>{badge&&<span className="text-muted-foreground font-normal">{badge}</span>}<Icon name="chevron-right" className="chevron size-4"/>
    </button></h3>
    <div id={id} hidden={!open} className="preview-section-content">{children}</div>
    {footer}
  </section>;
}
function Rows({rows}:{rows:[string,ReactNode][]}) {return <dl>{rows.map(([label,value])=><div className="preview-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
function Source({open,data,revision,kind,fail}:{open:boolean;data:unknown;revision:number;kind:string;fail:boolean}) {
  const [text,setText]=useState<string>(),[loading,setLoading]=useState(false),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{
    if(!open){setText(undefined);setLoading(false);setError(false);return;}
    let current=true;setText(undefined);setLoading(true);setError(false);
    const timer=setTimeout(()=>{if(current){if(fail&&attempt===0)setError(true);else setText(JSON.stringify(data,null,2));setLoading(false)}},450);
    return()=>{current=false;clearTimeout(timer)};
  },[open,revision,attempt,fail]);
  return <><p className="text-caption text-muted-foreground mb-3">Read only · Revision {revision}. Large source is prepared only when opened.</p>
    {loading&&<p role="status" className="text-caption">Preparing {kind}…</p>}
    {error?<div role="status"><p className="text-caption mb-2">Source unavailable. Applied data and drafts are unchanged.</p><Button onClick={()=>setAttempt(attempt+1)}>Retry source</Button></div>:text!==undefined&&<pre className="preview-source" tabIndex={0} aria-label={kind}>{text}</pre>}
  </>;
}
function App(){
  const [applied,setApplied]=useState(sample),[draft,setDraft]=useState(sample),[sections,setSections]=useState(initialSections),[tab,setTab]=useState("applied"),[scenario,setScenario]=useState<Scenario>("ordinary"),[reviewed,setReviewed]=useState(false),[notice,setNotice]=useState(""),[error,setError]=useState(""),[revision,setRevision]=useState(1),[pending,setPending]=useState(false),[focusOnly,setFocusOnly]=useState(false);
  const descriptionRef=useRef<HTMLTextAreaElement>(null),errorRef=useRef<HTMLParagraphElement>(null),reviewRef=useRef<HTMLButtonElement>(null);
  const fingerprint=(value:typeof draft)=>JSON.stringify({description:value.description,layer:value.session.layer,mode:value.session.mode,literal:value.session.literal,reference:value.session.reference,hexText:value.session.hexText,hexInvalid:value.session.hexInvalid,byteText:value.session.byteText,byteInvalid:value.session.byteInvalid});
  const dirty=fingerprint(draft)!==fingerprint(applied),readOnly=scenario==="readonly";
  const unavailable=scenario==="conflict"&&!reviewed;
  const color=draft.session.mode==="reference"?reference:draft.session.literal;
  const appliedColor=applied.session.mode==="reference"?reference:applied.session.literal;
  const issue=draft.session.mode==="literal"?(draft.session.hexInvalid?"Complete the HEX entry.":draft.session.byteInvalid?"Complete the RGB entries.":literalIssue(draft.session.literal)):undefined;
  const mark=(next:typeof draft)=>{setDraft(next);setNotice("");setError("")};
  const toggle=(key:SectionKey)=>setSections(previous=>({...previous,[key]:!previous[key]}));
  const revealDescription=()=>{setSections(previous=>({...previous,edit:true}));requestAnimationFrame(()=>descriptionRef.current?.focus())};
  function cancel(){setDraft(structuredClone(applied));setError("");setNotice("Draft discarded. Applied token unchanged.");revealDescription()}
  function apply(){
    if(!dirty||readOnly||unavailable||pending)return;
    if(issue){setError(issue);requestAnimationFrame(()=>errorRef.current?.focus());return;}
    if(scenario==="failure"){setError("Changes could not be saved. Your draft is preserved; try again after the simulated failure is cleared.");requestAnimationFrame(()=>errorRef.current?.focus());return;}
    setPending(true);setError("");
    setTimeout(()=>{const next=structuredClone(draft);next.session.edited=false;setApplied(next);setDraft(next);setRevision(r=>r+1);setPending(false);setNotice("Description, layer and value applied together.");revealDescription()},350);
  }
  function chooseScenario(next:Scenario){setScenario(next);setError("");setReviewed(false);setNotice("")}
  const data={id:"token-accent-01",projectId:"project-precision",localName:"primary",description:applied.description||undefined,layer:applied.session.layer,value:applied.session.mode==="reference"?{kind:"token-reference",targetTokenId:"token-blue-600"}:appliedColor};
  const resolution={status:"resolved",value:appliedColor,trace:applied.session.mode==="reference"?["color.action.primary","color.blue.600"]:["color.action.primary"],diagnostics:[]};
  const footer=<div className="preview-edit-footer">
    {readOnly?<p className="text-caption text-muted-foreground">Inspection only for this sample token. Applied information remains available below.</p>:<>
      {scenario==="conflict"&&<div className="border-hairline border-border rounded p-3 mb-3 text-caption"><p className="font-semibold mb-1">Applied token changed elsewhere</p><p className="mb-2">Your description, layer and value draft are preserved. Review the current description before reapplying.</p><Rows rows={[["Previous description",applied.description],["Current description","Updated guidance from another session."]]}/><Button ref={reviewRef} className="mt-2" disabled={reviewed} onClick={()=>{setReviewed(true);setNotice("Current applied changes reviewed. Reapply is available.")}}>{reviewed?"Changes reviewed":"Review current changes"}</Button></div>}
      {error&&<p ref={errorRef} tabIndex={-1} role="alert" className="text-caption text-destructive mb-3">{error}</p>}
      <div className="flex justify-end gap-2 border-t-hairline border-border pt-3 mb-2">
        <Button disabled={!dirty||pending} onClick={cancel}>Cancel</Button>
        <Button variant="default" disabled={!dirty||pending||unavailable||!!issue} onClick={apply}>{pending?"Applying…":scenario==="conflict"&&reviewed?"Reapply changes":"Apply changes"}</Button>
      </div>
      <p role="status" className="text-caption text-muted-foreground">{notice||(dirty?"Changes are not applied yet.":"Description, layer and value share Apply and Cancel.")}</p>
      {issue&&<p className="text-caption text-destructive mt-2">{issue} <button className="underline" onClick={revealDescription}>Open editable fields</button></p>}
    </>}
  </div>;
  return <div className={`preview-root ${focusOnly?"preview-focus":""}`}>
    <aside className="preview-chrome" aria-label="Prototype controls"><strong>Inspector V1</strong><label>Scenario <Select value={scenario} onChange={e=>chooseScenario(e.target.value as Scenario)}><option value="ordinary">Ordinary editing</option><option value="failure">Save failure</option><option value="conflict">Changed elsewhere</option><option value="readonly">Inspection only</option><option value="source-failure">Source failure</option></Select></label><Button size="sm" onClick={()=>setFocusOnly(!focusOnly)}>{focusOnly?"Show workspace":"Focus inspector"}</Button><small>Interactive prototype · sample data only</small></aside>
    <header className="preview-header"><strong>Token Workbench</strong><span className="text-muted-foreground">Projects / Precision</span></header>
    <div className="preview-workspace">
      <nav className="preview-navigation" aria-label="Sample navigation"><h2 className="text-caption text-muted-foreground mb-6">NAVIGATION</h2><p className="text-caption text-muted-foreground mb-2">Library</p><p className="preview-selected p-3 text-caption font-medium mb-6">All tokens <span className="float-right">3</span></p><p className="text-caption text-muted-foreground mb-3">Tokens</p><p className="flex gap-2 text-caption mb-4"><Icon name="swatch"/>Colors</p><p className="text-caption ml-6 mb-3">Semantic</p><p className="text-caption ml-10 flex gap-2"><Icon name="chevron-down"/>color.action</p></nav>
      <main className="preview-list"><p className="text-caption text-muted-foreground mb-2">Tokens</p><h1 className="mb-2">All tokens</h1><p className="text-caption text-muted-foreground mb-7">Sample tokens for reviewing the inspector.</p><div className="flex justify-between border-y-hairline border-border py-3 text-caption mb-1"><span>Token</span><span>Applied value</span></div><div className="preview-selected p-4 flex justify-between gap-4"><div><strong className="text-caption">primary</strong><p className="text-caption text-muted-foreground mt-1">color.action.primary</p><p className="text-caption text-muted-foreground mt-3 whitespace-pre-wrap">{applied.description}</p></div><div className="text-right"><div className="preview-swatch ml-auto mb-2" style={{background:colorPreview(appliedColor).css}}/><p className="font-mono text-caption">{hexPreview(createColorLiteral(appliedColor)).match(/#[0-9A-F]{6}$/)?.[0]}</p></div></div><p className="text-caption text-muted-foreground mt-5">Apply updates this sample row. Reload resets the prototype.</p></main>
      <aside className="preview-inspector" aria-label="Token inspector">
        <div className="preview-inspector-heading"><div><p className="text-caption uppercase text-muted-foreground font-semibold">Color token</p><h2 className="text-inspector mt-1">primary</h2></div><div className="flex gap-3"><div><span className="text-caption">Current</span><div className="preview-swatch mt-1" style={{background:colorPreview(appliedColor).css}}/></div><div><span className="text-caption">New</span><div className="preview-swatch mt-1" style={{background:colorPreview(color).css}}/></div></div></div>
        <div className="preview-inspector-body">
          <Section title="Edit token" open={sections.edit} onToggle={()=>toggle("edit")} badge={!sections.edit&&dirty?"Unapplied changes":readOnly?"Inspection only":undefined} footer={footer}>
            <fieldset disabled={pending||readOnly}>
              <Field>Description<textarea ref={descriptionRef} value={draft.description} rows={3} onChange={e=>mark({...draft,description:e.target.value})} className="w-full min-w-0 rounded-md border-2 border-input bg-background text-foreground px-2.5 py-2 text-caption resize-y"/></Field>
              <Field>Layer<Select value={draft.session.layer??""} onChange={e=>mark({...draft,session:{...draft.session,layer:e.target.value===""?null:e.target.value as DraftSession["layer"]}})}><option value="">Unspecified</option><option value="primitive">Primitive</option><option value="semantic">Semantic</option><option value="component" disabled>Component</option></Select></Field>
              <fieldset><legend className="text-caption font-medium mb-2">Value source</legend><div className="flex gap-6 mb-2">{(["literal","reference"] as const).map(mode=><label className="inline-flex gap-2 items-center text-caption min-h-9" key={mode}><input type="radio" name="value-mode" checked={draft.session.mode===mode} onChange={()=>mark({...draft,session:{...draft.session,mode}})}/>{mode==="literal"?"Literal color":"Reference"}</label>)}</div></fieldset>
              {draft.session.mode==="literal"?<ColorEditor session={draft.session} onChange={session=>mark({...draft,session})} onError={setError} readOnly={pending||readOnly}/>:<Field>Reference target<Select value="color.blue.600" onChange={()=>{}}><option value="color.blue.600">color.blue.600</option></Select><span className="text-caption font-normal text-muted-foreground">This sample reference resolves to an OKLCH color.</span></Field>}
              <p className="text-caption text-muted-foreground mt-3">Draft preview: {colorPreview(color).message}</p>
            </fieldset>
          </Section>
          <Tabs.Root value={tab} onValueChange={setTab}>
            <Tabs.List aria-label="Read-only token inspection" className="flex gap-6 border-b-hairline border-border mt-5 mb-1">{[["applied","Applied"],["resolved","Resolved & trace"]].map(([value,label])=><Tabs.Tab key={value} value={value} className="relative min-h-10 p-0 border-0 bg-transparent text-caption text-muted-foreground data-active:text-foreground data-active:font-semibold data-active:after:absolute data-active:after:bottom-0 data-active:after:inset-x-0 data-active:after:h-1 data-active:after:bg-primary">{label}</Tabs.Tab>)}</Tabs.List>
            <Tabs.Panel value="applied">
              <Section title="Currently applied" open={sections.applied} onToggle={()=>toggle("applied")}><Rows rows={[["Description",applied.description||"No description"],["Layer",applied.session.layer??"Unspecified"],["Color space",spaceName(appliedColor.colorSpace)],...authoredColorCoordinates(createColorLiteral(appliedColor),"expanded",true).map(x=>{const i=x.indexOf(" ");return [x.slice(0,i),x.slice(i+1)] as [string,string]}),["HEX (sRGB preview)",hexPreview(createColorLiteral(appliedColor)).match(/#[0-9A-F]{6}$/)?.[0]??"Unavailable"]]}/></Section>
              <Section title="Metadata" open={sections.metadata} onToggle={()=>toggle("metadata")}><Rows rows={[["Regeneration","allowed"],["Semantic role","Action background"],["Parent group","color.action"],["Project identity",'"project-precision"'],["Token identity",'"token-accent-01"'],["Path status","Derived"],["Path segments",'["color", "action", "primary"]']]}/></Section>
              <Section title="All authored data" open={sections.source} onToggle={()=>toggle("source")}><Source open={sections.source} data={data} revision={revision} kind="Complete applied authored data" fail={scenario==="source-failure"}/></Section>
            </Tabs.Panel>
            <Tabs.Panel value="resolved">
              <Section title="Resolved value" open={sections.resolved} onToggle={()=>toggle("resolved")}><p className="text-caption text-muted-foreground mb-2">Applied value · draft changes are excluded</p><Rows rows={[["Color space",spaceName(appliedColor.colorSpace)],...authoredColorCoordinates(createColorLiteral(appliedColor),"expanded",true).map(x=>{const i=x.indexOf(" ");return [x.slice(0,i),x.slice(i+1)] as [string,string]})]}/></Section>
              <Section title="Resolution trace" open={sections.trace} onToggle={()=>toggle("trace")}><ol className="text-caption space-y-3"><li><strong>color.action.primary</strong><p className="text-muted-foreground mt-1">{applied.session.mode==="reference"?"References color.blue.600":"Authored literal value"}</p></li>{applied.session.mode==="reference"&&<li><strong>color.blue.600</strong><p className="text-muted-foreground mt-1">Authored literal value</p></li>}</ol></Section>
              <Section title="Resolution diagnostics" open={sections.diagnostics} onToggle={()=>toggle("diagnostics")}><p className="text-caption text-muted-foreground">No resolution issues.</p></Section>
              <Section title="Raw resolution data" open={sections.raw} onToggle={()=>toggle("raw")}><Source open={sections.raw} data={resolution} revision={revision} kind="Raw derived resolution data" fail={scenario==="source-failure"}/></Section>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      </aside>
    </div>
  </div>;
}
createRoot(document.getElementById("root")!).render(<App/>);
