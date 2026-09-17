# ParkOps — Design System Rules

## Purpose

This document is the visual contract shared by Stitch and the React implementation.

## Product character

ParkOps should feel:

- trustworthy;
- operational;
- modern;
- precise;
- calm under pressure.

## Layout

- Desktop-first operational workspace.
- Use a clear max-width/container strategy.
- Keep primary actions in the first visible viewport.
- Use a consistent grid for cards/tables.
- Avoid overly wide text blocks.

## Typography

Use a modern sans-serif family with clear distinction between:

- page title;
- section title;
- metric value;
- body;
- metadata;
- error/helper text.

Prefer hierarchy through size/weight/spacing before decorative effects.

## Spacing

Use a consistent spacing scale and avoid arbitrary one-off gaps.

## Components

Define reusable visual patterns for:

- primary/secondary buttons;
- text inputs;
- select fields;
- metric cards;
- tables;
- status badges;
- confirmation dialogs;
- empty states;
- error states;
- loading states;
- navigation.

## Status semantics

Use both icon/text and visual emphasis for statuses:

- AVAILABLE
- OCCUPIED
- ACTIVE
- COMPLETED
- success
- warning
- error

Do not depend on color alone.

## Dashboard hierarchy

```text
1. garage/identity context
2. occupancy metrics
3. check-in action
4. vehicle search
5. active vehicles
6. EV availability
7. secondary information
```

## Tables

Tables must remain readable when the log becomes large.

Use:

- sticky/clear headers where useful;
- aligned numeric data;
- concise status cells;
- explicit pagination.

## Forms

- labels always visible;
- examples/placeholders useful but not substitutes for labels;
- validation messages near the relevant field;
- disable submit while processing;
- preserve entered data after recoverable errors.

## Motion

Motion is optional and restrained.

Use it only for:

- modal/sheet transitions;
- lightweight success confirmation;
- loading feedback.

Never let animation delay the attendant's action.
