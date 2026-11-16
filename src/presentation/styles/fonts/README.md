# Self-hosted Geist fonts

The current assets are unmodified variable WOFF2 files copied on 16 November 2026
from the user's download of the [Vercel Geist font repository](https://github.com/vercel/geist-font).
Both Geist and Geist Mono report embedded version 1.900 and a `wght` axis spanning
100–900 (default 400). The archive's exact upstream revision/commit was not
verified. Source paths, byte counts and SHA-256 hashes are recorded in
[font-provenance.json](font-provenance.json); embedded versions and axes are in
[font-versions.json](font-versions.json).

These replace Increment 014's five static TrueType assets (Geist 1.800 and Geist
Mono 1.701). Each family has one normal-style `@font-face` in `../global.css`,
declaring `font-weight: 100 900` and `font-display: swap`. Existing UI weights,
font sizes and fallback stacks remain in that theme source. Vite fingerprints and
bundles the local assets in production; no font package or external runtime
service is used.

The download's unmodified SIL Open Font License is retained as the
[Geist license](geist-OFL.txt) and [Geist Mono license](geistmono-OFL.txt).
Preserve these licenses when distributing the files.

This browser delivery has no service worker or guaranteed offline application
shell. Bundled fonts are served with the application's existing assets; no new
installation or offline guarantee is introduced here.
