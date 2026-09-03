CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  mobile VARCHAR(30),
  password_hash TEXT
);


ALTER TABLE users
ADD COLUMN jwt_token TEXT;
