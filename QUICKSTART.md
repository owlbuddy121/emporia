# Emporia - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0 (or use Docker)

### Option 1: Local Development (Recommended for Testing)

#### Step 1: Start MongoDB
Make sure MongoDB is running on your system. If you have MongoDB installed:
```bash
mongod
```

Or use Docker:
```bash
docker run -d -p 27017:27017 --name emporia-mongodb mongo:latest
```

#### Step 2: Setup Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

The backend will start on `http://localhost:5000`

#### Step 3: Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

#### Step 4: Login
Open your browser and navigate to `http://localhost:3000`

Use any of these demo accounts:
- **Super Admin**: admin@emporia.com / admin123
- **HR Admin**: hr@emporia.com / hr123
- **Manager**: john.smith@emporia.com / manager123
- **Employee**: alice.johnson@emporia.com / employee123

### Option 2: Using Docker

```bash
docker-compose up
```

This will start MongoDB, backend, and frontend all at once.

---

## 📝 What You Can Do

### As Super Admin
- ✅ View all employees
- ✅ Manage departments
- ✅ Create and manage roles
- ✅ View audit logs
- ✅ Approve/reject all leaves

### As HR Admin
- ✅ Manage employees
- ✅ Manage departments
- ✅ Approve/reject leaves
- ❌ Cannot manage roles

### As Manager
- ✅ View team members
- ✅ Approve/reject team leaves
- ❌ Cannot manage other departments

### As Employee
- ✅ View own profile
- ✅ Apply for leaves
- ✅ View leave status
- ❌ Cannot view other employees

---

## 🧪 Testing the API

### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@emporia.com","password":"admin123"}'
```

Copy the token from the response.

### Get All Employees
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create a New Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@emporia.com",
    "password": "password123",
    "role": "ROLE_ID_HERE",
    "department": "DEPARTMENT_ID_HERE"
  }'
```

---

## 🔧 Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file exists in backend directory

### Frontend won't start
- Make sure backend is running first
- Check if port 3000 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Can't login
- Make sure you ran `npm run seed` in the backend
- Check MongoDB connection
- Verify credentials are correct

---

## 📚 Next Steps

1. **Explore the Dashboard** - Login with different roles to see different views
2. **Test API Endpoints** - Use Postman or cURL to test the REST API
3. **Add More Features** - Extend the system with additional modules
4. **Deploy to Production** - Use Docker for easy deployment

---

## 🆘 Need Help?

- Check the [README.md](file:///d:/Owlbuddy%20Projects/emporia/README.md) for detailed documentation
- Review the [walkthrough.md](file:///C:/Users/91950/.gemini/antigravity/brain/df083a1b-e066-473d-8fd7-19b165c64f28/walkthrough.md) for implementation details
- Open an issue on GitHub

---

**Happy Coding! 🎉**
