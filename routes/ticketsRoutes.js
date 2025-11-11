import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// Get api/tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json({ tickets: tickets });
  } catch (error) {
    res.status(500).send({ message: "Server error" + error.message });
  }
});

// Post api/tickets
router.post("/", async (req, res) => {
  const ticket = new Ticket({
    user: req.body.user,
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

// Get api/tickets/:id
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

// Put api/tickets/:id
router.put("/:id", async (req, res) => {
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

// Delete api/tickets/:id
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
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
