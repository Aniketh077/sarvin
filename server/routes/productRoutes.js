const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  rateProduct,
    getTypes,   
  createType,   
  updateType,  
  deleteType, 
  getCollectionsWithTypes,
  getBestSellers,
  getFeaturedProducts, 
  getNewArrivals  
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/auth');

// Types routes 
router.route('/types')
  .get(getTypes)
  .post(protect, admin, createType);

router.route('/types/:id')
  .put(protect, admin, updateType)
  .delete(protect, admin, deleteType);

  router.get('/best-sellers', getBestSellers);
  router.get('/featured', getFeaturedProducts);   
  router.get('/new-arrivals', getNewArrivals); 
  
  

// Product routes 
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/collections', getCollectionsWithTypes);

router.post('/:id/rate', protect, rateProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;