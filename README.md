
# 📝 Task Manager API

A backend API for a full-featured Task Manager app built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma**.  
Includes JWT-based authentication, role-based access, and full CRUD for tasks.

---

## 🚀 Features

### ✅ Core
- User authentication (signup/login/logout) with JWT
- Password hashing using bcrypt
- Role-based access (Admin / User)
- Task CRUD (Create, Read, Update, Delete)
- Task attributes: title, description, status, priority, due date
- PostgreSQL database with Prisma ORM

### 🔐 Authentication
- Secure login/signup endpoints
- Middleware to protect routes
- JWT token with `userId` and `role`

---

## 🧱 Tech Stack

| Layer       | Tech                  |
|-------------|-----------------------|
| Backend     | Node.js, Express      |
| ORM         | Prisma                |
| Database    | PostgreSQL            |
| Auth        | JWT, bcrypt           |
| Dev Tools   | Nodemon, Dotenv       |

---

## 📦 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in `backend/` and add:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/task_manager?schema=public"
```

> Replace with your actual PostgreSQL credentials.

---

### 4. Setup Prisma & DB

#### Initialize Prisma
```bash
npx prisma init
```

#### Generate DB & Prisma Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### View in Prisma Studio (optional)
```bash
npx prisma studio
```

---

### 5. Run the Development Server
```bash
npm run dev
```

---

## 🛠 API Endpoints

### **Auth Routes**
| Method | Route              | Description        |
|--------|--------------------|--------------------|
| POST   | `/api/auth/signup` | Register new user  |
| POST   | `/api/auth/login`  | Login with email/password |

### **(Coming Soon) Task Routes**
| Method | Route              | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/tasks`       | Get all tasks      |
| POST   | `/api/tasks`       | Create new task    |
| PUT    | `/api/tasks/:id`   | Update task        |
| DELETE | `/api/tasks/:id`   | Delete task        |

---

## 🧪 Tools & Tips

- Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) for testing API
- Check `prisma/schema.prisma` to update database schema
- Use `npm run dev` to start the backend with auto-reload

---

## 📌 To Do

- [x] Setup Express + Prisma + PostgreSQL
- [x] Auth (Signup/Login) with JWT
- [ ] Task CRUD API
- [ ] Admin user management
- [ ] Filtering & sorting
- [ ] Swagger docs
- [ ] Frontend (Next.js + Zustand)

---

## 📖 License
MIT
