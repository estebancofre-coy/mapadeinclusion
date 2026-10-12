# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Community members and families looking for disability and neurodivergence organizations and support in Aysén.
- Students and educators using the Social Work and Disability course materials, field checklists, and Observa Chile accessibility guide.

## Product Purpose

Visibilizar es Intervenir helps people discover local organizations and supports learning and field observation about disability, neurodiversity, and accessibility in Aysén. Success means visitors can find relevant organizations and students can use the integrated educational and inspection tools.

## Positioning

A regional public organization map is integrated with course materials, field instruments, and an accessibility inspection guide, connecting discovery with learning and observation.

## Operating Context

Visitors use the site on desktop and mobile web. The map uses Leaflet and OpenStreetMap. Organization records and management-panel demonstration data are stored in the browser; Observa Chile inspections and evidence are saved locally in the browser. The application also includes course materials, a presentation, field checklists, CSV export, and PDF report generation.

## Capabilities and Constraints

- Public map of organizations across Aysén, searchable and filterable by commune and type, with an accessible table alternative and CSV export.
- Course program, keyboard-navigable presentation, in-situ checklist, and Observa Chile legal and field guide with accessibility checklist, photo evidence, scoring, and PDF report.
- Demonstration management panel for organization records.
- Preserve the existing product name, mission, content, features, accessibility controls, and institutional attribution during visual redesign.
- Do not imply that ESPORA sponsors, operates, or endorses this product. Do not add the FAO mark or other institutional marks from the ESPORA package.

## Brand Commitments

- Retain the name **Visibilizar es Intervenir** and its purpose.
- The user requested ESPORA's supplied visual identity as a visual direction only; it does not change product ownership, audience, or mission.
- Keep the existing Universidad de Aysén attribution relevant to the course and its source materials.
- Continue to present the site in Spanish and preserve its inclusive, accessible language.

## Evidence on Hand

- Product description and capabilities: `README.md`.
- Existing app surfaces: `src/pages/`, `src/sections/`, and `src/observa-chile/`.
- ESPORA visual reference: supplied package `branding/LEEME.md`, `branding/espora-brand.css`, and ESPORA-owned illustrations `espora-arbol-bosque.png`, `espora-arbol-salvia.png`, `espora-hojas.png`, and `espora-huemul.png`. These are references for visual treatment, not evidence of affiliation.
- Existing university marks and course attribution are in `public/assets/` and `README.md`.

## Product Principles

1. Make local organizations discoverable without obscuring how people can contact them.
2. Connect learning and field observation to practical accessibility and inclusion.
3. Keep mapping, checklists, inspection evidence, and reports usable on desktop and mobile.
4. Preserve keyboard, contrast, readable-text, and accessible non-map pathways.
5. Keep product and institutional claims grounded in the supplied content.

## Accessibility & Inclusion

The existing product targets WCAG 2.1 AA and includes persistent contrast and text-size controls, skip links, landmarks, live regions, keyboard navigation, a table alternative to the map, and reduced-motion support. Preserve and strengthen these behaviors in the redesign.
