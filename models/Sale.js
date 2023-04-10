// Import Mongoose
const mongoose = require('mongoose')

// Extract Schema object from Mongoose
const { Schema } = mongoose;

// Define SaleSchema
const SaleSchema = new Schema({
  saleDate: {
    type: Date,
    required: true
  },
  
  items: {
    type: [{
      name: {
        type: String,
        required: true
      },
      tags: {
        type: [String]
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    required: true
  },
  storeLocation: {
    type: String
  },
  customer: {
    type: {
      gender: {
        type: String
      },
      age: {
        type: Number
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      satisfaction: {
        type: Number,
        min: 1,
        max: 5
      },
      couponUsed: {
        type: Boolean,
        required: true
      },
      purchaseMethod: {
        type: String,
        required: true
      }
    },
    required: true
  }
}, {
  collection: 'sales'
});

// Create and export Sale model
module.exports = mongoose.model('Sale', SaleSchema);

