import express from "express";
import Ticket from "../models/Ticket.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import buildFilter from "../middlewares/filter.js";
import paginate from "../middlewares/paginate.js";

const router = express.Router();

// Get api/tickets
// Get all tickets
// Get /api/tickets
// Get /api/tickets?pageSize=5&page=2
// Get /api/tickets?status=open&priority=high
// Get /api/tickets?search=bug
// public
router.get("/", buildFilter, paginate(Ticket), async (req, res) => {
  /* const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.page) || 1;
  const status = req.query.status || "";
  const priority = req.query.priority || ""; */

  /* let filter = {};
  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  } */

  /* try {
    const tickets = await Ticket.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Ticket.countDocuments();
    res.status(200).json({
      tickets,
      page,
      pages: Math.ceil(total / pageSize),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send({ message: "Server error" + error.message });
  } */
  res.status(200).json(req.paginatedResults);
});

// Create a Ticket
// Post api/tickets
// Private - only logged in users
router.post("/", auth, async (req, res) => {
  const ticket = new Ticket({
    //user: req.body.user,
    user: req.user._id,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
  });

  try {
    const newTicket = await ticket.save();
    res.status(201).json({ ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error.message });
  }
});

// Get a ticket per ID
// Get api/tickets/:id
// Public
router.get("/:id", async (req, res) => {
  //const ticket
  try {
    //const ticket = await Ticket.findById(req.params.id);
    const ticket = await Ticket.findOne({ id: req.params.id });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ ticket: ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error" + error.message });
  }
});

// Update a ticket
// Put api/tickets/:id
// Private - only logged in users
router.put("/:id", auth, async (req, res) => {
  const updates = req.body;
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error" + err.message });
  }
});

// Delete a Ticket
// Delete api/tickets/:id
// Private - only admin users
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ id: req.params.id });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res
      .status(200)
      .json({ message: "Ticket deleted successfully", ticket: ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error" + err.message });
  }
});

export default router;
