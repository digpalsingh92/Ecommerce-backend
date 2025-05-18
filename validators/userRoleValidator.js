export const validateUserRole = (role) => {
  const validRoles = ["admin", "seller", "customer"];
  if (!validRoles.includes(role)) {
     throw new Error('Invalid role provided');
  }
}