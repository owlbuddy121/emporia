# Emporia - Employee Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0-green.svg)

> **Empowering Organizational Efficiency**

Emporia is a modern, open-source Employee Management System (EMS) designed to streamline HR processes. It provides a robust, role-based platform for managing employee profiles, departments, leaves, and organizational workflows with a focus on user experience and scalability.

## 📸 Screenshots

| Dashboard Overview | Employee Management | Leaves & Approvals |
|:---:|:---:|:---:|
| ![Dashboard](screenshots/Emporia%20-%20Employee%20Management%20System.png) | ![Employees](screenshots/Emporia%20-%20Employee%20Management%20System%20(1).png) | ![Leaves](screenshots/Emporia%20-%20Employee%20Management%20System%20(2).png) |

## 🚀 Key Features

- **🔐 Robust Security**
  - **JWT Authentication:** Secure, stateless authentication mechanism.
  - **Role-Based Access Control (RBAC):** Granular permissions for Super Admin, HR Admin, Manager, and Employee.
  - **Audit Logging:** Comprehensive tracking of all critical system actions.

- **👥 Employee & Team Management**
  - **Centralized Directory:** Manage employee profiles with ease.
  - **Department Organization:** Structure teams effectively.
  - **Role Management:** Define custom roles and permissions.

- **📅 Leave & Attendance**
  - **Leave Management:** streamlined application and approval workflows.
  - **Attendance Tracking:** Monitor daily attendance and work hours.
  - **Analytics:** Visual insights into attendance trends and patterns.

- **📊 Insights & Reporting**
  - **Dashboard:** At-a-glance view of key metrics.
  - **Data Visualization:** Interactive charts for better decision-making.

- **💻 Modern Tech Stack**
  - **Frontend:** React 18, Material-UI, Recharts
  - **Backend:** Node.js, Express, Mongoose
  - **Database:** MongoDB

## 📋 Roles & Permissions

| Role | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Full system control | Manage roles, view audit logs, configure system settings. |
| **HR Admin** | HR Operations | Manage employees, departments, and leave approvals. |
| **Manager** | Team Leadership | View team members, approve team leaves. |
| **Employee** | Self-Service | View profile, apply for leaves, check status. |

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI) v5
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Yup
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Bcrypt, Helmet, CORS

## 📦 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/emporia.git
    cd emporia
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file
    cp .env.example .env
    # Update .env with your MongoDB URI
    npm run seed # Seed initial data
    npm run dev  # Start server on port 5000
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev  # Start client on port 3000
    ```

## 🔑 Default Credentials

Use these credentials to explore different roles after seeding the database:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@emporia.com` | `admin123` |
| **HR Admin** | `hr@emporia.com` | `hradmin123` |
| **Manager** | `john.smith@emporia.com` | `manager123` |
| **Employee** | `alice.johnson@emporia.com` | `employee123` |

## 📚 API Overview

The backend exposes a comprehensive RESTful API. Key endpoints include:

-   **Auth:** `/api/auth/login`, `/api/auth/me`
-   **Employees:** `/api/employees` (CRUD)
-   **Departments:** `/api/departments` (CRUD)
-   **Leaves:** `/api/leaves` (Apply, Approve, Reject)
-   **Attendance:** `/api/attendance` (Punch-in/out, Stats)
-   **Audit:** `/api/audit-logs`

## 🤝 Contributing

Contributions are welcome! Please perform the following steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Support

For support, email support@emporia.com or open an issue in the repository.

---

**Made with ❤️ by the Owlbuddy Team**
