# Edara – Administrative Management Platform
**Edara** is a modern web platform designed to manage administrative tasks like employee records, attendance, and leave requests. It is structured as a monorepo using Turborepo, with a Next.js frontend and a NestJS backend.
## 🧱 Project Structure
```
Edara/
├── apps/
│   ├── backend/                # NestJS backend
│   └── frontend/               # Next.js frontend
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
```
## 🛠️ Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: NestJS, Drizzle ORM, PostgreSQL
- **Database**: PostgreSQL (Neon.tech)
- **Auth**: iron-session, JWT
- **Monorepo Management**: Turborepo
- **Package Manager**: pnpm
- **Email Service**: Brevo (formerly Sendinblue)
- **Tools**: Git, GitHub, VSCode
- **Environment**: Ubuntu 24.04
## 📋 Prerequisites
Before running this project, make sure you have the following installed:
- **Node.js**: Version 18.0.0 or above
- **pnpm**: Latest version (recommended package manager)
- **Git**: For version control
- **PostgreSQL**: For database (or use the provided Neon.tech connection)
### Install Prerequisites
```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org or use a version manager like nvm

# Install pnpm globally
npm install -g pnpm

# Install Turborepo globally (optional but recommended)
npm install -g turbo
```
## ⚙️ Setup Instructions
### 1. Clone the Repository
```bash
git clone https://github.com/NourEssalam/Edara.git
cd Edara
```
### 2. Install Dependencies
```bash
pnpm install
```
### 3. Environment Configuration
Create the environment files using the provided examples:
```bash
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```
The `.env.example` files are already pre-filled and ready to run locally.
### 4. Run Development Servers
```bash
pnpm dev
```
* Frontend: http://localhost:3000
* Backend: http://localhost:8000
## 🔐 Environment Variables
The project includes pre-configured `.env.example` files for both frontend and backend applications. Simply copy them to create your environment files:
```bash
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```
The `.env.example` files are already pre-filled with working values and ready to run locally. No additional configuration is needed for development.
## 📦 Future Work
* Create Docker setup for consistent deployment
* Add CI/CD pipelines for production
* Improve authentication security
* Add automated tests and validation
* Deploy frontend (e.g. Vercel) and backend (e.g. Railway or Render)
## 📁 Submission Note
This project is structured for academic submission. The source code is organized and includes `.env.example` files to allow reviewers or teachers to run the platform locally using `pnpm dev`. The database and email service are already configured.
## 📜 License
This project was developed for educational purposes only.
