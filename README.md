# EmployeeManager

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Prerequisites

- Node.js (v16+)
- npm (comes with Node.js)

## Setup & Development

1. Install dependencies  
   `npm install`

2. Run the dev server  
   `ng serve`

3. Open in browser  
   Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Project Structure & Implementation Notes

- **EmployeeListComponent**  
  - Hosts the search/filter inputs, sort buttons, and a Toggle View button.  
  - Maintains a `cardView: boolean` flag to switch between table and card layouts.  
  - Uses RxJS operators (`debounceTime`, `distinctUntilChanged`, `combineLatest`) to drive a single `filteredAndSorted$` stream.

- **EmployeeCardComponent**  
  - Selector: `tr[app-employee-card]`  
  - Renders a table-row (`<td>…</td>`) for each employee with Edit/Delete buttons.

- **GridEmployeeCardComponent**  
  - Selector: `app-grid-employee-card`  
  - Renders a styled CSS-Grid card (3-per-row) showing Name, Email, Position, Start Date, Skill Count, plus Details/Edit/Delete actions.

- **EmployeeFormComponent**  
  - Reactive form for Add/Edit.  
  - Fields: Full Name (min 3 chars), Email, Position (dropdown), Start Date (date picker), Skills (nested FormArray).  
  - Validation: required, minlength, email format.  
  - Skill rows must have non-empty names (min 3 chars) and you can add up to 10 skills.  
  - Emits `saved` (payload without id) and `cancel` events.

- **EmployeeDetailsComponent**  
  - Shows full details and a bullet list of all skills in a modal.  
  - Triggered by the “Details” link in the grid view.

- **Modals**  
  - `<app-modal>` wraps both the form (EmployeeFormComponent) and the details view (EmployeeDetailsComponent).

- **Styling**  
  - Table view: classic `<table>` with flex-based action buttons that auto-stretch.  
  - Card view: CSS Grid (`grid-template-columns: repeat(3,1fr)`) with responsive breakpoints at 900px and 600px.  
  - Cards feature subtle shadow, hover-lift, and “Details” links styled as text.

- **Data**  
  - EmployeeService holds a local array seeded with sample employees (including a few U.S. Presidents).  
  - Provides `employees$` as a BehaviorSubject stream and methods for add, update, and delete.

## Further Commands

- **Generate a new component**  
  `ng generate component component-name`

- **Build for production**  
  `ng build`

- **Run unit tests**  
  `ng test`

- **Run e2e tests**  
  `ng e2e`