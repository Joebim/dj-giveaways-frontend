# DJ Giveaways Backend API Requirements

_Generated: 2025-11-09_

This document translates the current frontend implementation into a concrete API contract for the backend team. The React app still relies on static mocks (see `src/data/homeData.json` and `src/store/useAdminStore.ts`), so the goal is to expose production-ready endpoints that let us replace every hard-coded dataset with live data while preserving existing UI behaviour.

---

## 1. Conventions & Cross-Cutting Concerns

**Base URL & Versioning**

- Frontend axios client defaults to `VITE_API_BASE_URL` or `http://localhost:5000/api/v1` (`src/services/api.ts`).
- Stick with `/api/v1` and expose version in the path.

**Response Envelope**

- React Query wrappers expect either `{ data: ... }` or a plain payload. To stay consistent, return:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "optional human readable note",
    "meta": { "pagination": { ... } }
  }
  ```
- On errors use:
  ```json
  {
    "success": false,
    "message": "Something went wrong",
    "errors": { "field": ["message"] }
  }
  ```

**Authentication & Sessions**

- Frontend uses HTTP-only cookies with `withCredentials: true` (see axios config). Issue and refresh tokens via cookies.
- Provide `/auth/refresh` to rotate tokens. A `401` on any route must allow the interceptor to retry once after refresh.
- Roles (`user`, `admin`, `super_admin`) come from the `User` model (`src/types/user.types.ts`).

**Authorisation Middleware**

- `requireAuth`: rejects unauthenticated users (401).
- `requireAdmin`: ensures `user.role` is `admin` or `super_admin` (`src/components/auth/AdminRoute.tsx`).
- `requireSuperAdmin` (optional) for high-risk actions (e.g., deleting competitions, managing other admins).

**Validation & Error Handling**

- Validate all payloads (celebrate/zod/joi).
- Convert validation issues to `422` with field-level messages.
- Log server errors but return generic 500 message (frontend already toasts).

**Pagination & Filtering**

- Query parameters follow TanStack Query patterns:
  - `page` (1-based), `limit`
  - `search`, `status`, `category`, `featured`, `sort=field:direction`
  - Ranges: `priceMin`, `priceMax`, `prizeMin`, `prizeMax`
  - Date filters: `from`, `to`
- Return `meta.pagination = { page, limit, totalItems, totalPages }`.

**Soft Deletes & State**

- For resources shown in the UI pagers (competitions, champions, draws), prefer soft delete (`isActive`, `deletedAt`) so historical data remains for analytics and the Winners page.

**File Upload Handling**

- Champions require image upload via `multipart/form-data` (`adminService.createChampion` sends `FormData`).
- Accept `image` field with storage metadata in response (`url`, `publicId`).

**Currency & Numbers**

- Monetary values in pennies to avoid floating point issues; format as decimals for responses (`£` is added client side).

---

## 2. Authentication & User Account

The app already integrates login/register/profile flows (`src/services/authService.ts`, `src/hooks/useAuthQuery.ts`). Supply these endpoints:

| Method | Path                    | Auth          | Description                                                         |
| ------ | ----------------------- | ------------- | ------------------------------------------------------------------- |
| POST   | `/auth/register`        | -             | Create account; expects `RegisterRequest`                           |
| POST   | `/auth/login`           | -             | Issue session cookies on success                                    |
| POST   | `/auth/admin/login`     | -             | Same as login but checks admin role                                 |
| POST   | `/auth/logout`          | ✅            | Clears cookies                                                      |
| POST   | `/auth/refresh`         | refresh token | Rotates tokens; returns 200 even if no change                       |
| GET    | `/auth/profile`         | ✅            | Returns `{ user }`                                                  |
| PUT    | `/auth/profile`         | ✅            | Update profile fields (`firstName`, `phone`, `address`, newsletter) |
| POST   | `/auth/forgot-password` | -             | Sends reset email                                                   |
| POST   | `/auth/reset-password`  | -             | Accepts `{ token, password }`                                       |
| POST   | `/auth/verify-email`    | -             | Marks user verified                                                 |
| POST   | `/auth/change-password` | ✅            | Authenticated password change                                       |
| GET    | `/auth/admin/verify`    | ✅            | Returns `{ user, isAdmin, isSuperAdmin }`                           |

**Backend Notes**

- Return payloads shaped like TypeScript types in `src/types/user.types.ts`.
- Include `role`, `isVerified`, `isActive`, `subscribedToNewsletter`.
- When login/register succeed, respond with `{ user }`; tokens stay in cookies (no need to return `token`, but keep compatibility by also returning one if trivial).

---

## 3. Public-Facing Content

### 3.1 Home Page Aggregates

The Home route (`src/pages/Home/Home.tsx`) currently reads from `homeData.json`, expecting:

- `hero.image`
- `competitions[]` (id, title, image, price, soldTickets, maxTickets, progress)
- `champions[]` (id, name, image, quote)
- `stats[]` (value, label, icon)
- `recentDraws[]` (id, winner, location, prize, prizeValue, ticketNumber, drawDate, image)
- `reviews[]` (id, title, body, rating, reviewer, timeAgo, verified)

**Recommended Endpoint**

- `GET /content/home`
  ```json
  {
    "data": {
      "hero": { "image": "...", "alt": "..." },
      "competitions": [ { "id": "comp_123", ... } ],
      "champions": [ { "id": "champ_123", ... } ],
      "stats": [ { "value": "21K+", "label": "Champions", "icon": "trophy" } ],
      "recentDraws": [ ... ],
      "reviews": [ ... ]
    }
  }
  ```
- Use caching (e.g., 5 min) and populate from source tables (`competitions`, `winners`, `reviews`, `cms_blocks`).
- Expose fallback endpoints for each resource too (see sections below) so other pages can request them independently.

### 3.2 Competitions Catalogue

Files referencing `homeData.competitions` / `useCompetitionStore` include:

- `src/pages/Competitions/CompetitionsList.tsx`
- `src/components/home/CompetitionCard.tsx`
- `src/pages/Admin/Competitions/Competitions.tsx`
- `src/pages/Admin/Competitions/CompetitionForm.tsx`
- `src/pages/CompetitionDetail/CompetitionDetail.tsx`

**Public Endpoints**

- `GET /competitions`
  - Query params: `page`, `limit`, `status`, `category`, `featured`, `search`, `priceMin`, `priceMax`, `prizeMin`, `prizeMax`, `sort`.
  - Returns `{ competitions: Competition[], pagination }`.
- `GET /competitions/featured` – subset for home hero tiles.
- `GET /competitions/:id`
  - Must include all fields consumed by detail page:
    - `images: string[]`
    - `ticketPrice`, `originalPrice` (optional), `maxTickets`, `soldTickets`
    - `question`, `answers[]`, `correctAnswer` (frontend currently stores correct answer; backend should omit or only deliver to admins. For entrants, return `questions` with a `correctAnswer` field only if user is admin or this competition uses skill questions differently. Provide `answerOptions[]` for the UI.)
    - `features[]`, `included[]` (or `specifications[]` from `CompetitionSpec`)
    - `drawDate`, `startDate`, `endDate`
    - `featured`, `status`
    - `category`
- `GET /competitions/:id/progress`
  - Optional. Returns `{ soldTickets, maxTickets, entriesRemaining }` for real-time updates.

**Public Business Logic**

- Validate ticket quantity (max 20 per add-to-cart per UI).
- Provide boolean `isGuaranteedDraw`, `cashAlternative` etc if stored.

### 3.3 Winners & Draw Archive

The `Winners` carousel and the dedicated `Draws` page both depend on draw history:

- Card fields: `winner`, `winnerLocation`, `prizeName`, `prizeValue`, `winningTicketNumber`, `drawDate`, `imageUrl`.
- The archive offers pagination and falls back to curated JSON when the API is unavailable.

**Endpoints**

| Method | Path            | Description                                                                                                                       |
| ------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/draws`        | Paginated archive. Query params: `page`, `limit`, `competitionId`, `from`, `to`. Returns `{ draws: Draw[], total, page, pages }`. |
| GET    | `/draws/recent` | Highlight list for home/winners sections. Accepts `limit` (defaults to 6).                                                        |
| GET    | `/draws/:id`    | Detailed draw view (future-proofing).                                                                                             |

