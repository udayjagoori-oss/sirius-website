# SIRIUS — Flagship Website

A responsive, single-page brand website built with semantic HTML, CSS, and vanilla JavaScript. No build step or package installation is required; designed for GitHub Pages.

## Preview locally

Open `index.html` in a modern browser. Google Fonts and the Unsplash photography load over the internet; CSS artwork remains as a visual fallback if images do not load.

## Before launch — required configuration

1. **Form delivery:** Create a dedicated SIRIUS form at [Formspree](https://formspree.io/). In `script.js`, replace `https://formspree.io/f/REPLACE_WITH_SIRIUS_FORM_ID` with the SIRIUS endpoint. Do not reuse FORGE's endpoint unless you intentionally want both brands' enquiries in the same inbox.
2. **WhatsApp:** In `script.js`, set `WHATSAPP_NUMBER` to the SIRIUS business number in international digits-only format, including the country code. Example format: `919876543210` (example only).
3. **Branding/legal:** The name SIRIUS has not been legally cleared here. Check the business name, trademark, and domain before investing in public branding. No registered-trademark symbol is used.
4. **Portfolio accuracy:** FORGE ATHLETICS is marked as a concept project. The other two cards are labelled concept directions, not client testimonials or claimed client results.
5. **Test before launch:** Submit a real form entry and confirm receipt; click the WhatsApp link on phone and desktop; check all external links; review at phone/tablet/desktop widths; and test keyboard navigation and reduced-motion preferences.

## Publish on GitHub Pages

1. Upload `index.html`, `styles.css`, `script.js`, `favicon.svg`, and this README to the repository root.
2. In **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
3. Wait for GitHub Pages to publish and test the live URL.

## Files

- `index.html` — page structure, imagery, project cards, contact form, and metadata
- `styles.css` — visual system, responsive layouts, and motion
- `script.js` — mobile navigation, scroll reveals, pointer response, WhatsApp configuration, validation, and Formspree submission
- `favicon.svg` — custom star mark
