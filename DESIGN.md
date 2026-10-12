---
name: Visibilizar es Intervenir
description: Regional organization map and learning tools for disability inclusion in Aysén.
colors:
  primary: "hsl(162 49% 24%)"
  secondary: "hsl(187 79% 28%)"
  background: "hsl(135 14% 96%)"
  foreground: "hsl(204 48% 18%)"
  surface: "#ffffff"
  muted: "hsl(140 35% 93%)"
  muted-foreground: "hsl(200 18% 39%)"
  accent: "hsl(134 33% 86%)"
  border: "hsl(164 24% 83%)"
  destructive: "hsl(0 62% 45%)"
  focus-warm: "#f7cb68"
typography:
  display:
    fontFamily: "Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  full: "9999px"
spacing:
  control: "12px"
  content: "16px"
  card: "24px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
    height: "36px"
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: Visibilizar es Intervenir

## Overview

**Creative North Star: "Territorial visibility"**

“Visibilizar es Intervenir” remains the product name and mission: making Aysén organizations visible while connecting that discovery to learning and accessibility fieldwork. Its visual language uses the supplied ESPORA palette and two tree illustrations within the existing application; this is a visual reference, not an ESPORA affiliation, sponsorship, operation, or endorsement. Arial is the specified typeface.

The same system supports community members and families finding local organizations, as well as students and educators using the course and field tools. Keep the searchable, filterable public map, accessible table and CSV export; course program; keyboard-navigable presentation; cartilla in situ; and Observa Chile legal and field guide, inspection checklist, photo evidence, scoring and PDF report. The demonstration management panel also remains a working product surface. Course attribution to Universidad de Aysén remains in place.

**Key Characteristics:**
- Forest green and petrol blue structure a pale, high-contrast interface.
- Supplied tree illustrations mark the site header and hero without replacing its product identity.
- Cards, bordered controls and responsive columns organize dense public and educational information.
- Map content has an accessible table alternative; keyboard focus and persistent contrast and text-size controls remain visible parts of the experience.

## Colors

Forest green is the primary action and identity color; petrol blue distinguishes secondary actions and supporting emphasis. Pale green neutrals keep the page and section surfaces light, while deep blue-green ink carries text. A warm outline is declared for the hero illustration stage’s `:focus-within` state; destructive red is for error states.

### Primary
- **Forest Green** (`{colors.primary}`): Main navigation, headings, primary actions and the footer.
- **Petrol Blue** (`{colors.secondary}`): Secondary actions, supporting icons, selected organization outlines and secondary badges.

### Neutral
- **Pale Paper** (`{colors.background}`): Main page canvas and control background.
- **Deep Blue-Green Ink** (`{colors.foreground}`): Main text and card text.
- **White Surface** (`{colors.surface}`): Header, cards and other raised content surfaces.
- **Soft Sage** (`{colors.muted}`): Alternating content sections and subdued fills.
- **Muted Blue-Green** (`{colors.muted-foreground}`): Supporting copy and descriptions.
- **Sage Accent** (`{colors.accent}`): Hover fill for outline and ghost controls.
- **Quiet Green Border** (`{colors.border}`): Card, input, table and divider edges.

### Tertiary
- **Warm Focus Gold** (`{colors.focus-warm}`): Existing `:focus-within` outline style on the hero art stage.
- **Error Red** (`{colors.destructive}`): Destructive and invalid form states.

**The Visual Reference Rule.** Apply the supplied ESPORA colors as a visual direction only; do not describe or present the product as affiliated with ESPORA.

## Typography

**Display Font:** Arial, sans-serif

**Body Font:** Arial, sans-serif
**Label/Mono Font:** Arial, sans-serif

**Character:** A single familiar sans-serif family keeps map labels, course material and operational controls consistent and legible. The hierarchy comes from size and weight rather than a contrasting display face.

### Hierarchy
- **Display** (800, 2.25rem base / 3rem at `sm` / 3.75rem at `lg`, 1.25 line-height): The home hero title; it scales up at the existing responsive breakpoints.
- **Title** (700, 1.875rem, 1.2 line-height): Section headings such as the organization map and course introduction.
- **Body** (400, 1rem, 1.5 line-height): Paragraphs, guide content and organization descriptions.
- **Label** (500, 0.875rem): Button text, filter labels and compact interface information.

**The One-Family Rule.** Keep interface and content typography in Arial with a sans-serif fallback; establish hierarchy with the existing size and weight scale.

## Layout

The desktop frame uses a centered, capped content width (up to 80rem / 1280px) with 1rem side insets. Major home sections use 4rem vertical spacing. The sticky header places the product identity and navigation together; at narrower widths, the navigation collapses behind a menu button while the contrast and text-size controls stay available in the expanded menu.

