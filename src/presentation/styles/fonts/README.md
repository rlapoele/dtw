# Self-hosted Geist fonts

Increment 014 vendors unmodified TrueType files on 16 November 2026 from the
reviewed V1 font snapshot. Geist is embedded version 1.800 (Google Fonts delivery
revision `geist/v5`); Geist Mono is version 1.701 (`geistmono/v6`). The exact
upstream URLs, byte counts and SHA-256 hashes are in [font-provenance.json](font-provenance.json).
[font-versions.json](font-versions.json) records the fonts' embedded version names.
These delivery revisions are not asserted to be Git commit identifiers.

Geist 400/500/600 and Geist Mono 400/500 use `font-display: swap`. The declarations
in `../global.css` reference these local assets; Vite fingerprints and bundles them
in production. No font package or external runtime service is used. System sans
and mono fallback stacks remain in the same theme source. Preserve the unmodified
[SIL OFL Geist license](geist-OFL.txt) and [Geist Mono license](geistmono-OFL.txt)
when distributing these files.

This browser delivery has no service worker or guaranteed offline application
shell. Bundled fonts can be served/cacheable with the application's existing
assets; no new installation or offline guarantee is introduced here.
