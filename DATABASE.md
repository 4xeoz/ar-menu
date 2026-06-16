# PostgreSQL — Local Setup & Survival Guide

Everything you need to create, inspect, and test a local Postgres database from scratch.

---

## 1. The mental model

PostgreSQL is a **server** that runs in the background. You talk to it with a **client**.

| Term | What it is |
|------|-----------|
| **Server (postgres)** | The always-running process that stores your data |
| **`psql`** | The command-line client you type SQL into |
| **Role / User** | A login. On Mac, your default role = your Mac username |
| **Database** | A named container of tables (e.g. `ar_menu`) |
| **Table** | The actual rows of data (e.g. `restaurants`) |

One server → many databases → each has many tables.

---

## 2. Install & start the server (one time per machine)

**Mac (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16     # starts it now + on every reboot
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install postgresql
sudo service postgresql start
```

**Check it's running:**
```bash
pg_isready
# → "/tmp:5432 - accepting connections"  ✅
```

---

## 3. Who am I? (the role question)

This is the #1 source of "role does not exist" errors.

```bash
whoami          # your Mac username — this is your Postgres superuser on Mac
psql -l         # list all databases + who owns them
```

On Mac, connect with **your username, no password**:
```
postgresql://YOUR_USERNAME@localhost:5432/DB_NAME
```

If you ever WANT a classic `postgres` user (e.g. to match a teammate's setup):
```bash
createuser -s postgres                                   # -s = superuser
psql -d postgres -c "ALTER USER postgres WITH PASSWORD 'password';"
```

---

## 4. Create a database from scratch

```bash
createdb my_app_db                    # create
dropdb my_app_db                      # delete (careful!)
createdb my_app_db                    # recreate fresh
```

Or from inside psql:
```sql
CREATE DATABASE my_app_db;
DROP DATABASE my_app_db;
```

---

## 5. Load your schema and data

```bash
# Run a .sql file against a database
psql -d my_app_db -f path/to/schema.sql
psql -d my_app_db -f path/to/seed.sql
```

`IF NOT EXISTS` in the schema means re-running it is safe — it skips
things that already exist instead of erroring. Those `NOTICE: ... skipping`
messages are normal, not errors.

---

## 6. Inspect & test — the commands you'll use daily

**Connect to a database interactively:**
```bash
psql -d my_app_db
```

Once inside, these backslash commands are your toolkit:

| Command | What it shows |
|---------|--------------|
| `\l` | list all databases |
| `\dt` | list all tables in current DB |
| `\d restaurants` | show columns/types of a table |
| `\du` | list all roles/users |
| `\dn` | list schemas |
| `\x` | toggle pretty vertical output (great for wide rows) |
| `\q` | quit |

**Run a quick query without opening psql (one-liners):**
```bash
psql -d my_app_db -c "SELECT name, slug FROM restaurants;"
psql -d my_app_db -c "SELECT COUNT(*) FROM menu_items;"
```

**Check a specific table has data:**
```bash
psql -d ar_menu -c "SELECT * FROM menu_items LIMIT 5;"
```

---

## 7. Common errors & instant fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `role "postgres" does not exist` | Mac has no `postgres` role | Use `whoami` username in the connection URL |
| `database "x" does not exist` | DB not created | `createdb x` |
| `connection refused` / `pg_isready` fails | Server not running | `brew services start postgresql@16` |
| `password authentication failed` | Wrong password in URL | On Mac local, drop the password entirely |
| `relation "x" already exists` | Table already created | Harmless — `IF NOT EXISTS` skipped it |
| `permission denied for table` | Role lacks rights | Connect as superuser (`whoami` on Mac) |

---

## 8. The full from-scratch sequence (copy/paste template)

```bash
# 1. Make sure the server runs
pg_isready || brew services start postgresql@16

# 2. Create a fresh database
createdb ar_menu

# 3. Build the tables + load demo data
psql -d ar_menu -f backend/src/db/schema.sql
psql -d ar_menu -f backend/src/db/seed.sql

# 4. Verify it worked
psql -d ar_menu -c "SELECT name, slug FROM restaurants;"

# 5. Point your app at it (backend/.env)
#    DATABASE_URL=postgresql://YOUR_USERNAME@127.0.0.1:5432/ar_menu
```

---

## 9. Resetting when things get messy

When your local data is broken and you just want a clean slate:

```bash
dropdb ar_menu                                      # delete everything
createdb ar_menu                                    # fresh empty DB
psql -d ar_menu -f backend/src/db/schema.sql        # rebuild tables
psql -d ar_menu -f backend/src/db/seed.sql          # reload demo data
```

This is safe and fast in development. **Never** `dropdb` in production.

---

## 10. A GUI, if you prefer clicking over typing

- **TablePlus** (Mac, free tier) — clean, fast
- **pgAdmin** (free, all platforms) — official, heavier
- **Postico** (Mac) — simple

Connect with: host `localhost`, port `5432`, user `YOUR_USERNAME`, database `ar_menu`, no password.
