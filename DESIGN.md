---
name: Celestial Cinema
colors:
  surface: '#131410'
  surface-dim: '#131410'
  surface-bright: '#393a35'
  surface-container-lowest: '#0d0f0b'
  surface-container-low: '#1b1c18'
  surface-container: '#1f201c'
  surface-container-high: '#292a26'
  surface-container-highest: '#343530'
  on-surface: '#e4e3db'
  on-surface-variant: '#c6c9ab'
  inverse-surface: '#e4e3db'
  inverse-on-surface: '#30312c'
  outline: '#909378'
  outline-variant: '#454932'
  surface-tint: '#b6d300'
  primary: '#ffffff'
  on-primary: '#2c3400'
  primary-container: '#d0f100'
  on-primary-container: '#5c6b00'
  inverse-primary: '#566500'
  secondary: '#ffffff'
  on-secondary: '#2c3400'
  secondary-container: '#d1f100'
  on-secondary-container: '#5c6b00'
  tertiary: '#ffffff'
  on-tertiary: '#490080'
  tertiary-container: '#f0dbff'
  on-tertiary-container: '#8a33d9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d0f100'
  primary-fixed-dim: '#b6d300'
  on-primary-fixed: '#181e00'
  on-primary-fixed-variant: '#404c00'
  secondary-fixed: '#d1f100'
  secondary-fixed-dim: '#b7d300'
  on-secondary-fixed: '#181e00'
  on-secondary-fixed-variant: '#404c00'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#131410'
  on-background: '#e4e3db'
  surface-variant: '#343530'
typography:
  display-lg:
    fontFamily: Instrument Serif
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Instrument Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Instrument Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  section-gap: 8rem
  grid-gutter: 24px
  card-padding: 2rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
---

## Brand & Style

This design system is built upon a **Cinematic Glassmorphism** aesthetic, designed to evoke a sense of prestige, cosmic scale, and technical mastery. It targets creative professionals and elite learners who value high-production quality and "big screen" digital experiences.

The visual narrative is anchored by deep space backgrounds punctuated by ethereal aurora light leaks. The interface feels like a high-end physical theater or a premium digital gallery, utilizing "Email-style" modularity where content is encapsulated in distinct, floating containers. This creates a sense of focused storytelling, where each section of the interface acts as a curated scene. The mood is sophisticated, futuristic, and intentionally immersive, drawing the user into a dark-mode environment where high-contrast accents guide the eye with precision.

## Colors

The palette is dominated by **Absolute Blacks (#050505)** and **Deep Carbons (#111111)** to ensure maximum depth and contrast. This dark foundation allows the primary "Electric Lime" to vibrate with intense energy, signaling interactivity and success.

A secondary "Nebula Purple" (#A855F7) is utilized exclusively for background atmospheric effects, such as aurora blurs and subtle glow trails, creating a sense of three-dimensional space. Muted text in a desaturated olive-grey (#83837D) ensures that secondary information recedes, maintaining the hierarchy and preventing visual fatigue in the dark environment.

## Typography

This design system uses a high-contrast typographic pairing to bridge the gap between editorial elegance and technical clarity.

**Instrument Serif** is the voice of the brand, used for large-scale headlines and "Certificate" titles. It should be used with tight letter-spacing in display sizes to emphasize its sophisticated, thin strokes and sharp terminals.

**Inter** provides the functional backbone. It is utilized for all body copy, navigation, and data points. By using varying weights of Inter—specifically Medium for UI labels and Regular for long-form text—the system remains highly legible against complex, dark backgrounds.

## Layout & Spacing

The layout follows a **modular "Email-style" fixed grid**. Content is housed within central containers that have a maximum width, creating clear margins on the left and right that allow the aurora background effects to breathe.

Spacing is generous, prioritizing "white space" (or in this case, "black space") to create a cinematic rhythm. Sections are separated by large vertical gaps to ensure each piece of content feels like an independent event. Alignment should be strictly grid-based, but elements inside cards may use dynamic padding to accommodate varying media aspect ratios.

## Elevation & Depth

Depth is achieved through **translucent layering and atmospheric lighting** rather than traditional drop shadows.

1.  **Level 0 (Deep Space):** The base `#050505` background containing the animated aurora and star fields.
2.  **Level 1 (Containers):** Surfaces using `#111111` with a subtle 1px border of `rgba(255,255,255,0.1)`. This creates the "ring" effect around modules.
3.  **Level 2 (Interactive Elements):** Buttons and active states utilize a localized "Lime Glow" (a drop shadow with 20px blur using the primary color at 20% opacity) to simulate the element emitting light.

Video and image cards should use a `backdrop-filter: blur(10px)` when positioned over background effects to maintain readability.

## Shapes

The design system employs a **Refined Rounded** language. All main containers and feature cards use a 1rem (16px) corner radius to soften the high-contrast aesthetic. Smaller interactive components like buttons and tags use 0.5rem (8px) to maintain a crisp, professional feel.

The "ring borders" around containers should perfectly track the corner radius, creating a nested, protective feel around the content.

## Components

### Buttons
Primary buttons are solid `#DCFF00` with black text. On hover, they should scale slightly (1.02x) and increase their outer glow intensity. Secondary buttons are ghost-style with a white or lime 1px border and no fill.

### Media Cards
High-quality video or image thumbnails are the centerpiece. These cards must feature a `scale(1.05)` transition on hover. Text overlays on cards should use a bottom-to-top dark gradient for legibility.

### Containers
The "Email-style" container is the primary layout wrapper. It features a solid `#111111` background, a 1px `rgba(255,255,255,0.08)` border, and significant internal padding (32px+).

### Inputs & Selects
Inputs are dark-filled with subtle borders. The focus state replaces the border with a 1px solid Primary Lime stroke and a soft outer glow.

### Progress Indicators
For certificates, progress bars should use a "scanning" animation effect—a bright lime highlight moving across a dark grey track.