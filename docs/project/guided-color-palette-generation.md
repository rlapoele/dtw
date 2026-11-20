# Guided Color Palette Generation

## Status and purpose

**Confirmed future product direction — 10 November 2026.**

Support guided creation of a project color foundation, followed by an optional guided step that turns it into an interface color system with semantic tokens for light and dark themes. Multiple guided approaches are intended; the brand-led approach below is the first example, not the only permitted workflow.

This document preserves the concept for later work. It is not an increment contract, an agreed interaction design, a scheduled milestone, or authorization to begin research, prototyping, or implementation. Existing increment work continues independently.

## User value

Help designers and developers move from a few brand decisions to a coherent color foundation, then optionally define how those colors serve an interface. A foundation is a useful outcome on its own; users do not have to generate semantic tokens or choose interface themes to create one.

The optional interface step adds explicit meaning, theme-specific assignments, and checks of intended foreground/background combinations. It should help users understand why a primitive is proposed for a role rather than merely produce a list of values.

## Confirmed direction

- Generate a color foundation first; keep interface semantics optional.
- Support semantic-token recipes that propose predefined token names and their intended roles. The product owner expects to contribute opinionated naming choices; the final vocabulary and recipe contents are not yet agreed.
- Support light and dark themes in the optional interface step.
- Emphasize contextual contrast guidance when proposing or creating semantic tokens, where intended uses and foreground/background relationships become explicit.
- Keep a contrast view available independently of the guided flow, including for later consultation and editing.
- Begin future exploration with one brand color, neutral and accent ramps, a small semantic proposal, and contextual contrast feedback. Additional accents and status families extend the broader concept rather than being prerequisites for that first exploration.

## Example guided approach: start from brand colors

### 1. Choose brand and accent colors

The user chooses a primary brand/accent color. They may add further accents manually or ask for suggestions that work with the first color. Where several accents exist, the user can choose which one influences the neutral ramp.

**Working proposals:** preserve exact chosen colors as visible anchors; explain alternative combinations rather than present one objectively correct match; let users retain selected choices while regenerating other candidates. The interaction for locking, revising, and regenerating candidates remains to be designed.

### 2. Generate a neutral ramp

Propose a neutral ramp with slight coloration derived from the primary or selected accent.

**Working proposal:** offer control over tint strength, including a fully neutral alternative. The ramp length, naming, and numerical behavior remain open.

### 3. Generate accent ramps

Propose a ramp for each selected brand/accent color.

**Working proposal:** retain the exact selected color without silently changing it to fit a predefined step. A brand anchor need not be suitable for every interface role; another ramp member may be proposed for a specific use.

### 4. Suggest status colors and ramps

Suggest coherent colors and ramps for information, success, warning, and danger. Visual harmony and distinguishable meaning are separate goals to evaluate. The established taxonomy uses `info`, `success`, `warning`, and `danger` directly under `color`, without a redundant `status` namespace.

Status hue selection, separation criteria, and handling of conflicts with brand colors remain open. Status generation belongs to the broader example and is outside the agreed first exploration.

### 5. Review and accept the foundation

Users review candidates and choose which primitive tokens to create. Foundation creation does not require semantic-token generation. Contrast inspection can support this stage without implying that every primitive must work against every other primitive.

The exact review layout, partial acceptance, naming/collision behavior, and handling of existing project tokens remain open.

### 6. Optionally create an interface color system

Offer a guided semantic step using the accepted foundation. A recipe proposes token names, describes their roles, and suggests references to primitives for light and dark themes. Users review the proposal before creation.

