# Increment 009 independent review

13 November 2026. Independent reviewer; requirements/design expectations were
formed before receiving the frozen source snapshot and before consulting the
developer handoff. Used the code-review-and-quality skill within the coordinator's
read-only and stopped-verification constraints.

## Snapshot and verdict

Base `5b23a3027079b807faf1943af80d88a6f5478004`; exact tracked source patch
`review-source.patch`, SHA-256
`c34d0454ebd24acec257e5ea250ff9f68bc8fb04483918ce500d9714348807d9`;
included new files and 38 production/test/tool hashes in
`review-source-manifest.json`. Patch checksum and all file hashes matched at the
end of review. Coordinator documentation edits are outside that source snapshot.

**No demonstrated required defect found in the reviewed change.** Source review
does not establish complete browser acceptance. In particular, outstanding
rendered/focus/compact and native legacy restore checks must remain unverified
where the coordinator has no actual evidence; this review does not waive them.
Delivery disposition: **Implemented, manual acceptance pending**. The material
runtime gaps below prevent claiming all ACs completely accepted.

## Independent inspection

- AC-1/2: one discriminated browser view drives navigation/toolbar/default parent.
  All content omits search/rename, query remains in its own state, reveal resets
  All tokens/query, and selection/editor lifetime is separate. Creation retains
  its captured baseline target and missing-parent rejection.
- AC-3/5: extracted group/resolution panels lead with readable information;
  identities, raw resolution and authored source remain separate disclosures.
  Color components/alpha render the available strings, without formatting away
  precision. Unavailable paths and empty/unavailable diagnostics are distinguished.
- AC-6/7: lifecycle and backup owners are cohesive, with the existing application
  authority retained. Shared pre-read file admission covers both entry points and
  restaging. Source comparison found no new editor-session owner, revised editor
  key, command replay path or altered restore authority. Reference/metadata/group/
  resolution sections have focused data/actions rather than a replacement omnibus
  controller. Reference control disabling during acceptance was already absent in
  the base; extraction does not newly introduce that behavior.
- AC-9/11: inspected generated-table provenance/generator and normalization,
  contextual Final Sigma, precise R removal, default C/F folding and segment-array
  keys. The implementation avoids host casing/normalization and separates stored
  names from keys. Application creation/rename prepare and compare before commit.
  Collision comparison uses kind-scoped identities, includes descendant paths and
  all token completeness/types, and rejects additions/new collision relationships.
  Unchanged legacy collision relationships remain allowed subject to pre-existing
  structural/reference checks. Existing constructors/decoder are not normalized.
- AC-10: legacy collision diagnostics are added to display rather than load/restore
  admission. Exceptional inventory/catalogue/navigation entries carry their exact
  identity and parent context inside their action. Exact-source access stays
  revision-aware. Inspected tests cover legacy codec preservation, cross-kind and
  descendant checks, independent projects and otherwise valid unrelated creation.
- AC-4/8: source retains ordinary Alpha, sticky actions, errors, owned controls,
  native disclosures and shared Icon. The saved `chrome-all-content.png` shows
  ordinary All content with one active navigation item, absent search/rename and
  a retained inspector. It does not prove 1280 × 800 geometry, keyboard/focus,
  compact scrolling or exceptional legacy-entry behavior.

## Evidence and limits

Reviewed the new domain/application/presentation tests first, then relevant
implementation and base comparisons. Reviewed developer evidence only after that
independent inspection: its handoff reports 72 focused tests and the final build
passed. Those are developer-run results, not independently rerun results.

No tests/builds, mutation experiment, runtime probes or harness repairs were run
by this reviewer. The coordinator explicitly stopped the optional fixture campaign
after both shared harness-repair cycles; source/evidence inspection remained useful
unaffected work. This review does not reopen Increment 007/008 qualification.
Exhaustive Unicode normalization/casing conformance, native legacy restore/selection
and complete affected focus/responsive acceptance are not established by this
source inspection. No demonstrated regression was found to justify extending work.

Approximate reviewer consumption: **8 active minutes of the 9-minute allocation**,
including requirements, source/evidence review and this record; **about 1 minute
unused**. No additional verification requested. Preserve these estimates in the
single shared 30-minute accounting; switching roles does not reset it.

## Remaining manual acceptance

The coordinator's final `chrome-review.md` records bounded native Chrome checks;
its positive observations supplement source review without extending this review
into another browser campaign. Before complete acceptance, the user should check:

1. At 1280 × 800 and a representative compact width, reach Alpha and Apply/Cancel
   without clipped controls or horizontal page scrolling; open/close the navigation
   drawer and verify keyboard focus returns normally (AC-4/8).
2. Edit invalid raw text, switch group → All content → All tokens, and verify draft
   and query preservation; select a different item and exercise departure choices,
   Apply/Cancel focus and naming-rejection focus (AC-2/7/8). The final submission
   preflight correction was source-reviewed but not browser-replayed.
3. Restore supported synthetic legacy data through the normal UI; deliberately
   select each duplicate and orphan by its in-row identity, inspect exact source,
   and check exact backup/restore preservation (AC-3/10). Use structurally valid
   colliding data to check unrelated creation; an orphan fixture still legitimately
   triggers existing structural-command rejection.

These are missing runtime evidence, not demonstrated defects or permission to
restart the stopped automated fixture campaign. Existing automated tests cover
parts of these behaviors, but do not substitute for the identified UI acceptance.
