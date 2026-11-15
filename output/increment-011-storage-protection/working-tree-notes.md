# Working-tree notes separate from the storage amendment

## Concurrent CSS

`src/presentation/styles/global.css` changed slider-thumb width/height from 20px
to 16px for WebKit and Gecko during this task. Neither coordinator nor developer
made that edit. It is preserved as user work and excluded from amendment review
and authorship. The build sees the working-tree CSS; no claim is made that this
amendment independently qualified that unrelated visual change.

## Existing Git directory casing

Baseline `3ee9ed9` stores the 39-file directory as
`src/presentation/workbench/`, while the physical directory and intended imports
use `src/presentation/Workbench/`. Every physical file’s content was compared with
its committed lowercase counterpart and matched exactly. This predates the storage
amendment; both prefixes are excluded from its review snapshot. Case-sensitive
checkouts need the adopted capitalized directory recorded in Git.

No index/configuration/staging change was made by the agents. When ready to stage,
the user can record the directory casing explicitly through an unused temporary
name, instead of relying on case-insensitive automatic detection:

```sh
git mv src/presentation/workbench src/presentation/Workbench-case-tmp
git mv src/presentation/Workbench-case-tmp src/presentation/Workbench
git diff --cached --name-status
```

These commands stage the case-only directory rename; they do not commit or push.
They are instructions for the user, not commands run during this task. Keep the
rename distinct from the concurrent CSS and the actual persistence changes when
reviewing the staged diff.
