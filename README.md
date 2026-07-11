# 📖 Journal App

A secure RESTful Journal Application built using **Spring Boot**, **MongoDB Atlas**, **Spring Security**, and **JWT Authentication**. The application allows users to create personal journal entries while ensuring secure authentication and authorization.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 👤 User Registration & Login
- 📓 Create, Read, Update and Delete Journal Entries
- 🔒 Protected APIs using Spring Security
- ☁️ MongoDB Atlas Integration
- 📧 Email Support using Spring Mail
- 🌐 RESTful API Design
- 🗂️ Auto Index Creation for MongoDB

---

## 🛠️ Tech Stack

### Backend
- Java 21+
- Spring Boot
- Spring Security
- Spring Data MongoDB
- JWT (JSON Web Token)
- Maven

### Database
- MongoDB Atlas

### Tools
- IntelliJ IDEA
- Postman
- Git & GitHub

---

## 📂 Project Structure

```
src
├── main
│   ├── java
│   │   ├── config
│   │   ├── controller
│   │   ├── entity
│   │   ├── repository
│   │   ├── service
│   │   ├── security
│   │   └── JournalAppApplication
│   └── resources
│       └── application.yml
```

---

## 🔑 Authentication

The application uses **JWT Authentication**.

### Public Endpoints

```
POST /public/create-user
POST /public/login
```

### Protected Endpoints

```
/journal/**
/user/**
```

To access protected endpoints, include the JWT token in the request header.

```
Authorization: Bearer <your_jwt_token>
```

---

## ⚙️ Configuration

Secrets are **not stored in the repository**.

Configure the following environment variables before running the application:

| Variable | Description |
|----------|-------------|
| MAIL_USERNAME | Gmail address |
| MAIL_PASSWORD | Gmail App Password |
| MONGODB_URI | MongoDB Atlas Connection String |
| API_KEY | Weather API Key |

---

## ▶️ Running the Project

### Clone the repository

```bash
git clone https://github.com/Himansh-cell/Journal-App.git
```

### Navigate into the project

```bash
cd Journal-App
```

### Run the application

```bash
./mvnw spring-boot:run
```

or run the main class from IntelliJ IDEA.

---

## 📬 API Testing

Use **Postman** to test the REST APIs.

Example Login Request

```
POST /public/login
```

After successful authentication, include the received JWT token in the Authorization header for protected endpoints.

---

## 📌 Future Improvements

- Refresh Token Support
- Swagger/OpenAPI Documentation
- Docker Containerization
- Role-Based Access Control (Admin/User)
- Unit & Integration Testing
- Frontend using React

---

## 👨‍💻 Author

**Himanshu Raj**

- GitHub: https://github.com/Himansh-cell

---

## 📄 License

This project is intended for learning and educational purposes.
