const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction identification
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  
  // User who created this transaction
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Role of the creator
  creatorRole: {
    type: String,
    required: true,
    enum: ['farmer', 'distributor', 'retailer']
  },
  
  // Crop information
  cropDetails: {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true
    },
    quality: {
      type: String,
      required: [true, 'Quality is required'],
      enum: ['Premium', 'Grade A', 'Grade B', 'Standard', 'Organic']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    priceUnit: {
      type: String,
      default: 'per kg'
    }
  },
  
  // Target entity information
  targetEntity: {
    entityId: {
      type: String,
      required: [true, 'Target entity ID is required']
    },
    entityType: {
      type: String,
      required: true,
      enum: ['distributor', 'retailer', 'consumer']
    },
    entityDetails: {
      name: String,
      contact: String,
      address: String
    }
  },
  
  // Transaction date
  transactionDate: {
    type: Date,
    required: [true, 'Transaction date is required']
  },
  
  // Supply chain tracking
  supplyChain: {
    previousTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    nextTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    stage: {
      type: String,
      enum: ['production', 'distribution', 'retail', 'consumed'],
      required: true
    }
  },
  
  // Location information
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: {
      city: String,
      state: String,
      country: {
        type: String,
        default: 'India'
      }
    }
  },
  
  // Additional metadata
  metadata: {
    harvestDate: Date, // For farmers
    expiryDate: Date,
    storageConditions: String,
    transportMethod: String, // For distributors
    certifications: [String], // Organic, Fair Trade, etc.
    batchNumber: String,
    notes: String
  },
  
  // Blockchain integration
  blockchain: {
    blockHash: String,
    transactionHash: String,
    blockNumber: Number,
    gasUsed: Number,
    confirmed: {
      type: Boolean,
      default: false
    }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verificationDate: Date
  
}, {
  timestamps: true
});

// Generate unique transaction ID
transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.transactionId = `TXN_${this.creatorRole.toUpperCase()}_${timestamp}_${random}`;
  }
  next();
});

// Index for better query performance
transactionSchema.index({ createdBy: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ 'cropDetails.cropName': 1 });
transactionSchema.index({ 'supplyChain.stage': 1 });
transactionSchema.index({ status: 1 });

// Virtual for total value
transactionSchema.virtual('totalValue').get(function() {
  // Extract numeric value from quantity string
  const quantityMatch = this.cropDetails.quantity.match(/(\d+(?:\.\d+)?)/);
  const numericQuantity = quantityMatch ? parseFloat(quantityMatch[1]) : 0;
  return numericQuantity * this.cropDetails.price;
});

// Method to get supply chain history
transactionSchema.methods.getSupplyChainHistory = async function() {
  const history = [];
  let current = this;
  
  // Go backwards in the chain
  while (current && current.supplyChain.previousTransaction) {
    current = await this.constructor.findById(current.supplyChain.previousTransaction);
    if (current) history.unshift(current);
  }
  
  // Add current transaction
  history.push(this);
  
  // Go forwards in the chain
  current = this;
  while (current && current.supplyChain.nextTransaction) {
    current = await this.constructor.findById(current.supplyChain.nextTransaction);
    if (current) history.push(current);
  }
  
  return history;
};

module.exports = mongoose.model('Transaction', transactionSchema);
