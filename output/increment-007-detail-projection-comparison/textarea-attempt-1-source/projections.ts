import type {Token} from '@domain/token';
import type {ColorLiteralValue} from '@domain/color-literal';
import type {colorPreview} from '@presentation/preview';
export type Value=NonNullable<Token['definition']>['assignments'][number]['value'];
export type Summary={kind:'color';value:ColorLiteralValue}|{kind:'reference';label:string}|{kind:'other';text:string};
export type Preview=ReturnType<typeof colorPreview>;
export type RowData={id:string;label:string;description?:string;layer?:string;type?:string;summary:Summary;preview:Preview};
export type Choice={id:string;label:string};
export type SelectedEditor={
 id:string;label:string;description?:string;layer?:string;type?:string;semanticRole?:string;regeneration:string;
 parentLabel:string;editable:boolean;baseline?:Value;summary:Summary;preview:Preview;
 references:readonly Choice[];
};
export type Derived={status:'ready';resolved?:string;reason?:string;trace:readonly {label:string;id:string;target?:string}[];diagnostics:string}|{status:'unavailable';reason:string};
export type Context={worker:number;project:string;incarnation:number;revision:number;result:number};
