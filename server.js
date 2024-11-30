const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Parses incoming requests with JSON payloads

const mongoURL = process.env.MONGO_URL;
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB "))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define a Mongoose Schema and Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

app.post("/add-contacts", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Home Page");
});
app.get("/about", (req, res) => {
  res.send("About Page");
});
app.get("/contact", (req, res) => {
  res.send("<h1>This is Contact Page</h1>");
});

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
