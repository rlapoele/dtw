import { expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { admitSnapshot, encodeBackup, decodeBackup } from '@application/retention/codec';
import { projectContext } from '@application/retention/projections';
import { namingPreview } from '@presentation/features/workbench/state/naming-preview';
import { creationParent } from '@presentation/features/workbench/state/browser-view';
import { ProjectNavigation } from '@presentation/features/workbench/components/ProjectNavigation';
import { membershipBlocks } from '@presentation/features/workbench/state/all-content';
import { readBackupFile } from '@presentation/host/backup-file';
const snapshot=admitSnapshot({project:{id:'p',name:'Legacy'},groups:[{id:'g',projectId:'p',localName:'foundation',parentGroupId:null},{id:'conflicting-group',projectId:'p',localName:'BRAND Blue',parentGroupId:'g'}],tokens:[{id:'token-a-full-identity',projectId:'p',localName:'Brand\u00A0Blue',parentGroupId:'g',authoring:{regeneration:'allowed'}},{id:'token-b-full-identity',projectId:'p',localName:'Brand\u00A0Blue',parentGroupId:'g',authoring:{regeneration:'allowed'}},{id:'orphan-full-identity',projectId:'p',localName:'Orphan\u200DBlue',parentGroupId:'missing-parent',authoring:{regeneration:'allowed'}}]});
const context=projectContext(snapshot);
it('derives one active navigation and root creation from All content',()=>{
 const view={kind:'all-content'} as const;
 const html=renderToStaticMarkup(createElement(ProjectNavigation,{drawer:false,project:context,view,unavailable:false,onSelect(){},onCreateGroup(){},onAllContent(){}}));
 expect((html.match(/aria-current="true"/g)??[])).toHaveLength(1);
 expect(html).toMatch(/aria-current="true"[^>]*>All content/);
 expect(creationParent(view)).toBe(null);expect(creationParent({kind:'group',id:'g'})).toBe('g');
});
it('previews preparation without altering raw input and identifies cross-kind collisions',()=>{
 const raw=' BRAND Blue ';
 const preview=namingPreview(context,'token',raw,'g');
 expect(raw).toBe(' BRAND Blue ');expect(preview.name).toBe('brandblue');expect(preview.path).toEqual(['foundation','brandblue']);
 expect(preview.collisions.flatMap(c=>c.members.map(m=>m.id))).toEqual(expect.arrayContaining(['conflicting-group','token-a-full-identity','token-b-full-identity']));
 expect(namingPreview(context,'token',raw,null).collisions).toEqual([]);
 expect(namingPreview(context,'token','\u200B ',null).error).toContain('empty');
});
it('associates each ambiguous/unavailable row with its exact identity and parent context and preserves backup data',()=>{
 const entries=membershipBlocks(context,new Map([['g','foundation'],['conflicting-group','BRAND Blue']])).flat();
 for(const id of ['token-a-full-identity','token-b-full-identity']) {
  const entry=entries.find(entry=>entry.id===id)!;expect(entry.detail).toContain(id);expect(entry.detail).toContain('Conflicting path');expect(entry.detail).toContain('"g"');
 }
 expect(entries.find(entry=>entry.id==='orphan-full-identity')?.detail).toContain('missing-parent');
 expect(decodeBackup(encodeBackup(snapshot,'2026-11-13T00:00:00.000Z')).snapshot).toEqual(snapshot);
});
it('refuses oversized backup files before reading and accepts the exact shared limit',async()=>{
 const arrayBuffer=vi.fn(async()=>new ArrayBuffer(0));
 await expect(readBackupFile({size:16777217,arrayBuffer})).rejects.toThrow('16777216');expect(arrayBuffer).not.toHaveBeenCalled();
 await readBackupFile({size:16777216,arrayBuffer});expect(arrayBuffer).toHaveBeenCalledTimes(1);
});
