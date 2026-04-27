const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public (for POS)
exports.getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ floor: 1, number: 1 });
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// @desc    Update table status
// @route   PATCH /api/tables/:id/status
// @access  Public (for POS)
exports.updateTableStatus = async (req, res, next) => {
  try {
    const { status, currentOrderId } = req.body;
    
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    table.status = status;
    if (currentOrderId !== undefined) {
      table.currentOrderId = currentOrderId;
    }

    await table.save();
    res.json(table);
  } catch (error) {
    next(error);
  }
};