Each `Draw` object should mirror `src/types/winner.types.ts` (`_id`, `competitionId`, `competitionTitle`, `winnerId`, `winnerName`, `winnerLocation`, `totalTickets`, `winningTicketNumber`, `drawDate`, `imageUrl`, `isActive`). When possible, embed the first competition image for richer cards.

### 3.4 Reviews & Stats

- Provide `GET /reviews?page=&limit=` returning Trustpilot-style entries.
- Provide `GET /stats/site` returning aggregated numbers (champions, prizeTotal, donations, followers). Use same structure as `homeData.stats`.

### 3.5 Static Pages (`HowItWorks`, `About`, `Contact`)

- Currently static content; optional to add CMS endpoints for long-term flexibility (`GET /content/pages/:slug`).

### 3.6 Legal, Support & FAQ Content

The newly implemented pages (`/terms`, `/terms-of-use`, `/acceptable-use`, `/privacy`, `/complaints`, `/faq`) consume structured content via the content service.

**Endpoints**

| Method | Path                   | Description                                                                                                                                                                                                                                                                                                                                                        |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/content/pages/:slug` | Returns a legal/support page. Slugs in use: `terms-and-conditions`, `terms-of-use`, `acceptable-use`, `privacy-policy`, `complaints-procedure`, `how-it-works` (optional future). Shape defined by `LegalPageContent` (`slug`, `title`, `subtitle`, `updatedAt`, `sections[]`). Each section contains `heading`, `body[]`, and optional `list { title, items[] }`. |
| GET    | `/content/faqs`        | Returns `{ faqs: FAQItem[] }` matching `FAQ.tsx`. Fields: `id`, `question`, `answer`, optional `category`. Allow filtering by category via `?category=` when backend is ready.                                                                                                                                                                                     |

Responses should populate `updatedAt` (ISO string) for display and allow the frontend to render loading states or fallbacks when a page is missing.

---

## 4. Cart, Checkout & Payments (Stripe)

Frontend store (`src/store/useCartStore.ts`) handles cart locally but will transition to server-backed flow for Stripe (`src/pages/Cart/Cart.tsx`, `src/pages/Checkout/Checkout.tsx` placeholder).

### 4.1 Cart Synchronisation

Recommended endpoints to support multi-device persistence:

| Method | Path                  | Auth | Description                                    |
| ------ | --------------------- | ---- | ---------------------------------------------- |
| GET    | `/cart`               | ✅   | Returns current cart for user (items, totals)  |
| POST   | `/cart/items`         | ✅   | Add/update item: `{ competitionId, quantity }` |
| PATCH  | `/cart/items/:itemId` | ✅   | Update quantity                                |
| DELETE | `/cart/items/:itemId` | ✅   | Remove item                                    |
| DELETE | `/cart`               | ✅   | Clear cart                                     |

Payload shape should mirror `Cart` interfaces (`src/types/cart.types.ts`).

When adding an item, fetch live `ticketPrice`, ensure availability (`remainingTickets >= quantity`), and cap quantity to business rules.

### 4.2 Checkout with Stripe

1. **Create Payment Intent**

   - `POST /checkout/payment-intent`
   - Body:
     ```json
     {
       "items": [
         { "competitionId": "comp_123", "quantity": 5 }
       ],
       "billingDetails": { ... } // see `BillingDetails` in `src/types/payment.types.ts`
     }
     ```
   - Validate cart server-side (prices, availability, entry limits).
   - Respond with `{ clientSecret, amount, currency }`.

2. **Confirm Order**

   - `POST /checkout/confirm`
   - Body:
     ```json
     {
       "paymentIntentId": "pi_123",
       "orderId": "optional if pre-created",
       "billingDetails": { ... },
       "shippingAddress": { ... } // optional
     }
     ```
   - On success:
     - Persist order and individual `CompetitionEntry` tickets.
     - Clear server cart.
     - Return order summary.

3. **Stripe Webhook**

   - `POST /webhooks/stripe`
   - Handle `payment_intent.succeeded`, `payment_intent.payment_failed`, etc.
   - Verify signature; update order/payment status (map to `PaymentStatus` in `src/types/order.types.ts`).

4. **Order Retrieval**
   - `GET /orders` (self) – paginated order history for profile page.
   - `GET /orders/:id`
   - `GET /users/:id/orders` (admin).

**Middleware**

- Ensure idempotency (Stripe `Idempotency-Key` header).
- `requireAuth` for checkout endpoints.

---

## 5. Competition Entries & Tickets

Ticket handling underpins availability indicators and profile stats (`Profile.tsx`).

**Endpoints**

- `GET /competitions/:id/entries` (admin only) – for oversight, optionally filter by `userId`.
- `POST /competitions/:id/entries/validate-answer`
  - Body: `{ answer: "Computers" }`
  - Returns `{ isCorrect: boolean }`
  - Allows front-end to confirm skill-question answer before enabling payment.
- `GET /users/me/entries` – list of entries for profile stats (fields: `competitionTitle`, `quantity`, `status`, `createdAt`).

**Data Model Notes**

- `CompetitionEntry` interface defined in `src/types/competition.types.ts`.
- Keep track of `ticketNumber`, `isCorrect`, `answeredQuestion`.

---

## 6. Admin Area APIs

### 6.1 Competitions CRUD

The admin competitions page (`Competitions.tsx`, `CompetitionForm.tsx`) currently uses mock store actions (`useAdminStore`). Replace with API calls:

| Method | Path                             | Auth           | Description                                        |
| ------ | -------------------------------- | -------------- | -------------------------------------------------- |
| GET    | `/admin/competitions`            | ✅ admin       | Same filters as public but includes inactive/ended |
| POST   | `/admin/competitions`            | ✅ admin       | Create competition                                 |
| GET    | `/admin/competitions/:id`        | ✅ admin       | Retrieve full editable payload                     |
| PUT    | `/admin/competitions/:id`        | ✅ admin       | Update                                             |
| PATCH  | `/admin/competitions/:id/status` | ✅ admin       | Change status (upcoming → active, etc.)            |
| DELETE | `/admin/competitions/:id`        | ✅ super admin | Soft delete                                        |

**Payload Structure**

- Match `Competition` type plus admin-only fields (`cashAlternative`, `specifications[]`, `answerOptions[]`).
- Include audit metadata (`createdBy`, `updatedBy`).
- Accept arrays for `images` and allow reordering.

### 6.2 Draws Management

`src/pages/Admin/Draws/Draws.tsx` and `DrawModal.tsx` rely on mock data but UI expects:

- `winnerName`, `winnerLocation`, `winningTicketNumber`, `totalTickets`, `drawDate`, `image`.

**Endpoints**

- `GET /admin/draws?page=&limit=&search=&competitionId=&winnerId=`
- `POST /admin/draws`
  ```json
  {
    "competitionId": "comp_123",
    "winnerId": "user_456",
    "winnerName": "John Doe",
    "winnerLocation": "London",
    "totalTickets": 50000,
    "winningTicketNumber": 12345,
    "drawDate": "2025-10-28T22:30:00Z",
    "imageUrl": "https://..."
  }
  ```
- `PUT /admin/draws/:id`
- `DELETE /admin/draws/:id`

Also expose public read routes:

- `GET /draws` (non-admin) – automatically filters `isActive=true`.
- `GET /draws/:id`
- `GET /draws/recent?limit=` – already used by `adminService.getRecentDraws`.

### 6.3 Champions Management

`src/pages/Admin/Champions/Champions.tsx` + `ChampionModal.tsx` call `adminService` (real API client). Implement the endpoints the service expects:

| Method | Path                                        | Payload                                                                                         |
| ------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | `/champions?page=&limit=&featured=&search=` | Returns `{ champions, total, page, pages }`                                                     |
| GET    | `/champions/featured`                       | Public list                                                                                     |
| GET    | `/champions/:id`                            | Detailed champion                                                                               |
| POST   | `/champions`                                | `multipart/form-data` with fields: `drawId`, `testimonial`, `prizeValue?`, `featured?`, `image` |
| PUT    | `/champions/:id`                            | `multipart/form-data` (image optional)                                                          |
| DELETE | `/champions/:id`                            | Soft delete / deactivate                                                                        |

Remember to include:

- `image: { url, publicId }`
- `winnerName`, `winnerLocation`, `prizeName`, `prizeValue`, `isActive`, `featured`

### 6.4 Users Dashboard

`src/pages/Admin/Users/Users.tsx` is a placeholder, but plan endpoints for when UI is built:

- `GET /admin/users?page=&search=&role=&status=`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id` (role changes, activation)
- `GET /admin/users/:id/orders`, `/entries`, `/activity`

