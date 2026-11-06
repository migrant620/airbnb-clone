---
version: alpha
name: Airbnb Explore and Booking Flow
description: Photo-led white cards on a plain page, a near-black ink with a single rose accent, and a search sheet that reads as one sentence in three clauses. Covers the first batch (Explore, the search sheet, results, listing detail, the photo viewer and the sign-in sheet).
colors:
  page: "#FFFFFF"
  card: "#FFFFFF"
  ink: "#222222"
  secondary: "#6C6C6C"
  tertiary: "#717171"
  hairline: "#DDDDDD"
  hairlineSoft: "#EBEBEB"
  brand: "#FF385C"
  reserve: "#D70466"
  continuePink: "#F13F65"
  chipBg: "#F7F7F7"
  counterCircle: "#F2F2F2"
  scrim: "rgba(0,0,0,0.35)"
typography:
  sectionTitle:
    fontFamily: Plus Jakarta Sans
    fontSize: 18.5px
    fontWeight: 700
    lineHeight: 23.7px
    letterSpacing: -0.61px
  cardTitle:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: 600
    lineHeight: 19px
  cardSub:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 18px
  rating:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: 500
    lineHeight: 18px
  detailTitle:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: 700
    lineHeight: 25px
  priceNow:
    fontFamily: Roboto
    fontSize: 20px
    fontWeight: 500
    lineHeight: 24px
  navLabel:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: 500
    lineHeight: 12px
  sheetTitle:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: 700
    lineHeight: 32px
spacing:
  frame: 393x777px
  page: 24px
  searchPillHeight: 56px
  cardWidth: 166.7px
  cardGap: 12px
  cardImageHeight: 158px
  counterRowHeight: 56px
  navHeight: 55px
  navItem: 75x56px
rounded:
  searchPill: 28px
  card: 12px
  cardImage: 12px
  sheet: 16px
  chip: 20px
  counterButton: 28px
  circle: 999px
---

## Overview

Designed for a 393 dp wide phone frame, English, light theme, default font scale. This document covers the first release batch only — the Explore page (All, Homes, Experiences, Services), the search sheet (Where, When, Who), the results list, the listing detail page, the photo viewer and the sign-in sheet a signed-out visitor sees. It is not a complete system for every Airbnb screen.

## Colors

The page, cards, sheets and floating controls are all white, so photography is the only strong colour on screen. Text is `ink`, with `secondary` for supporting lines (location, price note, host subtitle) and `tertiary` for inactive navigation labels. `hairline` draws the few lines there are — the tab underline, chip outlines, the top edge of the navigation bar — with `hairlineSoft` for the faintest dividers. `brand` is the accent: the selected tab, the heart, the guest-favourite badge and the active counter glyph. The Reserve button uses the deeper `reserve`, and the sign-in Continue button uses `continuePink`, so each screen has exactly one saturated control. `counterCircle` is the filled disc behind the guest-counter steppers, and `chipBg` fills unselected chips and the rating pill. Sheets dim the page with `scrim`.

## Typography

Sans text uses Plus Jakarta Sans. Prices, ratings, dates and photo counters use Roboto Medium. Text styles range from regular supporting copy to semibold card titles and bold headings and actions. Headings and prices use negative letter spacing. Navigation labels are 10 dp. Bundled font licenses are included with the project.

## Layout

A 393 dp frame with 24 dp side margins. Explore: a 56 dp search pill 12 dp from the top, then a 40.4 dp category rail 16 dp below it, then two feed rows of 166.7 dp cards with 12 dp between them, each card a 158 dp image over its title, subtitle, price and rating. The navigation bar is 55 dp tall with five 75 x 56 dp cells inside a 4 dp inset from each side. The search sheet stacks Where, When and Who as three 60 dp rows separated by hairlines, with Clear all and Search below. The guest-counter sheet uses the same 56 dp row rhythm. Listing detail is a full-bleed photo, then title, type, rating, host and highlights in a 24 dp margin, with a price bar pinned to the bottom.

## Elevation & Depth

