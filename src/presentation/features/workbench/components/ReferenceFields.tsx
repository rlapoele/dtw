import type { DraftSession } from '../state/session';
import type { ProjectContext } from '@application/retention/projections';
import { Field } from '@presentation/components/ui/field';
import { Select } from '@presentation/components/ui/select';
export function ReferenceFields({session, tokens, choices, labels, onChange}: {
 session:DraftSession; tokens:ProjectContext['tokens']; choices:ProjectContext['tokens']; labels:ReadonlyMap<string,string>; onChange:(session:DraftSession)=>void;
}) {
 return (
                <>
                  <Field>
                    Target token
                    <Select
                      value={
                        session.reference === null
                          ? ""
                          : JSON.stringify(session.reference)
                      }
                      aria-describedby="reference-note editor-error"
                      onChange={(e) => {
                        onChange({
                          ...session,
                          reference:
                            e.target.value === ""
                              ? null
                              : (JSON.parse(e.target.value) as string),
                          edited: true,
                        });
                      }}
                    >
                      <option value="">Choose a color token…</option>
                      {session.reference !== null &&
                        !tokens.some(
                          (t) => t.authored.id === session.reference,
                        ) && (
                          <option
                            value={
                              session.reference === null
                                ? ""
                                : JSON.stringify(session.reference)
                            }
                          >
                            Missing target
                          </option>
                        )}
                      {choices.map((t) => (
                        <option
                          key={t.authored.id}
                          value={JSON.stringify(t.authored.id)}
                        >
                          {labels.get(t.authored.id)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <p
                    id="reference-note"
                    className="helper text-muted-foreground font-normal"
                  >
                    Uses the selected token’s whole color value. References stay linked; cycles are rejected on Apply.
                  </p>
                </>
 );
}
