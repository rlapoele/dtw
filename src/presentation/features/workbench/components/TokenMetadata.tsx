import type { Token } from '@domain/token';
import type { DisplayPath } from '@application/retention/projections';
import { ExactSource } from './ExactSource';
export function TokenMetadata({token, groupLabels, revision, requestSource, path}: {
 token:Omit<Token,'definition'>; groupLabels:ReadonlyMap<string,string>; revision:string; requestSource?:()=>Promise<string>; path:DisplayPath;
}) {
 return (
          <section className="applied-summary border-t border-border mt-7 pt-5">
            <h3 className="mb-3.5">Metadata · read only</h3>
            <dl className="details">
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Regeneration</dt>
                <dd className="text-right wrap-anywhere">
                  {token.authoring.regeneration}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Semantic role</dt>
                <dd className="text-right wrap-anywhere">
                  {token.semanticRole ?? "Unspecified"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5 border-b border-border text-caption">
                <dt className="text-muted-foreground">Parent group</dt>
                <dd className="text-right wrap-anywhere">
                  {token.parentGroupId !== null
                    ? (groupLabels.get(token.parentGroupId) ?? "Missing group")
                    : "Project root"}
                </dd>
              </div>
            </dl>
            <details className="text-caption mt-4"><summary>Identity and path details</summary>
              <p className="wrap-anywhere">Project identity: {JSON.stringify(token.projectId)}</p>
              <p className="wrap-anywhere">Token identity: {JSON.stringify(token.id)}</p>
              <pre className="whitespace-pre-wrap wrap-anywhere">{JSON.stringify(path,null,2)}</pre>
            </details>
            <ExactSource
              key={`${token.id}-${revision}`}
              revision={revision}
              request={
                requestSource ??
                (() => Promise.resolve(JSON.stringify(token, null, 2)))
              }
            />
          </section>
 );
}
