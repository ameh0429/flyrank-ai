# Task API ai-version

A simple, in-memory Task CRUD API built with **Node.js**, **Express**, and **ESM
modules**. It lets you list, create, update, and delete tasks over a small
REST interface, and ships with interactive **Swagger UI** documentation.

Everything lives in a single file, `index.js`, for simplicity — there's no
database, so data resets whenever the server restarts.

## Install & Run

```bash
npm install && npm start
```

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
├── index.js        # Express server, routes, and in-memory data (ESM)
├── openapi.json     # OpenAPI 3.0 spec powering Swagger UI at /docs
├── package.json
└── README.md
```