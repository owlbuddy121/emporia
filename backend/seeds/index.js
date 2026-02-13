require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Role = require('../models/Role');
const Department = require('../models/Department');
const User = require('../models/User');

// Define roles with permissions
const roles = [
    {
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        permissions: [
            'employee:view',
            'employee:create',
            'employee:edit',
            'employee:delete',
            'department:view',
            'department:create',
            'department:edit',
            'department:delete',
            'role:view',
            'role:create',
            'role:edit',
            'role:delete',
            'leave:view',
            'leave:approve',
            'audit:view',
            'user:reset-password',
        ],
    },
    {
        name: 'HR Admin',
        description: 'Manage employees, departments, and leaves',
        permissions: [
            'employee:view',
            'employee:create',
            'employee:edit',
            'employee:delete',
            'department:view',
            'department:create',
            'department:edit',
            'leave:view',
            'leave:approve',
            'user:reset-password',
        ],
    },
    {
        name: 'Manager',
        description: 'Manage team members and approve team leaves',
        permissions: [
            'employee:view',
            'leave:view',
            'leave:approve',
        ],
    },
    {
        name: 'Employee',
        description: 'Self-service access to profile and leave management',
        permissions: [
            'leave:view',
        ],
    },
];

// Define departments
const departments = [
    { name: 'Engineering', description: 'Software development and technical operations' },
    { name: 'Human Resources', description: 'Employee management and recruitment' },
    { name: 'Finance', description: 'Financial planning and accounting' },
    { name: 'Marketing', description: 'Marketing and brand management' },
    { name: 'Sales', description: 'Sales and business development' },
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to database
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Role.deleteMany({});
        await Department.deleteMany({});
        await User.deleteMany({});

        // Create roles
        console.log('📝 Creating roles...');
        const createdRoles = await Role.insertMany(roles);
        console.log(`✅ Created ${createdRoles.length} roles`);

        // Create departments
        console.log('🏢 Creating departments...');
        const createdDepartments = await Department.insertMany(departments);
        console.log(`✅ Created ${createdDepartments.length} departments`);

        // Get role IDs
        const superAdminRole = createdRoles.find(r => r.name === 'Super Admin');
        const hrAdminRole = createdRoles.find(r => r.name === 'HR Admin');
        const managerRole = createdRoles.find(r => r.name === 'Manager');
        const employeeRole = createdRoles.find(r => r.name === 'Employee');

        // Get department IDs
        const engineeringDept = createdDepartments.find(d => d.name === 'Engineering');
        const hrDept = createdDepartments.find(d => d.name === 'Human Resources');
        const financeDept = createdDepartments.find(d => d.name === 'Finance');
        const marketingDept = createdDepartments.find(d => d.name === 'Marketing');

        // Create users
        console.log('👥 Creating users...');

        // Super Admin
        const superAdmin = await User.create({
            name: 'Admin User',
            email: 'admin@emporia.com',
            password: 'admin123',
            role: superAdminRole._id,
            department: hrDept._id,
            status: 'active',
        });
        console.log('✅ Created Super Admin: admin@emporia.com / admin123');

        // HR Admin
        const hrAdmin = await User.create({
            name: 'HR Manager',
            email: 'hr@emporia.com',
            password: 'hr123',
            role: hrAdminRole._id,
            department: hrDept._id,
            status: 'active',
        });
        console.log('✅ Created HR Admin: hr@emporia.com / hr123');

        // Engineering Manager
        const engManager = await User.create({
            name: 'John Smith',
            email: 'john.smith@emporia.com',
            password: 'manager123',
            role: managerRole._id,
            department: engineeringDept._id,
            status: 'active',
        });
        console.log('✅ Created Manager: john.smith@emporia.com / manager123');

        // Update Engineering department with manager
        engineeringDept.manager = engManager._id;
        await engineeringDept.save();

        // Sample Employees
        const employees = [
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@emporia.com',
                password: 'employee123',
                role: employeeRole._id,
                department: engineeringDept._id,
                status: 'active',
            },
            {
                name: 'Bob Williams',
                email: 'bob.williams@emporia.com',
                password: 'employee123',
                role: employeeRole._id,
                department: engineeringDept._id,
                status: 'active',
            },
            {
                name: 'Carol Davis',
                email: 'carol.davis@emporia.com',
                password: 'employee123',
                role: employeeRole._id,
                department: financeDept._id,
                status: 'active',
            },
            {
                name: 'David Brown',
                email: 'david.brown@emporia.com',
                password: 'employee123',
                role: employeeRole._id,
                department: marketingDept._id,
                status: 'active',
            },
        ];

        const createdEmployees = await User.insertMany(employees);
        console.log(`✅ Created ${createdEmployees.length} sample employees`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Super Admin: admin@emporia.com / admin123');
        console.log('HR Admin:    hr@emporia.com / hr123');
        console.log('Manager:     john.smith@emporia.com / manager123');
        console.log('Employee:    alice.johnson@emporia.com / employee123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
