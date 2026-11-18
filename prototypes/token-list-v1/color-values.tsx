import {createColorLiteral, COLOR_SPACES, type ColorLiteralValue} from '@domain/color-literal';
import {convertColor} from '@domain/color-calculation';
import {COLOR_COMPONENTS, componentSuffix} from '@domain/color-components';
import {colorDecimalDisplay} from '@presentation/App/components/TokensWorkbench/helpers/color-decimal-display';
import {spaceName} from '@presentation/App/components/TokensWorkbench/helpers/authored-color';
import {toGamut, formatHex} from 'culori/fn';

export const literalColors:Record<string,ColorLiteralValue> = {
 brand:createColorLiteral({colorSpace:'oklch',components:['0.5461','0.2152','262.8809'],alpha:'1'}),
 ink:createColorLiteral({colorSpace:'srgb',components:['0.0902','0.0902','0.0902'],alpha:'1'}),
 experimental:createColorLiteral({colorSpace:'oklch',components:['0.702','0.148','68.4'],alpha:'1'}),
};
const mapPreview = toGamut('rgb', 'oklch');
/** Derived prototype preview only. No source writes or invented missing components. */
export function previewHex(source?:ColorLiteralValue):string {
 if (!source || source.components.includes('none')) return 'HEX unavailable';
 const result=convertColor(source,'srgb');
 if(!result.ok || result.value.components.includes('none')) return 'HEX unavailable';
 const [r,g,b]=result.value.components.map(Number);
 if (![r,g,b].every(Number.isFinite)) return 'HEX unavailable';
 return formatHex(mapPreview({mode:'rgb',r,g,b}))?.toUpperCase() ?? 'HEX unavailable';
}
const labels:Record<string,string>={red:'R',green:'G',blue:'B',lightness:'L',chroma:'C',hue:'H',saturation:'S',a:'a',b:'b'};
export function ColorSpaces({source,authored}:{source?:ColorLiteralValue;authored:boolean}) {
 if(!source) return <span className="value-detail">Color unavailable</span>;
 return <span className="color-spaces">{COLOR_SPACES.map(space=>{
  const converted=convertColor(source,space);
  return <span key={space} className={'space-values '+(source.colorSpace===space?'source-space ':'')+(authored&&source.colorSpace===space?'authored-space':'')}>
   <span className="space-name">{spaceName(space)}</span>
   <span className="space-coordinates">{converted.ok?converted.value.components.map((v,i)=>labels[COLOR_COMPONENTS[space][i]]+' '+colorDecimalDisplay(v)+(v==='none'?'':componentSuffix(space,COLOR_COMPONENTS[space][i]))).join(' · '):'Unavailable'}</span>
  </span>;
 })}<span className="alpha-detail">Alpha {colorDecimalDisplay(source.alpha)}</span></span>;
}
