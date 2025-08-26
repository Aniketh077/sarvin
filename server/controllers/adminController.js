const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name')
    ]);
    
    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers
};