import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button } from './components/ui/button';
import { colorPreview } from './color-tools';
import type { Color } from './fixtures';
export type InspectorFeedback = {tokenId:string;tab:string;applied?:Color;draft?:Color;appliedMessage:string;draftMessage:string};
function PreviewContext({label,color,message}:{label:string;color?:Color;message:string}){
 const css=colorPreview(color).css;
 return <div className="inspector-preview-context"><span className="preview-context-label">{label}</span>{css?<span className="header-specimen" aria-hidden="true"><span style={{background:css}}/></span>:<span className="preview-unavailable">Unavailable</span>}<span className="sr-only">{message}</span></div>;
}
export function InspectorHeader({expanded,onToggle,feedback,status}:{expanded:boolean;onToggle:()=>void;feedback?:InspectorFeedback;status?:string}){
 return <div className="inspector-header"><span className="inspector-region-title">Token inspector</span>{feedback?<section className="inspector-feedback" aria-label={feedback.tab==='resolved'?'Applied color context':'Applied and draft color context'}><PreviewContext label="Applied" color={feedback.applied} message={feedback.appliedMessage}/>{feedback.tab!=='resolved'&&<PreviewContext label="Draft" color={feedback.draft} message={feedback.draftMessage}/>}</section>:<span className="inspector-header-status">{status??'Unavailable'}</span>}<Button variant="ghost" className="pane-toggle inspector-toggle" aria-label={expanded?'Collapse token inspector':'Expand token inspector'} aria-expanded={expanded} aria-controls="token-inspector-content" onClick={onToggle}>{expanded?<ChevronRightIcon className="icon side-direction" aria-hidden="true"/>:<ChevronLeftIcon className="icon side-direction" aria-hidden="true"/>}{expanded?<ChevronDownIcon className="icon bottom-direction" aria-hidden="true"/>:<ChevronUpIcon className="icon bottom-direction" aria-hidden="true"/>}</Button></div>;
}