### 6.5 Admin Dashboard Metrics

`src/pages/Admin/Dashboard/Dashboard.tsx` displays counts and revenue. Provide:

- `GET /admin/dashboard/summary`
  ```json
  {
    "competitions": { "total": 120, "active": 18 },
    "draws": { "total": 450 },
    "champions": { "total": 320, "featured": 24 },
    "users": { "total": 21000 },
    "revenue": { "total": 1234567.89, "currency": "GBP" },
    "recentActivity": [
      {
        "type": "draw_created",
        "description": "New draw created",
        "data": { "prizeName": "...", "winnerName": "..." },
        "timestamp": "2025-10-28T22:30:00Z"
      }
    ]
  }
  ```
- Use caching/aggregation to avoid heavy DB hits on each load.

---

## 7. Reviews, CMS & Marketing Data

- `GET /reviews` – returns rating, reviewer, body (for carousel).
- `POST /reviews` – optional if collecting testimonials.
- `GET /cms/sections/:key` – for hero copy, FAQs, etc.

Ensure reviews support `verified` flag (as in `homeData.reviews`).

---

## 8. Middleware & Infrastructure

1. **CORS** – Allow frontend origin, credentials enabled.
2. **Rate Limiting** – Protect auth & checkout endpoints (`/auth/*`, `/checkout/*`).
3. **Input Sanitisation** – Prevent XSS/HTML injection (especially for testimonials).
4. **File Storage** – Champions images stored in S3/Cloudinary; persist `publicId` for deletion.
5. **Audit Logging** – Track admin actions (competition edits, draw creation).
6. **Notification Hooks** – After draw creation, optionally trigger winner emails/push.
7. **Data Consistency**
   - Wrap competition updates + ticket creation in transactions.
   - When an order is created, decrement `soldTickets` atomically to avoid overselling.
