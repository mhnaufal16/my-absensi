// Run: npm install bcryptjs
// Then: node scripts/create_demo_user.js

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_EMAIL || 'admin@example.com';
  const plain = process.env.DEMO_PASS || 'admin123';
  const role = process.env.DEMO_ROLE || 'ADMIN';

  const hashed = bcrypt.hashSync(plain, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists:', existing.email, '(id=' + existing.id + ', role=' + existing.role + ')');
    console.log('If you want to update the password or role, delete the user or adjust the script.');
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: role === 'ADMIN' ? 'Admin User' : 'Demo User',
      email,
      password: hashed,
      role: role,
    },
  });

  console.log('Created demo user:');
  console.log('  id:', user.id);
  console.log('  email:', user.email);
  console.log('  password (plain):', plain);
  console.log('\nYou can now login with that email/password (implement auth to compare hashed password).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
