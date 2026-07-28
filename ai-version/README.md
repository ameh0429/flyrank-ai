# Task API ai-version

A Task CRUD API built with **Node.js**, **Express**, and **ESM modules**,
backed by **PostgreSQL** through the **Sequelize** ORM. It lets you list,
create, update, and delete tasks over a small REST interface, and ships
with interactive **Swagger UI** documentation.
 
This replaces the earlier in-memory version: data now lives in a real
Postgres `tasks` table and survives server restarts.

## Install & Run

```bash
npm install && npm start
```

## Environment variables
 
Sequelize is configured entirely from environment variables in
`src/db.js` — no credentials are hardcoded. Copy `.env.example` to `.env`
and fill in your own values:
 
```
DB_NAME=task_api_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_LOGGING=false
PORT=3000
```
 
`dotenv` loads `.env` automatically when the app starts. In production
(e.g. a hosted Postgres add-on on Render, Railway, or Heroku), set these
same variables in your platform's environment configuration instead of
committing a `.env` file — `.env` should stay out of version control.

### Automatic table creation
 
`src/models/Task.js` defines the `Task` model, and `index.js` calls
`await sequelize.sync()` on startup, which creates the `tasks` table
automatically if it's missing. This is convenient for development; for a
production deployment, consider switching to
[Sequelize migrations](https://sequelize.org/docs/v6/other-topics/migrations/)
so schema changes are tracked and reversible instead of relying on `sync()`.

The server starts on **http://localhost:3001**, and the interactive API
docs are served at **http://localhost:3001/docs**.

## Endpoints

| Method | Path          | Description                              | Success Response      | Error Responses                          |
|--------|---------------|-------------------------------------------|------------------------|-------------------------------------------|
| GET    | `/`           | API metadata (name, version, endpoints)   | `200 OK`               | —                                          |
| GET    | `/health`     | Health check                              | `200 OK`               | —                                          |
| GET    | `/tasks`      | List all tasks                            | `200 OK`               | —                                          |
| GET    | `/tasks/:id`  | Get a single task by id                   | `200 OK`               | `404 Not Found`                            |
| POST   | `/tasks`      | Create a task (`{ "title": "..." }`)      | `201 Created`          | `400 Bad Request` (missing/empty title)    |
| PUT    | `/tasks/:id`  | Update `title` and/or `done`              | `200 OK`               | `400 Bad Request`, `404 Not Found`         |
| DELETE | `/tasks/:id`  | Delete a task                             | `204 No Content`       | `404 Not Found`                            |

### Task shape

```json
{ "id": 1, "title": "Buy milk", "done": false }
```

## Example: `curl -i`

```
$ curl -i http://localhost:3001/tasks/1

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-1r+vKTXuFONDsJRkqIqfagr/DLc"
Date: Mon, 20 Jul 2026 13:18:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"title":"Buy oat milk","done":true}
```

## Swagger UI

Once the server is running, open **http://localhost:3001/docs** in your
browser. You'll see all five task endpoints (`GET /tasks`, `GET /tasks/{id}`,
`POST /tasks`, `PUT /tasks/{id}`, `DELETE /tasks/{id}`) plus `/` and
`/health`. Use the **"Try it out"** button on any endpoint to send real
requests against the running server — you can create, list, update, and
delete tasks entirely from the docs page.

![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/ipi6buywrx3ia7zkcrtw.png)

## Project structure

```
task-api/
├── index.js              # Express app, routes, server startup
├── src/
│   ├── db.js              # Sequelize connection (reads env vars)
│   └── models/
│       └── Task.js        # Sequelize Task model
├── openapi.json           # OpenAPI 3.0 spec powering Swagger UI at /docs
├── .env.example            # Template for DB credentials
├── package.json
└── README.md
```