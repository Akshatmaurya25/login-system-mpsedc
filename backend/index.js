require("dotenv").config();

const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, updateUserToken } = require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/message", (request, response) => {
  response.json({ message: "Backend is connected." });
});

app.post("/api/auth/register", async (request, response) => {
  const { email, name, mobile, password } = request.body;

  if (!email || !name || !mobile || !password) {
    return response.status(400).json({ error: "All fields are required." });
  }

  if (password.length < 8) {
    return response.status(400).json({
      error: "Password must be at least 8 characters long.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await createUser({ email, name, mobile, passwordHash });

    return response.status(201).json({
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    if (error.code === "USER_EXISTS") {
      return response
        .status(409)
        .json({ error: "Email is already registered." });
    }

    console.error(error);
    return response.status(500).json({ error: "Unable to register user." });
  }
});

app.post("/api/auth/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ error: "Email and password are required." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({ error: "Invalid email or password." });
    }

    if (!process.env.JWT_SECRET) {
      return response
        .status(500)
        .json({ error: "JWT_SECRET is not configured." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    await updateUserToken(user.id, token);

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    };

    return response.json({
      message: "Login successful.",
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Unable to log in." });
  }
});

app.use((request, response) => {
  response.status(404).json({ error: "Route not found." });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
