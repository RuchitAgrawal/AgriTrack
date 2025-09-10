const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      quality,
      price,
      targetEntity,
      date,
      metadata
    } = req.body;

    // Determine stage based on user role
    const stageMap = {
      farmer: 'production',
      distributor: 'distribution',
      retailer: 'retail'
    };

    // Determine target entity type based on user role
    const targetEntityTypeMap = {
      farmer: 'distributor',
      distributor: 'retailer',
      retailer: 'consumer'
    };

    const transaction = new Transaction({
      createdBy: req.user._id,
      creatorRole: req.user.role,
      cropDetails: {
        cropName,
        quantity,
        quality,
        price: parseFloat(price)
      },
      targetEntity: {
        entityId: targetEntity,
        entityType: targetEntityTypeMap[req.user.role]
      },
      transactionDate: new Date(date),
      supplyChain: {
        stage: stageMap[req.user.role]
      },
      metadata: metadata || {}
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      message: 'Server error during transaction creation',
      error: error.message
    });
  }
});

// @route   GET /api/transactions
// @desc    Get user's transactions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, cropName } = req.query;
    
    const query = { createdBy: req.user._id };
    
    if (status) query.status = status;
    if (cropName) query['cropDetails.cropName'] = new RegExp(cropName, 'i');

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username email role');

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      message: 'Server error while fetching transactions',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('createdBy', 'username email role profile');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns this transaction or has permission to view
    if (transaction.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      message: 'Server error while fetching transaction',
      error: error.message
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow updates if transaction is pending
    if (transaction.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot update confirmed or completed transactions' 
      });
    }

    const updates = req.body;
    const allowedUpdates = [
      'cropDetails', 'targetEntity', 'transactionDate', 'metadata'
    ];

    allowedUpdates.forEach(field => {
      if (updates[field]) {
        transaction[field] = { ...transaction[field], ...updates[field] };
      }
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      message: 'Server error during transaction update',
      error: error.message
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow deletion if transaction is pending
    if (transaction.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot delete confirmed or completed transactions' 
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      message: 'Server error during transaction deletion',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/:id/supply-chain
// @desc    Get supply chain history for a transaction
// @access  Private
router.get('/:id/supply-chain', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const supplyChainHistory = await transaction.getSupplyChainHistory();

    res.json({
      success: true,
      supplyChain: supplyChainHistory
    });

  } catch (error) {
    console.error('Get supply chain error:', error);
    res.status(500).json({
      message: 'Server error while fetching supply chain',
      error: error.message
    });
  }
});

// @route   POST /api/transactions/:id/confirm
// @desc    Confirm transaction
// @access  Private
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    transaction.status = 'confirmed';
    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction confirmed successfully',
      transaction
    });

  } catch (error) {
    console.error('Confirm transaction error:', error);
    res.status(500).json({
      message: 'Server error during transaction confirmation',
      error: error.message
    });
  }
});

module.exports = router;
