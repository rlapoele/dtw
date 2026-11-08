import {createServer} from '/Users/rlapoele-pro/Library/CloudStorage/Dropbox/Projects/aiAssistedProjects/dtw/node_modules/vite/dist/node/index.js';
import {createRequire} from 'node:module';
const require=createRequire('/Users/rlapoele-pro/Library/CloudStorage/Dropbox/Projects/aiAssistedProjects/dtw/package.json');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const v=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
 const {AuthoredValue}=await v.ssrLoadModule('/src/presentation/AuthoredValue.tsx');
 const {ColorFields}=await v.ssrLoadModule('/src/presentation/ColorFields.tsx');
 const {baseline}=await v.ssrLoadModule('/src/presentation/session.ts');
 for(const [space,components,names] of [
 ['srgb',['-0.2','0.4','1.234567890123456789'],['Red','Green','Blue']],
 ['display-p3',['0.1','0.3','0.7'],['Red','Green','Blue']],
 ['hsl',['37','42','63'],['Hue','Saturation','Lightness']],
 ['oklab',['0.6','-0.2','0.3'],['Lightness','a','b']],
 ['oklch',['0.7','0.2','39'],['Lightness','Chroma','Hue']]]) {
 const value={kind:'literal',valueType:'color',colorSpace:space,components,alpha:'0.37'};
 const html=renderToStaticMarkup(React.createElement(AuthoredValue,{value}));
 for(const s of [...names,...components,'Alpha','0.37'])if(!html.includes(s))throw Error(space+' missing '+s);
 const fields=renderToStaticMarkup(React.createElement(ColorFields,{session:baseline(value),onChange:()=>{},onError:()=>{}}));
 for(const n of names){const full=(space==='hsl' ? ({Hue:'Hue (°)',Saturation:'Saturation (%)',Lightness:'Lightness (%)'})[n] : space==='oklch' && n==='Hue' ? 'Hue (°)' : n); if(!fields.includes('<span>'+full+'</span>'))throw Error('editor '+space+' '+full);}
 console.log(space+': rendered editor labels and exact expanded summary verified');
 }
 const alias=renderToStaticMarkup(React.createElement(AuthoredValue,{value:{kind:'token-reference',targetTokenId:'gone',valuePath:[]}}));
 if(!alias.includes('Reference')||!alias.includes('Missing target')||!alias.includes('gone'))throw Error('alias');
 console.log('Missing alias SSR verified');
}finally{await v.close()}
