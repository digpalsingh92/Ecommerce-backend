export const generateVerificationCode = () => {
   return Math.floor(100000 + Math.random() * 900000).toString();
}

// import crypto from 'crypto';
// export const generateVerificationCode =() => {
//   return crypto.randomBytes(20).toString('hex');
// }