8. **Caching**
   - Use server-side cache for home aggregates & stats.
   - Bust caches when competitions/draws/champions are updated.

---

## 9. Suggested Data Model (High Level)

| Table                 | Key Fields                                                                                                                                                                                                                                                   | Notes                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `users`               | `_id`, `firstName`, `lastName`, `email`, `role`, `isVerified`, `isActive`, `subscribedToNewsletter`, timestamps                                                                                                                                              | Align with `User` interface                                                       |
| `competitions`        | `id`, `title`, `description`, `shortDescription`, `prize`, `prizeValue`, `cashAlternative`, `ticketPrice`, `maxTickets`, `soldTickets`, `status`, `category`, date fields, `featured`, `question`, `answerOptions`, `correctAnswer` (restricted), `images[]` | `soldTickets` can be derived from entries but keep denormalized for quick display |
| `competition_images`  | `competitionId`, `url`, `order`                                                                                                                                                                                                                              | Optional if storing separately                                                    |
| `competition_entries` | `id`, `competitionId`, `userId`, `ticketNumber`, `quantity`, `answer`, `isCorrect`, timestamps                                                                                                                                                               | Use `ticketNumber` sequences                                                      |
| `orders`              | `id`, `userId`, `subtotal`, `total`, `status`, `paymentStatus`, `paymentMethod`, `billingAddress`, `shippingAddress`, `notes`, timestamps                                                                                                                    | Map to `Order` type                                                               |
| `order_items`         | `orderId`, `competitionId`, `quantity`, `price`, `total`                                                                                                                                                                                                     |                                                                                   |
| `draws`               | `_id`, `competitionId`, `winnerId`, `winnerName`, `winnerLocation`, `drawDate`, `winningTicketNumber`, `totalTickets`, `imageUrl`, `isActive`, timestamps                                                                                                    |                                                                                   |
| `champions`           | `_id`, `drawId`, `competitionId`, `winnerId`, `winnerName`, `winnerLocation`, `prizeName`, `prizeValue`, `testimonial`, `imageUrl`, `imagePublicId`, `featured`, `isActive`, timestamps                                                                      |                                                                                   |
| `reviews`             | `id`, `title`, `body`, `rating`, `reviewer`, `verified`, `publishedAt`                                                                                                                                                                                       |                                                                                   |
| `site_stats`          | `key`, `value`, `updatedAt`                                                                                                                                                                                                                                  | For aggregated counters                                                           |

