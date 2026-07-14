# BizTracker — Business Expense & Profit Tracker

A clean, modern web app for two business partners to track sales, expenses,
stock, investments, withdrawals, and profit — with an auto-calculated
dashboard and daily/monthly/yearly reports.

## Tech Stack
- **Frontend:** Next.js (App Router) + TypeScript + Material UI + Recharts + Axios
- **Backend:** Node.js + Express.js + TiDB (MySQL-compatible, via Sequelize ORM)

## Folder Structure

```
expense-tracker/
├── backend/
│   ├── config/db.js              # Sequelize (MySQL) connection
│   ├── models/                   # Product, Sale, Expense, Investment, Withdraw + associations
│   ├── controllers/              # Business logic per module
│   ├── routes/                   # Express route definitions
│   ├── middleware/                # asyncHandler, errorHandler
│   └── server.js                 # App entry point
│
└── frontend/
    └── src/
        ├── app/                  # Next.js pages (dashboard, products, sales, ...)
        ├── components/
        │   ├── layout/           # Sidebar, Topbar, DashboardLayout
        │   ├── common/           # StatCard, ConfirmDialog
        │   └── <module>/         # Form dialogs per module
        ├── lib/
        │   ├── api.ts            # Axios instance
        │   ├── format.ts         # Currency/date formatting
        │   └── services/         # One file per module's API calls
        ├── theme/                # MUI theme + dark mode provider
        └── types/                # Shared TypeScript interfaces
```

## How Profit & Cash Balance Are Calculated

- **Net Profit** = Total Sales − Total Expenses
- **Cash Balance** = Total Investment + Total Sales − Total Withdraw − Total Expenses

Both are computed live in `backend/controllers/dashboardController.js` using
SQL `SUM()` aggregation over the Sale/Expense/Investment/Withdraw tables —
there's no separate "balance" column to keep in sync, so the numbers can
never drift.

Sale creation and deletion are wrapped in a MySQL transaction
(`sequelize.transaction`) together with the product stock update, so a
sale row and its stock adjustment always succeed or fail together.

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in your TiDB connection details (see below)
npm run dev                # starts on http://localhost:5000
```

The first time it runs, Sequelize automatically creates the `products`,
`sales`, `expenses`, `investments`, and `withdraws` tables (via
`sequelize.sync({ alter: true })` in `config/db.js`) — no manual
schema/migration step needed to get started.

#### Option A — TiDB Cloud Serverless (free, recommended)
1. Create a free cluster at [tidbcloud.com](https://tidbcloud.com) (Serverless tier)
2. On the cluster's overview page, click **Connect** → keep endpoint type **Public**
3. Copy the host, port (`4000`), username (looks like `xxxxxxxx.root`), and password into `.env`
4. Set `TIDB_ENABLE_SSL=true` — this is **required** for the public endpoint
5. Create the database once, either through the TiDB Cloud SQL editor or the `mysql` CLI:
   ```sql
   CREATE DATABASE expense_tracker;
   ```

#### Option B — Local TiDB or MySQL
- Local TiDB via [TiUP playground](https://docs.pingcap.com/tidb/stable/quick-start-with-tidb): `tiup playground`, then point `DB_HOST=127.0.0.1`, `DB_PORT=4000`
- Or a plain local MySQL server: `DB_PORT=3306`
- Either way, leave `TIDB_ENABLE_SSL=false`

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                # starts on http://localhost:3000
```

## What's Included
- Full CRUD for Products, Sales, Expenses, Investments, Withdraws
- Sale creation auto-decrements product stock; deleting a sale restores it
- Low stock badge on the Products table
- Dashboard with 6 auto-calculated stat cards + a sales-vs-expenses chart
- Reports page with Daily / Monthly / Yearly / Custom date filtering
- Dark mode toggle (persisted in localStorage)
- Responsive sidebar layout

## Suggested Next Steps
- Add authentication (JWT) so each partner logs in separately
- Add a dedicated "weekly breakdown" endpoint for a richer dashboard chart
- Add PDF/Excel export on the Reports page
- Add partner-specific profit share (e.g. 50/50 or 60/40) calculations