Depth comes from photography and from a few shadows rather than from borders. Cards and the search pill sit on soft shadows; the navigation bar carries a short upward shadow and a single hairline at its top edge. Sheets lift over a flat 35% black scrim with no blur. The floating "Prices include all fees" pill above the navigation bar is white at 97% opacity with its own shadow. The guest-favourite badge is a white pill at 95% over the photograph.

## Shapes

The search pill is fully rounded at 28 dp; cards and their images are 12 dp; chips and the rating pill are 20 dp; sheet tops are 16 dp; the guest-counter stepper discs are circles in `counterCircle` with round-rect glyphs inside; the guest-favourite badge is a pill; the photo-counter pill is fully rounded. Nothing else has a radius, and control outlines — where they exist — are 1 dp `hairline`.

## Components

**Explore and Search.** Explore has a search pill, a horizontal category rail and two rows of listing cards. Search contains Where, When and Who sections, with one expanded at a time. Destination suggestions, date ranges, flexibility choices and guest counters use local state. The results summary displays the selected destination, dates and guest count.

**Results and filters.** Results offer a map with selectable fixed pins and a list of sample stays. View mode, scroll position and selected pin survive a listing-detail round trip. Filter controls edit a draft for price, type of place, rooms and amenities. Closing the sheet discards that draft; Show homes applies the selection to the local filter count and chips. The displayed stay catalogue is fixed sample data and is not a live filtered search result. List-view hearts maintain a local wishlist for this browser session.

**Listing detail.** A photo header leads into the title, capacity, rating, host and highlights. The price bar stays at the bottom. Review and amenity controls open local sample views and retain separate scroll positions when reopened in the current page. Reserve and the detail heart lead to an appearance-only sign-in panel. Closing sign-in returns to the price or host panel that opened it.

**Photos.** Photo tour is a light panel with room tabs for Bedroom, Full bathroom, Backyard and Balcony. Selecting a room or a fullscreen image also updates the detail header photo, and the selection remains when Photo tour reopens. A photo opens a dark fullscreen pager containing four sample images. Arrow keys, Home and End navigate those images; resizing keeps the current photo. The existing counter displays a total of 95, but the prototype does not contain a 95-image gallery.

**Sign-in panel.** A white panel contains a phone-or-email input, Continue, a separator, social sign-in controls and a close control. The contact entry survives dismissing and reopening the panel in the current page. These are local interface elements; no account is authenticated. Search supports initial modal focus, keyboard focus wrapping and restoration on close. Escape closes the topmost sign-in or photo overlay while preserving Photo tour beneath it. Type-of-place buttons, search category tabs and date-flexibility radios support arrow keys, Home and End with a single tab stop per group.

## Do's and Don'ts

Use real text, real inputs and stateful controls with local sample data. Never ship photographs, illustrations or brand graphics taken from Airbnb, and never pass off a reproduction of one as original artwork. Keep the accent single per screen: a screen should not show `brand`, `reserve` and `continuePink` at once. Do not add controls a signed-out visitor cannot see — there is no booking confirmation, no payment sheet and no host tools in this batch.

## Responsive Behavior

Mobile-first at 393 dp. On narrower screens the card rows keep their 166.7 dp cards and the rail scrolls; margins reduce but never collapse; the price bar and the navigation bar stay pinned so every control remains reachable. On shorter screens the sheets and the listing detail scroll rather than compressing. Wider screens centre the phone frame.

## Known Gaps

- This release targets Web at phone width. Native Android and iOS builds, Safari and Firefox are outside its validation scope.
- Airbnb's proprietary Cereal is not bundled; the prototype uses Plus Jakarta Sans and Roboto.
- Listings, hosts, reviews and photographs are sample content. Results are fixed, and the map does not support panning, zooming or a live location search.
- Filter selections and wishlists are local UI state. Trips and Messages remain signed-out placeholders.
- The fullscreen viewer contains four sample images, despite the existing counter's total of 95.
- Sign-in, booking and payment are appearance only. No account, booking or payment is created.
- Selected flows are implemented; this is not complete Airbnb feature or visual coverage.
