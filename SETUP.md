# AR Menu — Local Development Setup

This guide takes you from a fresh machine to a running app. Follow it top to bottom.

---

## What you're starting

Two apps that run at the same time:

| App | Folder | Runs on | What it is |
|-----|--------|---------|------------|
| Frontend | `src/` | http://localhost:3000 | The Next.js website customers see |
| Backend | `backend/` | http://localhost:4000 | The Express API + database access |

They talk to each other over HTTP. You need **both running** for the menu pages to work.

---

## Step 1 — Install the tools (one time)

You need three things installed on your machine:

1. **Node.js** (v20 or newer) — check with: `node --version`
2. **PostgreSQL** (v14 or newer) — check with: `psql --version`
3. **Git** — check with: `git --version`

If PostgreSQL isn't installed:
- **Mac:** `brew install postgresql@16` then `brew services start postgresql@16`
- **Ubuntu/Debian:** `sudo apt install postgresql`
- **Windows:** download the installer from postgresql.org

---

## Step 2 — Install project dependencies (one time)

From the project root (`ar-menu/`):

```bash
npm install
npm install --workspace=backend
```

This installs both the frontend and backend packages.

---

## Step 3 — Create the database (one time)

Create an empty database called `ar_menu`:

```bash
createdb ar_menu
```

> If `createdb` asks for a password or errors, your Postgres user may differ.
> On Linux you often need: `sudo -u postgres createdb ar_menu`

Now create the tables inside it:

```bash
psql -d ar_menu -f backend/src/db/schema.sql
```

Load the demo data (a test restaurant + 3 dishes) so you can see it working:

```bash
psql -d ar_menu -f backend/src/db/seed.sql
```

**Verify the database works** — list the demo restaurant:

```bash
psql -d ar_menu -c "SELECT name, slug FROM restaurants;"
```

You should see:
```
    name     | slug
-------------+------
 Demo Bistro | demo
```

---

## Step 4 — Set up the backend environment variables (one time)

The backend needs secrets. Copy the example file:

```bash
cp backend/.env.example backend/.env
```

Now open `backend/.env` and fill in two things:

**A) Your database connection.** The format is:
```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ar_menu
```
- Replace `USER` with your Postgres username (often `postgres` or your computer username)
- Replace `PASSWORD` with your Postgres password (may be empty on a fresh Mac install — then use `postgresql://yourname@localhost:5432/ar_menu`)

**B) Two JWT secrets.** Generate them by running this command twice:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Paste the first result into `JWT_SECRET=` and the second into `JWT_REFRESH_SECRET=`.

---

## Step 5 — Set up the frontend environment (one time)

This is already created for you at `.env.local` in the root. It contains:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

This tells the frontend where the backend lives. No changes needed for local dev.

---

## Step 6 — Run it

Open **two terminal windows** (or use the combined command below).

**Terminal 1 — backend:**
```bash
npm run dev:backend
```
You should see:
```
✅ Database connected
🚀 Backend running on http://localhost:4000
```

**Terminal 2 — frontend:**
```bash
npm run dev:frontend
```
You should see Next.js start on port 3000.

> Shortcut: `npm run dev` runs both at once in a single terminal.

---

## Step 7 — Confirm everything works

**A) Backend health check** — open in browser or run:
```bash
curl http://localhost:4000/health
```
Expect: `{"status":"ok","timestamp":"..."}`

**B) Backend returns the demo menu:**
```bash
curl http://localhost:4000/api/v1/restaurants/slug/demo
```
Expect JSON with `"name":"Demo Bistro"`.

**C) The actual menu page** — open in your browser:
```
http://localhost:3000/menu/demo
```
You should see the Demo Bistro menu with 3 dishes and "View in 3D" buttons. 🎉

---

## Step 8 — Create your admin account

To manage real restaurants you need an admin login. Create one:

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@wetrends.com","password":"yourpassword123"}'
```

This returns an `accessToken`. Use it to create a real restaurant:

```bash
curl -X POST http://localhost:4000/api/v1/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_ACCESS_TOKEN_HERE" \
  -d '{"name":"Joes Pizza"}'
```

Then visit `http://localhost:3000/menu/joes-pizza`.

---

## Daily workflow (after first-time setup)

Every time you sit down to work, you only need:

```bash
npm run dev
```

That's it. The database keeps your data between sessions.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend: "Invalid environment variables" | A value in `backend/.env` is missing or too short. JWT secrets must be 32+ chars. |
| Backend: "Database connected" never appears | Postgres isn't running, or `DATABASE_URL` is wrong. |
| Menu page says "Menu not found" | Backend isn't running, or the slug doesn't exist in the database. |
| `createdb: command not found` | Postgres isn't installed or not in your PATH. |
| Frontend can't reach backend | Make sure backend is on :4000 and `.env.local` points to it. |
