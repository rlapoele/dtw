import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { admitSnapshot } from "@application/retention/codec";
import { projectContext } from "@application/retention/projections";
import { identityLabels } from "@presentation/features/workbench/readback";
import { AllContent } from "@presentation/features/workbench/components/AllContent";
import { membershipBlocks, revealMembershipBlocks } from "@presentation/features/workbench/state/all-content";
function context(groups: number, tokens: number) {
  return projectContext(admitSnapshot({ project: { id: "p", name: "P" }, groups: Array.from({length:groups}, (_, i)=>({id:`g${i}`,projectId:"p",localName:`group${i}`,parentGroupId:null})), tokens: Array.from({length:tokens},(_,i)=>({id:`t${i}`,projectId:"p",localName:`token${i}`,parentGroupId:null,authoring:{regeneration:"allowed"}})) }));
}
describe("complete native All content membership",()=>{
  it("keeps all 12000 exact kind-scoped identities in original group/token order",()=>{
    const project=context(2000,10000),blocks=membershipBlocks(project,identityLabels(project.groups));
    expect(blocks).toHaveLength(120);
    expect(blocks.every(block=>block.length<=100)).toBe(true);
    const entries=blocks.flat();expect(entries).toHaveLength(12000);
    expect(entries[0]).toMatchObject({kind:"group",id:"g0",label:'Group · group0 · "g0"'});
    expect(entries[1999].id).toBe("g1999");expect(entries[2000].id).toBe("t0");expect(entries.at(-1)?.id).toBe("t9999");
    expect(new Set(entries.map(entry=>JSON.stringify([entry.kind,entry.id]))).size).toBe(12000);
    expect(project.tokens).toHaveLength(10000);
  });
  it("initially renders only a bounded native block with truthful loading feedback",()=>{
    const project=context(2000,10000);
    const html=renderToStaticMarkup(createElement(AllContent,{context:project,groupLabels:identityLabels(project.groups),onSelect(){}}));
    expect((html.match(/data-entity-kind=/g)??[])).toHaveLength(100);
    expect(html).toContain("Preparing all content");expect(html).toContain('data-entity-id="g0"');expect(html).not.toContain('data-entity-id="t9999"');
  });
  it("renders exact opaque group/token identities independently and uses native buttons",()=>{
    const project=projectContext(admitSnapshot({project:{id:"p",name:"P"},groups:[{id:"",projectId:"p",localName:"",parentGroupId:null}],tokens:[{id:"",projectId:"p",localName:"",parentGroupId:null,authoring:{regeneration:"allowed"}}]}));
    const html=renderToStaticMarkup(createElement(AllContent,{context:project,groupLabels:identityLabels(project.groups),onSelect(){}}));
    expect((html.match(/<button/g)??[])).toHaveLength(2);expect(html).toContain('data-entity-kind="group" data-entity-id=""');expect(html).toContain('data-entity-kind="token" data-entity-id=""');expect(html).toContain("All content ready");
  });
  it("reveals one additional block per frame and cancels stale revision callbacks",()=>{
    let serial=0;const queued=new Map<number,()=>void>(),cancelled:number[]=[],seen:string[]=[];
    const schedule=(callback:()=>void)=>{queued.set(++serial,callback);return serial;};const cancel=(id:number)=>cancelled.push(id);
    const old=revealMembershipBlocks(120,count=>seen.push(`old:${count}`),schedule,cancel);
    queued.get(1)!();expect(seen).toEqual(["old:2"]);const stale=queued.get(2)!;old();expect(cancelled).toContain(2);
    const next=revealMembershipBlocks(3,count=>seen.push(`current:${count}`),schedule,cancel);
    stale();expect(seen).toEqual(["old:2"]);queued.get(3)!();queued.get(4)!();expect(seen).toEqual(["old:2","current:2","current:3"]);next();
  });
});
