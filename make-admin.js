// make-admin.js - Secure CLI Command to Assign Platform Admin
// Usage: node make-admin.js <user-email>
const { getDb, logAuditEvent } = require('./database');

const email = process.argv[2];

if (!email || !email.includes('@')) {
  console.error('Error: Please provide a valid email address.');
  console.error('Usage: node make-admin.js <user-email>');
  process.exit(1);
}

const db = getDb();
const cleanEmail = email.trim().toLowerCase();

const user = db.prepare('SELECT id, name, email, role FROM users WHERE email = ? COLLATE NOCASE').get(cleanEmail);

if (!user) {
  console.error(`Error: User with email "${cleanEmail}" not found.`);
  console.error('Please make sure the user registers first at the welcome/sign-up page.');
  process.exit(1);
}

if (user.role === 'admin') {
  console.log(`User "${user.name}" (${user.email}) is already an Administrator.`);
  process.exit(0);
}

db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
logAuditEvent(db, 'account_elevated', user.id, '127.0.0.1', 'Promoted to admin via CLI tool make-admin.js');

console.log(`========================================================`);
console.log(`✅ Success! "${user.name}" (${user.email}) is now an Administrator.`);
console.log(`The user can now access the Owner/Admin Dashboard at #admin.`);
console.log(`========================================================`);
