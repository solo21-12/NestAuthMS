# 🛡️ User Management System (NestJS Gateway + Microservice)

Welcome to the **User Management API** — a robust, modular system built using **NestJS**, **MongoDB**, **Redis**, and microservice architecture with **TCP communication**.

## 🚀 Project Overview

This application consists of:
- **API Gateway**: Handles client requests and routes them to the appropriate services.
- **User Microservice**: Contains business logic and database operations.
- **MongoDB**: For data persistence.
- **Redis**: For caching and session/token management.
- **TCP**: Used for communication between the gateway and microservice.

## ✨ Features

### 🔐 Authentication & Authorization
- `POST /auth/sign-up` - Register a new user
- `POST /auth/sign-in` - Log in a user
- `POST /auth/sign-out` - Log out a user
- `POST /auth/refresh-token` - Refresh the access token

### 👥 User Management
- `GET /users` - List users (any authenticated user)
- `POST /users` - Create user (admin only)
- `PATCH /users/:id` - Update user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

> Passwords and roles are **not** shown in the user listing.

## 🧠 Role-Based Access Control (RBAC)
- **Admin**: Can create, update, delete users.
- **User**: Can only view user listings.
- Access enforced using NestJS **Guards**.

## 📦 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: MongoDB
- **Cache**: Redis
- **Communication**: TCP (between Gateway and Microservice)
- **Validation**: class-validator (DTOs)
- **Documentation**: Swagger (`/api/docs#/`)

---

## 🛠️ Getting Started

### Prerequisites
- Docker & Docker Compose
- pnpm (`npm install -g pnpm`)

### 📦 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/solo21-12/NestAuthMS
   cd user-management-system
