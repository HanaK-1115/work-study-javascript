const Holiday = require('../models/Holiday');

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll();
    res.json(holidays);
  } catch (error) {
    console.error('Failed to fetch holidays:', error);
    res.status(500).json({ message: 'Failed to fetch holidays' });
  }
};