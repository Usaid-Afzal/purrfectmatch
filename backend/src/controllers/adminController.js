const User = require('../models/User');
const Listing = require('../models/Listing');
const Settings = require('../models/Settings');
const Activity = require('../models/Activity');
const Transaction = require('../models/Transaction');
const { getIO } = require('../config/socket');


class AdminController {
  // USER MANAGEMENT
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body; 
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  // LISTING MODERATION
  async getModerationListings(req, res) {
    try {
      // Assuming Listing model has a 'status' field: 'pending', 'approved', 'rejected'
      const listings = await Listing.find({ status: 'pending' });
      res.json(listings);
    } catch (error) {
      console.error('Error fetching moderation listings:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async approveListing(req, res) {
    try {
      const { id } = req.params;
      const listing = await Listing.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      // Record activity
      await Activity.create({ type: 'listing_approved', details: `Listing ${listing._id} approved` });
      
      // Let's say listing has an owner field: listing.owner
      // Notify the owner
      const io = getIO();
      io.to(`user_${listing.owner}`).emit('listingApproved', {
        listingId: listing._id,
        title: listing.title,
        message: 'Your listing has been approved!'
      });

      res.json({ message: 'Listing approved successfully', listing });
    } catch (error) {
      console.error('Error approving listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async rejectListing(req, res) {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      // For rejection, either remove it or set status='rejected'
      await Listing.findByIdAndUpdate(id, { status: 'rejected' });
      
      // Record activity
      await Activity.create({ type: 'listing_rejected', details: `Listing ${listing._id} rejected` });

      res.json({ message: 'Listing rejected successfully' });
    } catch (error) {
      console.error('Error rejecting listing:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  // SETTINGS MANAGEMENT
  async getSettings(req, res) {
    try {
      let settings = await Settings.findOne({});
      if (!settings) {
        settings = await Settings.create({});
      }
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  async updateSettings(req, res) {
    try {
      const updates = req.body;
      let settings = await Settings.findOne({});
      if (!settings) {
        // If no settings doc exists, create one
        settings = await Settings.create(updates);
      } else {
        Object.assign(settings, updates);
        await settings.save();
      }
      res.json({ message: 'Settings saved successfully', settings });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  // FINANCIAL OVERSIGHT
  async getFinancialData(req, res) {
    try {
      // Gather stats: sum of transactions, monthly revenue, etc.
      const transactions = await Transaction.find({});
      
      const totalRevenue = transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);
      const totalTransactions = transactions.length;
      const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // For monthlyRevenue & revenueData:  
      // This is placeholder logic. You may need actual monthly grouping in a real scenario.
      const monthlyRevenue = totalRevenue; // for simplicity, same as totalRevenue
      const revenueData = transactions.map(t => ({
        date: t.date.toISOString().split('T')[0],
        revenue: t.amount
      }));

      const statistics = {
        totalRevenue,
        monthlyRevenue,
        averageTransactionValue,
        totalTransactions
      };

      res.json({
        statistics,
        transactions: transactions.map(t => ({
          date: t.date,
          type: t.type,
          amount: t.amount,
          status: t.status
        })),
        revenueData
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  // SYSTEM MONITORING
  async getActivities(req, res) {
    try {
      const activities = await Activity.find({}).sort({ timestamp: -1 }); // Latest first
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }
}

module.exports = new AdminController();
