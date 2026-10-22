# midproject
# StartHub — Tech Startup Directory (React SPA Midterm Project)

A modern, fully functional Single Page Application (SPA) built with React, styled using Tailwind CSS, and powered by an asynchronous simulated API with persistent `localStorage`.

## 🚀 Features & Rubric Checklist (10/10 Points)

### 1. Data Requirements (100+ Initial Records)
- Features 105 realistic startup records dynamically seeded in `initial-data-sample.js`.
- Fully asynchronous API abstraction layer (`fakeApi.js`) using `Promise`, `setTimeout`, and `localStorage`.

### 2. Meaningful React Components
The project is divided into modular reusable components:
- `Navbar`: Sticky navigation with metrics and actions.
- `StatsSummary`: Overview analytics board calculating total MRR, average rating, and top category.
- `FilterBar`: Controlled input search, sorting selector, category filter, MRR range, and rating filters.
- `StartupCard`: Card view for listing items with stable keys.
- `StartupDetailModal`: Detailed modal view for company insights.
- `AddStartupModal`: Controlled form with field validation.
- `Pagination`: Custom pagination with ellipsis jump options.
- `StateFeedback`: Handles Loading, Error, and Empty states.
- `Toast`: Temporary status message banner.

### 3. State Management & Asynchronous Handling
- Uses `useState` and `useEffect` appropriately.
- Dynamic search, multi-field filtering, multi-column sorting, and pagination.
- Clean cancellation pattern (`isMounted`) in `useEffect` preventing memory leaks and stale state updates.
- Zero direct DOM manipulation.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd fake-api
