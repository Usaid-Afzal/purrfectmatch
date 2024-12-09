const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Pet Adoption Platform' },
  contactEmail: { type: String, default: 'admin@example.com' },
  maxListingsPerUser: { type: Number, default: 10 },
  requireListingApproval: { type: Boolean, default: true },
  
  // Notification settings
  enableEmailNotifications: { type: Boolean, default: true },
  enablePushNotifications: { type: Boolean, default: false },
  notificationFrequency: { type: String, default: 'instant' },
  
  // Security settings
  passwordExpiration: { type: Number, default: 90 },
  maxLoginAttempts: { type: Number, default: 5 },
  sessionTimeout: { type: Number, default: 30 },
  
  // Payment settings
  currency: { type: String, default: 'USD' },
  transactionFee: { type: Number, default: 2.5 },
  enableStripe: { type: Boolean, default: true },
  enablePayPal: { type: Boolean, default: false }
});

module.exports = mongoose.model('Settings', SettingsSchema);
