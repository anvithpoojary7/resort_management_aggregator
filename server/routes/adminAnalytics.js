const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Resort = require('../models/resort');
const Booking = require('../models/booking');
const authMiddleware = require('../middleware/auth');

// Get dashboard analytics data
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get new users in the last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: lastWeek }
    });

    // Get active resorts count
    const activeResorts = await Resort.countDocuments({ status: 'approved' });
    
    // Get new resorts this month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const newResortsThisMonth = await Resort.countDocuments({
      createdAt: { $gte: lastMonth }
    });

    // Get pending resorts count
    const pendingResortsCount = await Resort.countDocuments({ status: 'pending' });

    // Get total revenue
    const bookings = await Booking.find({ paymentStatus: 'paid' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Calculate revenue change percentage
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);
    
    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(0); // Last day of previous month
    lastMonthEnd.setHours(23, 59, 59, 999);
    
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const lastMonthBookings = await Booking.find({
      paymentStatus: 'paid',
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });
    
    const currentMonthBookings = await Booking.find({
      paymentStatus: 'paid',
      createdAt: { $gte: currentMonthStart }
    });
    
    const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const currentMonthRevenue = currentMonthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    let revenueChangePercentage = 0;
    if (lastMonthRevenue > 0) {
      revenueChangePercentage = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    }

    res.status(200).json({
      success: true,
      pendingResortsCount,
      data: {
        totalUsers,
        newUsersThisWeek,
        activeResorts,
        newResortsThisMonth,
        totalRevenue,
        currentMonthRevenue,
        revenueChangePercentage
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard analytics:', err);
    res.status(500).json({ success: false, message: 'Server error fetching analytics data' });
  }
});

// Get revenue data for chart
router.get('/revenue-chart', authMiddleware, async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Get last 6 months revenue data
    const months = [];
    const revenueData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const monthName = monthStart.toLocaleString('default', { month: 'short' });
      months.push(monthName);
      
      const monthBookings = await Booking.find({
        paymentStatus: 'paid',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      revenueData.push({
        name: monthName,
        value: monthRevenue
      });
    }

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (err) {
    console.error('Error fetching revenue chart data:', err);
    res.status(500).json({ success: false, message: 'Server error fetching revenue data' });
  }
});

// Get user growth data for chart
router.get('/user-growth', authMiddleware, async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Get last 6 months user growth data
    const months = [];
    const userData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const monthName = monthStart.toLocaleString('default', { month: 'short' });
      months.push(monthName);
      
      const newUsers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      userData.push({
        month: monthName,
        users: newUsers
      });
    }

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (err) {
    console.error('Error fetching user growth data:', err);
    res.status(500).json({ success: false, message: 'Server error fetching user data' });
  }
});

// Get recent activity data
router.get('/recent-activity', authMiddleware, async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', 'name')
      .populate('resort', 'name');
      
    // Get recent new users
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');
      
    // Get recent new resorts
    const recentResorts = await Resort.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name status createdAt');
      
    // Format the activity data
    const activities = [];
    
    recentBookings.forEach(booking => {
      activities.push({
        type: 'booking',
        desc: `New booking: ${booking.user.name} booked ${booking.resort.name}`,
        time: booking.createdAt
      });
    });
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        desc: `New user registration: ${user.name}`,
        time: user.createdAt
      });
    });
    
    recentResorts.forEach(resort => {
      activities.push({
        type: 'resort',
        desc: `New resort "${resort.name}" ${resort.status === 'approved' ? 'approved' : 'submitted for approval'}`,
        time: resort.createdAt
      });
    });
    
    // Sort by time (most recent first)
    activities.sort((a, b) => b.time - a.time);
    
    // Format time as relative time (e.g., "2 hours ago")
    activities.forEach(activity => {
      const now = new Date();
      const activityTime = new Date(activity.time);
      const diffMs = now - activityTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        activity.timeFormatted = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        activity.timeFormatted = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMins > 0) {
        activity.timeFormatted = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else {
        activity.timeFormatted = 'Just now';
      }
    });
    
    res.status(200).json({
      success: true,
      data: activities.slice(0, 5) // Return top 5 most recent activities
    });
  } catch (err) {
    console.error('Error fetching recent activity data:', err);
    res.status(500).json({ success: false, message: 'Server error fetching activity data' });
  }
});

module.exports = router;