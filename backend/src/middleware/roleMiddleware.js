// src/middleware/roleMiddleware.js
module.exports = (requiredRole) => {
    return (req, res, next) => {
      // By this point, authMiddleware should have attached req.user
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - No User Found' });
      }
  
      // Check if user has the required role
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden - Insufficient Permissions' });
      }
  
      next();
    };
  };
  