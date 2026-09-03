require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function createUser({ email, name, mobile, passwordHash }) {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error("Email is already registered.");
    error.code = "USER_EXISTS";
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO users (email, name, mobile, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, mobile`,
    [normalizedEmail, name.trim(), mobile.trim(), passwordHash],
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, email, name, mobile, password_hash AS "passwordHash"
     FROM users
     WHERE lower(email) = lower($1)
     LIMIT 1`,
    [normalizeEmail(email)],
  );

  return result.rows[0] || null;
}

async function updateUserToken(userId, token) {
  await pool.query(
    `UPDATE users
     SET jwt_token = $1
     WHERE id = $2`,
    [token, userId],
  );
}

module.exports = { createUser, findUserByEmail, updateUserToken };
