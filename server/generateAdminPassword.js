import bcrypt from 'bcryptjs';

// Generate hashed password for admin user
const password = 'admin123';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('\n=== Admin User Password Hash ===');
console.log('Password:', password);
console.log('Hash:', hashedPassword);
console.log('\nUse this SQL to create admin user:');
console.log(`
INSERT INTO employees (employee_id, name, email, password, phone_number, language, group_id)
VALUES (
    'ADMIN001',
    'Admin User',
    'admin@example.com',
    '${hashedPassword}',
    '1234567890',
    'English',
    NULL
);
`);
console.log('Login credentials:');
console.log('Email: admin@example.com');
console.log('Password: admin123');
console.log('\n');
