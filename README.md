# flyrank-ai Task API self-version

A simple **Node.js + Express (ESM)** CRUD API for managing tasks, complete with **Swagger UI** documentation.

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
| GET | ``/tasks`` | List all tasks | 200 |
| GET | ``/tasks/{id}`` | Get a single task by ID | 200, 404 |
| POST | ``/tasks`` | Create a new task | 201, 400 |
| PUT | ``/tasks/{id}`` | Update a task | 200, 400, 404 |
| DELETE | ``/tasks/{id}`` | Delete a task | 204, 404 |

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

## Comparing AI Code with My Code

- What did the AI do better — and do you understand its version well enough to explain it? The AI generated the code with better error handling with a detailed documentation. 
- What did it get wrong or quietly ignore from your prompt? - The AI did not ignore anything or got anything wrong from my prompt.
- What did your prompt forget to specify — My prompt did not forget any details. I described the complete details of the project in my prompt.

