## Backend API

Start the backend from the `backend` directory:

```bash
npm start
```

Add the Neon connection string to `backend/.env`:

```env
DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-long-random-secret
```

Run the SQL in `backend/schema.sql` in the Neon SQL Editor before using registration or login.
If the `users` table already exists, run `backend/alter-add-jwt.sql` instead:

```sql
ALTER TABLE users
ADD COLUMN jwt_token TEXT;
```

The API runs at `http://localhost:5000` by default.

```js
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "person@example.com",
    password: "password123",
  }),
});

const result = await response.json();
console.log(result.user);
```

Available routes:

- `GET /api/health`
- `GET /api/message`
- `POST /api/auth/register` with `email`, `name`, `mobile`, and `password`
- `POST /api/auth/login` with `email` and `password`

Open `frontend/index.html` in a browser for the login and registration page. After login, the JWT is returned by the API and stored in browser `localStorage` as `authToken`.
