# HR Authentication Portal

This repository implements the HR login, signup, and HR user CRUD workflows that correspond to the ClickUp tasks:
- [HR Login](https://app.clickup.com/t/86d3p6j71)
- [HR Signup](https://app.clickup.com/t/86d3p6j6z)
- [HR User CRUD](https://app.clickup.com/t/86d3p6j70)

## Repository layout

- `backend/` – Express + TypeScript API with JWT authentication, bcrypt password hashing, and SQLite persistence.
- `frontend/` – React (Create React App) single-page app that consumes the backend endpoints.

## Getting started

### Backend

1. `cd backend`
2. Copy `.env.example` to `.env` and populate:
   ```
   PORT=4000
   JWT_SECRET=super-secret-value
   DB_PATH=data/hr.sqlite
   ```
3. Install dependencies: `npm install`
4. Run in development: `npm run dev`
5. Or build and run: `npm run build && npm start`

> The backend automatically initializes `data/hr.sqlite` the first time it runs. Ensure the `backend/data` folder exists.

### Frontend

1. `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`
4. If the backend runs on a different host/port, define `REACT_APP_API_BASE_URL` in `.env`.

## Workflow

1. Sign up via the frontend to create the first HR user.
2. Log in with the registered credentials to receive a JWT.
3. Use the HR dashboard to list, add, edit, and delete HR employees.
