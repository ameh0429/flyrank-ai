# Task API. Self-Version

A simple task‑tracking API powered by **Node.js**, **Express**, and **PostgreSQL**, containerized with **Docker Compose**.
Run the entire stack with one command — no manual setup required.

---

## Installation & Run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd hello-server

# 2. Install dependencies
npm install

# 3. Start the server
node app.js
```
- Server runs at:
http://localhost:3000  
- Swagger UI at:
http://localhost:3000/docs

## Endpoints Table
| Method | Endpoint | Description | Status Codes |
| --- | --- | --- | --- |
| POST | ``/auth/signup`` | Register a new user | 200 |
| POST | ``/auth/login`` | Authenticate user and return tokens | 200 |
| POST | ``/auth/logout`` | End user session | 200 |
| GET | ``/tasks`` | List all tasks | 200 |
| GET | ``/tasks/{id}`` | Get a single task by ID | 200, 404 |
| POST | ``/tasks`` | Create a new task | 201, 400 |
| PUT | ``/tasks/{id}`` | Update a task | 200, 400, 404 |
| DELETE | ``/tasks/{id}`` | Delete a task | 204, 404 |


## API Reference Table
| Endpoint | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/auth/signup` | POST | Register a new user | ❌
| `/auth/login` | POST | Authenticate user and return tokens | ❌
| `/auth/logout` | POST | End user session | ✅
| `/protected/profile` | GET | Get authenticated user profile | ✅
| `/tasks` | GET | List all tasks | ❌
| `/tasks` | POST | Create a new task | ❌
| `/tasks/{id}` | GET | Get a single task | ❌
| `/tasks/{id}` | PUT | Update a task | ❌
| `/tasks/{id}` | DELETE | Delete a task | ❌

✅ = Requires Bearer token in Authorization header
❌ = Public endpoint

## Example curl -i Output
```bash
curl -i http://localhost:3000/tasks
```
```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 123

[
  { "id": 1, "title": "Read a bible", "done": false },
  { "id": 2, "title": "Build an app", "done": true },
  { "id": 3, "title": "Go for lecture", "done": false }
]
```

## Swagger UI Screenshot

![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/xw50ll5p4owo2202ntrj.png)

## Notes
- Uses Express ESM syntax ("type": "module" in package.json).
- In-memory task list (no database).
- Fully documented with OpenAPI 3.0 spec served via swagger-ui-express.

## Docker Implementation
### QuickStart

```
docker compose up

```
This command builds and starts both the API and Postgres services.

### Environment Variables
Copy `.env.example` to .env` `and set:

```
DATABASE_URL=postgres://postgres:dev@db:5432/tasks
PORT=3000
```

### Database Verification
After running `docker compose up`, connect to Postgres:

```
docker exec -it self-version-db-1 psql -U postgres -d tasks

```
Then check your data:

```
\dt
SELECT * FROM "Tasks";
```
   
## Comparing AI Code with My Code

- What did the AI do better — and do you understand its version well enough to explain it? The AI generated the code with better error handling with a detailed documentation. 
- What did it get wrong or quietly ignore from your prompt? - The AI did not ignore anything or got anything wrong from my prompt.
- What did your prompt forget to specify — My prompt did not forget any details. I described the complete details of the project in my prompt.

## Why I Did Not Use SQLite
I initially planned to use SQLite (via better‑sqlite3) because it’s simple, lightweight, and requires no external server. However, on my Windows 10 system, the installation failed with a native C++ compilation error.

better‑sqlite3 depends on node‑gyp and Visual Studio Build Tools to compile its bindings. My setup lacked the required “Desktop development with C++” workload, and Node 22 no longer supports older Visual Studio versions. As a result, the module couldn’t build successfully — even after verifying Python and Node‑gyp versions.

## Why I Chose Postgres +` Sequelize`
To avoid native compilation issues and gain a more scalable setup, I switched to PostgreSQL with `Sequelize ORM`.
This choice offers several advantages:
- No native compilation — `Sequelize` uses pure JavaScript drivers (pg and pg‑hstore).
- Cross‑platform reliability — works seamlessly on Windows without extra build tools.
- Automatic table creation and seeding — the app initializes the database automatically on startup.

The server connects to Postgres, creates the Tasks table, and seeds three example tasks — no manual setup required.

## DB Screenshot

![Image description](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/3sp9buebz7468h9capla.png)