---

## 10. Transition Plan

1. **Implement Auth & Profile** – Already live; verify cookie handling and refresh logic.
2. **Competitions & Public Data**
   - Build `/competitions` endpoints first.
   - Update frontend stores (`useCompetitionStore`) to hydrate from API.
3. **Admin Competitions**
   - Replace `useAdminStore` with server requests.
   - Build forms to call API after CRUD endpoints ready.
4. **Draws & Champions**
   - Implement admin endpoints -> connect `adminService`.
   - Expose public `draws/recent` & `champions/featured`.
5. **Cart & Checkout**
   - Add cart endpoints.
   - Build Stripe payment intent + webhook.
   - Flesh out `Checkout.tsx` with Stripe Elements once backend ready.
6. **Orders & Profile Stats**
   - Provide `/users/me/orders`, `/users/me/entries`.
   - Update profile page to use live stats instead of mocks.
7. **Dashboard Metrics**
   - Create summary endpoint for admin landing page.
8. **Content & Reviews**
   - Backfill home stats, reviews from DB/CMS.

---

## 11. Testing & Monitoring Checklist

- Unit tests for validation, auth guards, service logic.
- Integration tests covering:
  - Competition lifecycle (create, update, publish, delete).
  - Draw creation tied to existing competitions and winners.
  - Champion creation with image upload.
  - Checkout success / failure flow with Stripe (use test keys).
