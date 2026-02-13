# Emporia - Employee Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

An open-source Employee Management System (EMS) designed to provide a role-based, modular, and scalable platform for managing employee profiles, leaves, roles, departments, and organizational workflows.

## 🚀 Features

- **Role-Based Access Control (RBAC)** - Four distinct roles with granular permissions
- **Employee Management** - Complete CRUD operations with search and filtering
- **Department Management** - Organize employees by departments
- **Leave Management** - Apply, approve, and track employee leaves
- **Audit Logging** - Track all system activities
- **JWT Authentication** - Secure token-based authentication
- **Responsive UI** - Built with Material-UI for a modern look

## 📋 Roles & Permissions

### Super Admin
- Full system control
- Manage roles & permissions
- View audit logs
- Manage all employees and departments

### HR Admin
- Manage employees
- Approve/reject leaves
- Manage departments
- View reports

### Manager
- View team members
- Approve/reject team leaves
- Limited editing of team profiles

### Employee
- View/edit own profile
- Apply for leaves
- View leave status

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Material-UI
- React Router
- Axios
- React Hook Form + Yup

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT
- Bcrypt

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret

5. Seed the database with initial data:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Default Credentials

After seeding the database, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@emporia.com | admin123 |
| HR Admin | hr@emporia.com | hr123 |
| Manager | john.smith@emporia.com | manager123 |
| Employee | alice.johnson@emporia.com | employee123 |

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `PUT /api/auth/reset-password/:userId` - Reset user password (Admin)

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (soft delete)
- `GET /api/employees/stats/dashboard` - Get dashboard statistics

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Leaves
- `GET /api/leaves` - Get leaves (filtered by role)
- `GET /api/leaves/my-leaves` - Get current user's leaves
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave
- `GET /api/leaves/stats` - Get leave statistics

### Audit Logs
- `GET /api/audit-logs` - Get audit logs (Super Admin only)
- `GET /api/audit-logs/stats` - Get audit statistics

## 🐳 Docker Support

Coming soon! Docker configuration will be added for easy deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the open-source community
- Inspired by modern HR management needs
- Designed for scalability and extensibility

## 📧 Support

For support, email support@emporia.com or open an issue in the repository.

---

**Made with ❤️ by the Emporia Team**