The home hero layers a regional map under a green-to-petrol overlay and places its copy beside the supplied tree illustration at medium and larger widths. The organization finder places filters above a map and organization-card list; at smaller widths the filters and content columns stack. The course and participation sections similarly move from paired or multi-column layouts to stacked content. The accessible table alternative remains available alongside the map. Observa Chile content uses its own centered section shell while retaining the shared palette and spacing.

## Elevation & Depth

Depth is restrained: a light shadow distinguishes the sticky header and white cards from the pale page, while the hero’s illustration stage receives the most visible shadow. The hero map is separated from its white text by a layered color overlay rather than additional cards. Hover can lift organization cards, and the active organization is identified with a clear outline.

### Shadow Vocabulary
- **Surface shadow** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): Header and standard cards.
- **Hero illustration shadow** (`0 18px 42px hsl(var(--primary) / 0.28)`): Circular illustration stage in the home hero, tinted from the primary forest token.
- **Organization-card hover:** Existing higher shadow treatment signals a hoverable, map-linked result.

## Shapes

Controls use gently rounded corners (4px); cards use a more open radius (10px), and status badges are fully pill-shaped. Thin borders define cards, fields, tables and separators. The hero tree illustration sits in a circular clipped stage with a fine translucent border. The active organization card uses an offset outline so selection is distinguishable from its resting border.

## Components

### Buttons
- **Character:** Compact, direct actions with solid primary and secondary fills.
- **Shape:** Gently rounded (4px), with a 36px default height and 8px by 16px padding.
- **Primary:** Forest green with white text; used for the management panel and principal course actions.
- **Secondary:** Petrol blue with white text; used for secondary actions such as map export and the hero’s map action.
- **Outline / Ghost:** Light or transparent resting surface with a border where applicable; hover uses the pale sage accent.
- **Hover / Focus:** Color shifts on hover; keyboard focus uses the shared visible ring/outline treatment. Disabled controls reduce opacity.

### Chips
- **Style:** Compact, bordered pills with 12px text and 2px by 8px padding.
- **State:** Solid forest or petrol fills identify status; outline chips carry organization commune and category metadata.

### Cards / Containers
- **Corner Style:** Rounded (10px).
- **Background:** White with a thin shared border.
- **Shadow Strategy:** Light by default; the organization finder can use a stronger hover shadow.
- **Internal Padding:** Card headers and content use 24px horizontal insets; cards separate content with a 24px gap.
- **Distinctive behavior:** Organization cards can receive keyboard focus or selection and synchronize the chosen organization with its map marker.

### Inputs / Fields
- **Style:** Full-width, transparent-on-paper field with a thin sage border, 4px radius and 36px control height.
- **Focus:** Shared visible 3px keyboard outline/ring; invalid fields use the error color.
- **Disabled:** Non-interactive and visibly reduced in opacity.

### Navigation
- **Style:** Sticky white header with a bottom border and light shadow, site illustration and product name at left, and compact action buttons at right.
- **States:** Current route uses the secondary button treatment; other routes use ghost buttons. The mobile menu exposes the same routes, management action and accessibility controls.

### Footer
The forest-green footer uses a three-column desktop layout that stacks at smaller widths. It retains the Universidad de Aysén mark and the course name, code (TSE013-1), career, semester (2026-II) and “Campus Coyhaique · Lillo 669” attribution, alongside the demonstration-data note and OpenStreetMap attribution.

### Organization Finder
The finder combines commune/type filters and text search, a Leaflet map, map-linked organization cards, CSV export, and an expandable accessible table alternative. Filtering and selected-state affordances use the shared input, button, badge, card and outline styles.

### Hero
The home hero keeps the regional map, dark green-to-petrol overlay, product title, course attribution and two calls to action. A supplied tree illustration sits in a bordered circular stage; it is decorative and does not replace the product name or university attribution.

## Do's and Don'ts

### Do:
- **Do** use Arial and the existing forest, petrol, pale-paper, sage and ink roles.
- **Do** retain “Visibilizar es Intervenir,” its purpose and Spanish-language interface.
- **Do** keep the map, educational pages, checklist, inspection tools, management panel and accessibility controls within their current product context.
- **Do** preserve Universidad de Aysén attribution where it identifies the course and its source materials.
- **Do** keep the supplied tree illustrations decorative and use the existing visible keyboard-focus, contrast and text-size affordances.

### Don't:
- **Don't** imply ESPORA sponsors, operates or endorses this application.
- **Don't** add the FAO logo or other ESPORA-package institutional marks.
- **Don't** remove the Universidad de Aysén course attribution or replace the application’s product name and mission.
- **Don't** treat map, checklist, report or course tools as decorative previews; they are working product surfaces.