- Contract tests (OpenAPI/Swagger) to keep frontend types in sync.
- Observability: log structured JSON for each request, monitor payment failures, send alerts on webhook errors.

---

## 12. Appendix: Example Payloads

### Competition (Admin)

```json
{
  "title": "£500 ASOS Voucher",
  "shortDescription": "Refresh your wardrobe with a £500 ASOS voucher!",
  "description": "...",
  "prize": "£500 ASOS Voucher",
  "prizeValue": 50000,
  "cashAlternative": 45000,
  "ticketPrice": 299,
  "maxTickets": 50000,
  "soldTickets": 12543,
  "status": "active",
  "category": "cash",
  "featured": true,
  "question": "What do Dell manufacture?",
  "answerOptions": ["Computers", "Lawn Mowers", "Swimming Pools"],
  "correctAnswer": "Computers",
  "images": [
    "https://cdn.example.com/competitions/asos-1.jpg",
    "https://cdn.example.com/competitions/asos-2.jpg"
  ],
  "startDate": "2025-10-01T00:00:00Z",
  "endDate": "2025-11-17T23:59:59Z",
  "drawDate": "2025-11-18T22:30:00Z"
}
```

### Legal Content Response

```json
{
  "page": {
    "slug": "terms-and-conditions",
    "title": "Terms & Conditions",
    "subtitle": "Please read these terms carefully before participating...",
    "updatedAt": "2025-10-01T12:00:00Z",
    "sections": [
      {
        "heading": "Eligibility",
        "body": [
          "DJ Giveaways is open to residents of the United Kingdom and Ireland aged 18+.",
          "We reserve the right to request proof of age at any time."
        ],
        "list": {
          "title": "Ineligible participants include:",
          "items": [
            "Employees of DJ Giveaways.",
            "Immediate family members living in the same household."
          ]
        }
      }
    ]
  }
}
```

### FAQ Response

```json
{
  "faqs": [
    {
      "id": "faq-1",
      "category": "General",
      "question": "How do I enter a competition?",
      "answer": "Select your competition, answer the qualifying question, choose ticket quantity, and complete checkout."
    },
    {
      "id": "faq-2",
      "category": "Draws",
      "question": "How are winners selected?",
      "answer": "We use independent random draw software and broadcast every draw live."
    }
  ]
}
```

### Champion (Response)

```json
{
  "_id": "champ_001",
  "drawId": "draw_123",
  "competitionId": "comp_456",
  "winnerId": "user_789",
  "winnerName": "Darren Compton",
  "winnerLocation": "Dungannon",
  "prizeName": "Volvo XC40 D4 R-Design Pro",
  "prizeValue": "£15,000",
  "testimonial": "Getting the call ...",
  "image": {
    "url": "https://cdn.example.com/champions/champ_001.jpg",
    "publicId": "champions/champ_001"
  },
  "featured": true,
  "isActive": true,
  "createdAt": "2025-10-30T21:15:00Z",
  "updatedAt": "2025-10-30T21:15:00Z"
}
```

### Checkout Confirmation Response

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "userId": "user_abc",
      "items": [
        {
          "id": "orderItem_1",
          "competitionId": "comp_456",
          "competitionTitle": "£500 ASOS Voucher",
          "quantity": 5,
          "price": 299,
          "total": 1495
        }
      ],
      "subtotal": 1495,
      "total": 1495,
      "status": "confirmed",
      "paymentStatus": "paid",
      "paymentMethod": "card",
      "billingAddress": { "...": "..." },
      "createdAt": "2025-11-09T12:00:00Z"
    },
    "entries": [
      {
        "id": "entry_1",
        "competitionId": "comp_456",
        "ticketNumbers": [10370, 10371, 10372, 10373, 10374],
        "answer": "Computers",
        "isCorrect": true,
        "createdAt": "2025-11-09T12:00:00Z"
      }
    ]
  }
}
```

---

Implementing the endpoints above will allow us to remove all mock stores and JSON fixtures, unlock the admin workflows, and deliver a Stripe-ready checkout experience with consistent middleware and security coverage.
