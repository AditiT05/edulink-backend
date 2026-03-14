const CalendarEvent = require("../models/CalendarEvent");

exports.addEvent = async (req, res) => {
  try {
    const { date, title } = req.body;

    const event = await CalendarEvent.create({
      teacherId: req.user.id,
      date,
      title
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error saving event" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find({ teacherId: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events" });
  }
};
