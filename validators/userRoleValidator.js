export const validateUserRole = (role) => {
  const validRoles = ["admin", "seller", "customer"];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role provided');
  }

  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    next();
  };
};
