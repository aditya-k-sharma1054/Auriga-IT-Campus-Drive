# ParkOps — Information Architecture, Pages & UX

## 1. Primary UX objective

A parking attendant should be able to understand the garage status and perform the core operation with minimal cognitive and interaction overhead.

## 2. Routes

### `/`
Landing page.

### `/login`
Login.

### `/register`
Registration + garage creation context.

### `/app/dashboard`
Primary operating screen.

### `/app/history`
Historical parking log.

Checkout is a modal/sheet from active vehicle views.

## 3. Global application shell

Authenticated area:

- top bar/side navigation;
- garage name;
- current user;
- Dashboard navigation;
- History navigation;
- logout.

Do not spend time building a complicated admin shell.

## 4. Landing page

Required sections:

1. Hero: what ParkOps is.
2. Core features.
3. Target audience.
4. How it helps.
5. Exactly three next features.
6. CTA to register/login.

Suggested next features:

- reservations;
- online payments;
- analytics/reporting.

These are future-feature copy only, not base implementation.

## 5. Login page

Fields:

- email;
- password.

States:

- idle;
- submitting;
- invalid credentials;
- validation error;
- success.

## 6. Registration page

Fields:

- name;
- email;
- password;
- garage name;
- garage address.

After success, take user into authenticated dashboard.

## 7. Dashboard

### Top area

Four operational metrics:

- total spots;
- occupied;
- available;
- EV available.

### Primary action area

#### Check-in card

- plate input;
- vehicle type selector;
- check-in button.

#### Find vehicle card

- plate search input;
- search action;
- active result.

### Active vehicles table/list

Columns:

- plate;
- type;
- spot;
- checked-in time/duration;
- action.

### EV availability

Show:

- EV total;
- EV available;
- compact list of EV spots and statuses.

## 8. Check-in result

Use an inline confirmation/toast plus visible assigned spot.

Example:

```text
Vehicle checked in
RJ14AB1234
Floor 2 • EV-04
```

Do not make the attendant hunt through the dashboard for the result.

## 9. Checkout modal/sheet

Show:

- plate;
- vehicle type;
- assigned spot;
- duration;
- billable hours;
- final fee;
- confirm checkout.

After success:

- clear/close modal;
- show receipt-like result;
- refresh active count and spot availability.

## 10. History page

Required controls:

- plate search;
- sort field;
- sort direction;
- page navigation;
- page size if time permits.

Table:

- plate;
- type;
- spot;
- check-in;
- check-out;
- fee.

Include explicit empty results and failed-load states.

## 11. Interaction rules

- Primary action buttons should be visually obvious.
- Loading should disable duplicate submissions.
- API errors should be human-readable.
- Never show a successful check-in until the server confirms it.
- Never show a final fee based solely on a client-side estimate.
- Search should submit on action/Enter; live keystroke search is optional.

## 12. Accessibility baseline

- labels for all form fields;
- keyboard focus visible;
- buttons have meaningful text/tooltips;
- color is not the only status indicator;
- sufficient contrast;
- error messages associated with the relevant input or action.

## 13. Design priority

1. scanability;
2. clear operational actions;
3. consistent spacing/typography;
4. responsive behavior;
5. decorative polish.
