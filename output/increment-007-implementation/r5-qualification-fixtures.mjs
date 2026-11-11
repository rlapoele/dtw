// Offline fixture builder; authored admission is established by the real app's
// stageBackup, not by assuming this generator is the canonical validator.
export const utf8 = value => Buffer.byteLength(JSON.stringify(value), 'utf8');
export function snapshot(id, count=0, groupCount=0, allColors=true) {
  return {
    project: { id, name: id },
    groups: Array.from({length:groupCount}, (_,i)=>({id:`g${i}`,projectId:id,localName:`group${i}`,parentGroupId:null})),
    tokens: Array.from({length:count},(_,i)=>({
      id:`t${i}`,projectId:id,localName:`token${i}`,parentGroupId:null,
      authoring:{regeneration:'allowed'},
      ...(allColors || i===0 ? {definition:{type:'color',assignments:[{condition:[],value:{kind:'literal',valueType:'color',colorSpace:'srgb',components:['0.2','0.4','0.6'],alpha:'0.7'}}]}} : {}),
    })),
  };
}
export function envelope(snapshot) {return {format:'dtw.project-backup',formatVersion:1,authoredVersion:1,createdAt:'2026-11-11T00:00:00.000Z',snapshot};}
export function exactSnapshotBytes(id, target=8388608) {
  const value=snapshot(id,1,64);
  // Multi-byte group metadata, never retired 65,004-unit token descriptions.
  // Saturate each supported individual string then use an ASCII remainder.
  for(const group of value.groups) group.description='';
  let missing=target-utf8(value);
  for(const group of value.groups) {
    const units=Math.min(65536,Math.floor(missing/3));
    group.description='中'.repeat(units);missing-=units*3;
    const ascii=Math.min(65536-units,missing);
    group.description+='x'.repeat(ascii);missing-=ascii;
  }
  if(missing!==0 || utf8(value)!==target)throw Error('Exact supported snapshot-byte fixture construction failed');
  return value;
}
export function sourceBoundary(units) {
  const value=snapshot(`source-${units}`,1,1);
  const group=value.groups[0];group.description='';
  const overhead=JSON.stringify(group,null,2).length;
  group.description='source-boundary-😀-';
  group.description+='x'.repeat(units-overhead-group.description.length);
  const prefix=JSON.stringify(group,null,2).indexOf(group.description);
  const splitAt=8191-prefix;
  group.description=group.description.slice(0,splitAt)+'🧩'+group.description.slice(splitAt+2);
  const middle=Math.floor(group.description.length/2), middleMarker='source-middle-marker';
  group.description=group.description.slice(0,middle)+middleMarker+group.description.slice(middle+middleMarker.length);
  const ending='source-end-marker';group.description=group.description.slice(0,-ending.length)+ending;
  if(group.description.length>65536 || JSON.stringify(group,null,2).length!==units)throw Error('Source boundary not exact');
  return value;
}
export function fixtureFacts(value) {
  let strings=0, values=0, longest=0;
  const stack=[value];
  while(stack.length){const item=stack.pop();values++;if(typeof item==='string'){strings+=item.length;longest=Math.max(longest,item.length);}else if(item&&typeof item==='object'){if(Array.isArray(item))stack.push(...item);else for(const [key,child] of Object.entries(item)){strings+=key.length;longest=Math.max(longest,key.length);stack.push(child);}}}
  const facts={snapshotBytes:utf8(value),tokens:value.tokens.length,groups:value.groups.length,strings,values,longest,maxTokenDescription:Math.max(0,...value.tokens.map(t=>t.description?.length??0))};
  if(facts.snapshotBytes>8388608||facts.tokens>10000||facts.groups>2000||facts.strings>4194304||facts.values>200000||facts.longest>65536||facts.maxTokenDescription>1024)throw Error('Fixture outside agreed F4 envelope: '+JSON.stringify(facts));
  return facts;
}
