import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node hash-password.mjs "YourSecurePassword"');
  process.exit(1);
}

const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password, salt);
console.log(hash);