The recipe must express assumptions rather than infer interface meaning from primitive values alone. Opinionated predefined names provide a starting point; whether users can edit, extend, save, or replace recipes remains open. Reconcile future recipes with the [established semantic vocabulary](../design-tokens/taxonomy.md#semantic-color-vocabulary) before agreeing their contents.

**Working proposal:** preview a small interface specimen alongside the proposed semantic mappings and their contrast diagnostics. Light and dark mappings should follow the existing [variation-axis and conditional-value model](../design-tokens/conceptual-model.md#themes-and-modes), rather than introduce separate token trees or theme-owned values.

## Contrast guidance

The highest-value contrast checks are expected during semantic authoring, because the recipe can identify intended pairs such as content on surfaces, content on accent fills, and feedback content on subtle feedback surfaces. Contrast should remain consultable after generation as project colors and references evolve.

The original proposal includes WCAG contrast ratios and APCA Lc values. Their implementation profiles, versions, interpretation, and presentation need research and explicit agreement before implementation. They must be presented as distinct measurements rather than interchangeable scores or a blanket accessibility guarantee.

**Working proposals:** provide a purpose-filtered view with access to failing combinations; avoid excluding pairs solely through coarse dark/light classifications; consider on-demand calculation or caching before selecting pair-exclusion heuristics. APCA foreground/background direction, typography context, alpha compositing, output gamut, and actual resolved theme values require explicit treatment in the future calculation contract.

The all-pairs view, relevant-pair selection, thresholds, typography inputs, and recalculation strategy remain open. Contrast is one part of evaluating an interface; status meaning must also remain understandable without relying on color alone.

## Model and architecture boundaries

- Follow the existing [scale-helper boundary](../design-tokens/conceptual-model.md#scale-generation): calculations propose candidates; selected candidates become ordinary editable canonical tokens. There is no implicit live link to a generation recipe.
- Semantic tokens retain authored references to primitive or other semantic tokens. Those aliases are real model relationships, distinct from a live dependency on the helper that proposed them.
- A recipe is authoring guidance, not a new canonical entity, persistence schema, or plugin mechanism. For color ramps, the 20 November direction below agrees retaining generation settings as optional group metadata; exact schema and broader recipe retention remain open.
- Keep deterministic color operations in the domain engine and accepted-change coordination in application operations. The guided UI collects choices and presents proposals.
- Preserve the existing exact authored-color policy. Algorithms, gamut mapping, and approximations must be agreed for this new operation scope; the feature does not silently extend the bounded Increment 003 conversion contract.
- No AI service is selected or required by this concept. Suggestions must not silently invent semantics or overwrite authored choices.

## Agreed ramp direction — 20 November 2026

**Confirmed product direction; documentation only, no implementation authorized.**

A color ramp is an ordinary namespace group with optional ramp authoring metadata,
not a separate entity alongside groups and tokens. Its members remain ordinary,
independently editable color tokens with stable identities. Group containment
continues to determine paths; ramp metadata does not introduce a token value type
or group-level type inheritance.

Remember generation settings so users can reopen and adjust a ramp. Metadata
needs to describe ordered steps and their token identities, the seed and its
assigned step, and the agreed generation settings. Exact fields and schema remain
open. Project retention and backups should preserve this information; individual
export profiles may include, translate or omit it under an explicit policy.

Generation and regeneration produce an editable proposal. Only reviewed, accepted
changes become applied data; reopening or changing settings never automatically
rewrites tokens. This extends the earlier recipe-retention question for color
ramps without introducing live computed token values.

### Manual overrides

- The seed anchor preserves the exact seed at its assigned step and is a generation
  input, not a manual override.
- Generated steps are eligible for proposed changes when settings change.
- An intentional manual value edit, whether in the ramp preview or ordinary token
  inspector, marks that step as manual and preserves its value by default during
  regeneration. Renaming or changing a description does not create an override.
- Show manual steps visibly. Offer **Keep manual value** by default and **Use
  generated value** to preview the current generated candidate. Only accepting
  that candidate removes the override; returning manually to an earlier value
  does not silently re-enable generation.
- A manual override affects its own step, not neighbouring candidates. Turning it
  into another generation anchor would be a separate future capability.
- If a step-count or naming change would remove an overridden step, surface that
  consequence for review; never silently delete its token.

Protection from regeneration and detachment from ramp membership are different
concepts. Detachment behavior and the relationship between ramp overrides and the
existing token regeneration-protection metadata remain unresolved.

### Automatic seed placement

Offer **Auto** alongside explicit seed-step selection. Auto proposes a suitable
step using the selected ramp's lightness distribution and generation policy,
shows the suggested position, and lets the user choose another. A color has no
intrinsic scale label: placement is recipe-dependent, not an objective property
of the seed.

Preserve the exact seed and fit the proposal around it. Save the accepted position
so reopening does not unexpectedly move it. Users can explicitly recalculate
placement after changing the seed or recipe. The fitting algorithm, tie-breaking,
edge cases and interaction details remain open.

## Questions for future work

1. Which ramp algorithm, color space, step count, hue behavior, precision, alpha, and gamut policies should be used? How should Auto fit the exact seed to the named steps, resolve ties and handle seeds outside the intended distribution?
2. How should users compare accent suggestions, control neutral tint, and revise or retain selected candidates?
3. What makes status colors sufficiently coherent and distinguishable, and how should conflicts be surfaced?
4. Which opinionated semantic names, roles, states, and intended pairs belong in the first recipe? How much customization is useful?
5. How are light/dark assignments and any needed axes or presets proposed within existing project configuration?
6. Which WCAG/APCA profiles and contextual inputs should be supported, and how should diagnostics and an independent contrast view be presented?
7. How should acceptance, existing-token collisions, repeated generation, and user-edited tokens be handled safely?
8. What is the versioned ramp-metadata schema, and how do retention, backup and each export profile preserve or omit it? How are ordered step membership, renamed/moved tokens, references and missing members handled?
9. How do manual overrides relate to existing regeneration protection? What are the explicit detach, removed-step, reset and partial-acceptance behaviors?
10. Which settings and entry points belong in the first slice, how do naming presets constrain step counts, and what batch/Undo contract applies? No detailed layout, algorithm or implementation contract is agreed yet.

When this work is explicitly resumed, use this concept and the [open questions](../planning/open-questions.md#guided-color-foundations-and-interface-semantics) to prepare a bounded proposal through the existing designer/user/analyst workflow. The first exploration is agreed in direction only; its design, contract, and execution still require the usual authorization.
