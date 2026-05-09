# School Management API

A REST API built with **Node.js**, **Express**, and **MySQL** to manage schools — add new schools and list them sorted by proximity using the Haversine formula.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Postman Collection](#postman-collection)
- [Deployment](#deployment)

---

## Project Structure

```
educase/
├── server.js                             # Entry point
├── config/
│   └── db.js                             # MySQL connection, DB & table auto-creation
├── models/
│   └── School.js                         # Raw SQL queries
├── controllers/
│   └── schoolController.js               # Business logic + Haversine distance
├── routes/
│   └── schoolRoutes.js                   # API route definitions
├── SchoolManagementAPI.postman_collection.json  # Postman collection
├── .env                                  # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## Tech Stack

| Layer      | Technology        |
|------------|-------------------|
| Runtime    | Node.js v24+      |
| Framework  | Express v5        |
| Database   | MySQL             |
| DB Driver  | mysql2            |
| Config     | dotenv v17        |
| Dev Tool   | nodemon           |

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://dev.mysql.com/downloads/) v8 or higher
- [Postman](https://www.postman.com/downloads/) (for testing)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/educase-school-api.git
cd educase-school-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=schoolDB
PORT=5000
```

### 4. Start the server

```bash
# Development (auto-restart on file changes)
npx nodemon

# Production
npm start
```

> The database and table are **auto-created** on first run — no manual SQL needed.

Server runs at: `http://localhost:5000`

---

## Environment Variables

| Variable  | Description              | Default    |
|-----------|--------------------------|------------|
| `DB_HOST` | MySQL host               | localhost  |
| `DB_USER` | MySQL username           | root       |
| `DB_PASS` | MySQL password           | —          |
| `DB_NAME` | Database name            | schoolDB   |
| `PORT`    | Port to run the server   | 5000       |

---

## API Reference

### POST `/addSchool`

Adds a new school to the database.

**Request Body** (`application/json`)

```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Responses**

| Status | Description              | Response Body                              |
|--------|--------------------------|--------------------------------------------|
| 200    | School added             | `{ "message": "School added successfully" }` |
| 400    | Missing fields           | `{ "error": "All fields are required" }`   |
| 400    | School already exists    | `{ "error": "School already exists" }`     |
| 500    | Server error             | `{ "error": "<error message>" }`           |

---

### GET `/listSchools`

Returns all schools sorted by distance from the provided coordinates.

**Query Parameters**

| Parameter   | Type  | Required | Description              |
|-------------|-------|----------|--------------------------|
| `latitude`  | float | ✅       | User's current latitude  |
| `longitude` | float | ✅       | User's current longitude |

**Example Request**

```
GET /listSchools?latitude=28.6139&longitude=77.2090
```

**Responses**

| Status | Description               | Response Body |
|--------|---------------------------|---------------|
| 200    | Schools retrieved         | See below     |
| 400    | Missing coordinates       | `{ "error": "Latitude and longitude are required" }` |
| 500    | Server error              | `{ "error": "<error message>" }` |

**200 Response Example**

```json
{
  "message": "Schools retrieved successfully",
  "schools": [
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi",
      "latitude": 28.6139,
      "longitude": 77.209,
      "distance": 0
    },
    {
      "id": 2,
      "name": "Ryan International School",
      "address": "Sector 40, Gurgaon",
      "latitude": 28.4595,
      "longitude": 77.0266,
      "distance": 25.4
    }
  ]
}
```

> Schools are sorted by `distance` (in km) in ascending order — nearest first.

---

## Postman Collection

A ready-to-use Postman collection is included: `SchoolManagementAPI.postman_collection.json`

### Import locally
1. Open Postman → click `Import`
2. Select `SchoolManagementAPI.postman_collection.json`
3. Click `Import`

### Included requests
| Request                     | Method | Scenario              |
|-----------------------------|--------|-----------------------|
| Add School - Success        | POST   | Valid data            |
| Add School - Duplicate      | POST   | School already exists |
| Add School - Missing Fields | POST   | Incomplete body       |
| List Schools - Success      | GET    | Valid coordinates     |
| List Schools - Missing Params | GET  | No coordinates        |

---

## Notes

- The `.env` file is excluded from version control via `.gitignore`
- Database and table are auto-created on server startup
- Distance is calculated using the **Haversine formula** (accurate for geographic coordinates)
