const express = require('express');
const router = express.Router();
const { getTables, updateTableStatus } = require('../controllers/tableController');

router.route('/')
  .get(getTables);

router.route('/:id/status')
  .patch(updateTableStatus);

module.exports = router;
