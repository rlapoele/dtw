import {AuthoredValue} from '@presentation/AuthoredValue';
import type {Summary as Data} from './projections';
export function Summary({data,layout='expanded'}:{data:Data;layout?:'compact'|'expanded'}){
 if(data.kind==='color')return <AuthoredValue value={data.value} layout={layout}/>;
 if(data.kind==='other')return <span>{data.text}</span>;
 return <span className="block min-w-0 wrap-anywhere"><span className="block">Reference</span><span className="block text-secondary mt-1">{data.label}</span></span>;
}
