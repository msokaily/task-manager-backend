
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
git clone https://github.com/msokaily/task-manager-backend.git
cd task-manager/
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file and add:

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

Base URL: `http://localhost:3000/api/`

---

### **Auth Routes**
| Method | Route             | Description       |
|--------|-------------------|-------------------|
| POST   | `/auth/signup`    | User signup       |
| POST   | `/auth/login`     | User login        |

---

### **Task Routes**
| Method | Route                    | Description         |
|--------|--------------------------|---------------------|
| GET    | `/tasks?page=1`          | Get all tasks       |
| POST   | `/tasks`                 | Create new task     |
| PUT    | `/tasks/9`               | Update task         |
| DELETE | `/tasks/7`               | Delete task         |

---

### **Comment Routes**
| Method | Route                             | Description         |
|--------|-----------------------------------|---------------------|
| GET    | `/tasks/1/comments`               | Get comments        |
| POST   | `/tasks/9/comments`               | Add comment         |
| PUT    | `/tasks/1/comments/1`             | Update comment      |

---

### **GraphQL**
| Method | Route              | Description        |
|--------|--------------------|--------------------|
| GET    | `/graphql`         | Control Tasks      |

---

### **Category Routes**
| Method | Route                   | Description           |
|--------|-------------------------|-----------------------|
| GET    | `/categories?page=1`    | Get all categories    |
| POST   | `/categories`           | Add category          |
| PUT    | `/categories/1`         | Update category       |
| DELETE | `/categories/2`         | Delete category       |

---

### **Admin Routes**
| Method | Route                   | Description             |
|--------|-------------------------|-------------------------|
| POST   | `/users`                | Add user (admin)        |
| PUT    | `/users/24`             | Update user (admin)     |
| GET    | `/users`                | Get users               |
| GET    | `/logs?page=1`          | Task log                |
| GET    | `/users/2/tasks`        | Get tasks for a user    |

---

### **Swagger docs**
| Method | Route              | Description        |
|--------|--------------------|--------------------|
| GET    | `/api-docs`        | Swagger docs       |


---

## 🧪 Tools & Tips

- Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) for testing API
- Check `prisma/schema.prisma` to update database schema
- Use `npm run dev` to start the backend with auto-reload
- Postman Collection: https://api.postman.com/collections/1252429-a1d4ffe9-cf95-4ea5-be49-a6bd1c7b0dec?access_key=PMAT-01JRFWYR76VC35DA4VSSQFDJGD

---

## 📌 To Do

- [x] Setup Express + Prisma + PostgreSQL
- [x] Auth (Signup/Login) with JWT
- [x] Task CRUD API
- [x] Admin user management
- [x] Filtering & sorting
- [x] Swagger docs
- [ ] Frontend (Next.js + Zustand)

---

## 📖 License
MIT
