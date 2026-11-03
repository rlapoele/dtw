import { colorPreview } from './color-tools';
export type Space = 'srgb' | 'display-p3' | 'hsl' | 'oklab' | 'oklch';
export type Color = { space: Space; components: [string, string, string]; alpha: string };
export type Value = { mode: 'literal'; color: Color } | { mode: 'reference'; target: string };
export type Token = { id: string; name: string; group: string; layer: 'Primitive' | 'Semantic' | 'Unspecified'; description: string; value: Value };
export const literal = (r: string, g: string, b: string): Value => ({mode:'literal',color:{space:'srgb',components:[r,g,b],alpha:'1'}});
export const seed: Token[] = [
 {id:'blue-100',name:'100',group:'color / blue',layer:'Primitive',description:'A quiet tint for selected surfaces.',value:literal('0.859','0.918','0.996')},
 {id:'blue-500',name:'500',group:'color / blue',layer:'Primitive',description:'Primary brand color. Referenced by the accent palette.',value:literal('0.2314','0.5098','0.9647')},
 {id:'blue-700',name:'700',group:'color / blue',layer:'Primitive',description:'A deeper blue for emphasis.',value:literal('0.114','0.306','0.847')},
 {id:'neutral-50',name:'50',group:'color / neutral',layer:'Primitive',description:'Subtle background.',value:literal('0.973','0.98','0.988')},
 {id:'neutral-900',name:'900',group:'color / neutral',layer:'Primitive',description:'High emphasis text.',value:literal('0.059','0.09','0.165')},
 {id:'action-primary',name:'primary',group:'color / accent',layer:'Semantic',description:'Primary action color for interactive elements.',value:{mode:'reference',target:'blue-500'}},
 {id:'action-hover',name:'hover',group:'color / accent',layer:'Semantic',description:'Emphasis on hover.',value:{mode:'reference',target:'blue-700'}},
 {id:'surface-default',name:'default',group:'color / surface',layer:'Semantic',description:'Default application surface.',value:literal('1','1','1')},
 {id:'text-primary',name:'primary',group:'color / content',layer:'Semantic',description:'Primary readable text.',value:{mode:'reference',target:'neutral-900'}},
];
export const path = (t: Token) => `${t.group ? t.group+' / ' : ''}${t.name || '(unnamed)'}`;
// Approximate specimen only; conversion never writes back to authored fields.
export const preview = (c?: Color): string | undefined => colorPreview(c).css;
// One-hop specimen, intentionally not a graph resolver. Targets in this design are literals.
export function specimen(t: Token, tokens: Token[]): Color | undefined {
 const v=t.value;
 return v.mode==='literal' ? v.color : tokens.find(x=>x.id===v.target)?.value.mode==='literal' ? (tokens.find(x=>x.id===v.target)?.value as {mode:'literal';color:Color}).color : undefined;
}
