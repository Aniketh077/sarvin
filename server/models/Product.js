const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: {  
    type: String,  
    unique: true,  
    sparse: true,  
    uppercase: true,
    trim: true,
    index: true
  },
  name: { type: String, required: true,index: true},
  description: { type: String, required: false },
  price: { type: Number, required: true,index: true },
  discountPrice: Number,
  collection: {
    type: String,
    required: false,
    index: true,
    enum: ['Cooking Appliances', 'Small Appliances'],
  },
  warranty: { type: String, required: true }, 
  bestSeller: { type: Boolean, default: false,index: true }, 
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true ,index: true},
  image: { type: String },
  images: [String],
  features: [String],
  specifications: { type: Map, of: String },
  stock: { type: Number, default: 0 },
  burners: {
    type: Number,
    enum: [1, 2, 3, 4],
    // required: function() { return this.collection === 'Cooking Appliances'; }
  },
  ignitionType: {
    type: String,
    enum: ['Auto Ignition', 'Manual Ignition'],
    // required: function() { return this.collection === 'Cooking Appliances'; }
  },
  reviews:
   [{user: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
   rating: {type: Number,required: true,min: 1,max: 5},
   comment: String,
   orderId: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true},
   createdAt: {type: Date,default: Date.now}
   }],
  rating: { type: Number, default: 0,set: v => parseFloat(v.toFixed(1)) },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false, index: true },
  newArrival: { type: Boolean, default: false,index: true },
  createdAt: { type: Date, default: Date.now ,index: true }
});

productSchema.pre('save', function(next) {
  if (!this.productCode && this.isNew) {
    const timestamp = Date.now().toString().slice(-6);
    this.productCode = `PROD-${timestamp}`;
  }
  if (this.collection !== 'Cooking Appliances') {
    this.burners = undefined;
    this.ignitionType = undefined;
  }
  next();
});

productSchema.virtual('displayId').get(function() {
  return this.productCode || this._id.toString();
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);