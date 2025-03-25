const express = require('express');
const router = express.Router();

// Nager.Date APIのURL
const getHolidaysUrl = (year) => `https://date.nager.at/api/v3/publicHolidays/${year}/JP`;

router.get('/', async (req, res) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

  try {
    const fetch = await import('node-fetch');
    const holidaysPromises = years.map(year => fetch.default(getHolidaysUrl(year)));
    const holidaysResponses = await Promise.all(holidaysPromises);

    const holidays = [];
    for (const response of holidaysResponses) {
      if (!response.ok) {
        throw new Error('Failed to fetch holidays');
      }
      const yearHolidays = await response.json();
      holidays.push(...yearHolidays);
    }

    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: '祝日情報の取得に失敗しました。', error: error.message });
  }
});

module.exports = router;
