import { expect, it } from 'vitest';
import { createAuthoringOperations } from '@application/authoring';
import { InMemoryProjectStorage } from '@adapters/in-memory-project-storage';
import { createProject } from '@domain/project';
import { createToken } from '@domain/token';
import { createTokenGroup } from '@domain/token-group';
import { namespaceCollisions } from '@domain/namespace-collisions';
const group = (id:string, name:string, parent:string|null=null) => createTokenGroup({id, projectId:'p',localName:name,parentGroupId:parent});
const token = (id:string,name:string,parent:string|null=null) => createToken({id,projectId:'p',localName:name,parentGroupId:parent,regeneration:'allowed'},[]);
it('prepares new names, rejects cross-kind/incomplete legacy collisions and preserves legacy data', () => {
 const storage=new InMemoryProjectStorage();
 const original={project:createProject({id:'p',name:'Exact Project'}), groups:[group('legacy','Brand\u00A0Blue'),group('dup','brandblue')],tokens:[token('string','Straße')]};
 storage.commit(original); const app=createAuthoringOperations(storage);
 expect(app.createGroup({id:'new',projectId:'p',localName:' BRAND Blue ',parentGroupId:null}).status).toBe('failure');
 expect(app.createGroup({id:'new',projectId:'p',localName:'STRASSE',parentGroupId:null}).status).toBe('failure');
 expect(app.createGroup({id:'new',projectId:'p',localName:'\u200B ',parentGroupId:null}).status).toBe('failure');
 expect(storage.load('p')).toMatchObject({value:original});
 expect(app.createGroup({id:'fresh',projectId:'p',localName:' Fresh Accent ',parentGroupId:null})).toMatchObject({status:'ok',value:{localName:'freshaccent'}});
 expect(app.renameGroup('p','fresh',' Another ')).toMatchObject({status:'ok',value:{localName:'another'}});
 expect(storage.load('p')).toMatchObject({value:{groups:[...original.groups,group('fresh','another')],tokens:original.tokens}});
});
it('checks every renamed descendant and segment arrays while retaining original child names', () => {
 const storage=new InMemoryProjectStorage();
 const groups=[group('a','old'),group('b','new'),group('aa','Mid','a'),group('bb','mid','b'),group('aaa','Deep','aa'),group('bbb','deep','bb')];
 storage.commit({project:createProject({id:'p',name:'P'}),groups,tokens:[token('left','Straße','aaa'),token('right','STRASSE','bbb')]});
 const app=createAuthoringOperations(storage);
 expect(app.renameGroup('p','a',' NEW ').status).toBe('failure');
 expect(app.renameGroup('p','a',' Distinct ')).toMatchObject({status:'ok',value:{localName:'distinct'}});
 expect(app.createGroup({id:'dotted',projectId:'p',localName:'new.mid',parentGroupId:null}).status).toBe('ok');
 expect(namespaceCollisions({projectId:'p',groups:[group('x','a.b'),group('y','a'),group('z','b','y')],tokens:[]})).toEqual([]);
});
it('keeps group and token identities kind-scoped during descendant collision checks', () => {
 const storage=new InMemoryProjectStorage();
 storage.commit({project:createProject({id:'p',name:'P'}),groups:[group('same','parent')],tokens:[token('same','child','same')]});
 const app=createAuthoringOperations(storage);
 expect(app.createGroup({id:'new',projectId:'p',localName:'CHILD',parentGroupId:'same'}).status).toBe('failure');
});
it('applies the same boundary to color creation, and project identities scope uniqueness',()=>{
 const storage=new InMemoryProjectStorage();const app=createAuthoringOperations(storage);
 app.createProject({id:'p',name:'Exact P'});app.createProject({id:'q',name:'Exact Q'});
 const input={id:'t',projectId:'p',localName:' Brand Blue ',parentGroupId:null,type:'color' as const,regeneration:'allowed' as const,value:{kind:'literal' as const,colorSpace:'srgb' as const,components:['0','0','0'] as const,alpha:'1'}};
 expect(app.createColorToken(input)).toMatchObject({status:'ok',value:{localName:'brandblue'}});
 expect(app.createGroup({id:'g',projectId:'p',localName:'BRAND\u200BBlue',parentGroupId:null}).status).toBe('failure');
 expect(app.createColorToken({...input,id:'t2',localName:'BRANDBLUE'}).status).toBe('failure');
 expect(app.createColorToken({...input,projectId:'q'}).status).toBe('ok');
});
