const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URL = "mongodb+srv://gazalaanjumbk058_db_user:Gazala058@cluster0.2nkuxvo.mongodb.net/todoDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Error:", err));

// TASK SCHEMA
const taskSchema = new mongoose.Schema({
  text: String,
  priority: String,
  date: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model("Task", taskSchema);

// USER SCHEMA
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// ROUTES

// Tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.put("/tasks/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// AUTH

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.json({ message: "User already exists" });
  }

  const newUser = new User({ email, password });
  await newUser.save();

  res.json({ message: "Signup successful" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ message: "Wrong password" });
  }

  res.json({ message: "Login successful", user });
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});