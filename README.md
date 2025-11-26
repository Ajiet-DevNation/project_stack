# Project Stack

<div align="center">

**The ultimate platform for developers and teams to collaborate on projects seamlessly**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Project Stack** is a collaborative platform designed for students and developers to discover, create, and contribute to projects. Whether you're looking to build your portfolio, find team members, or collaborate on exciting ideas, Project Stack provides all the tools you need.

### Key Highlights

- **Project Discovery**: Browse and search through active projects
- **Smart Matching**: Find projects that match your skills
- **Team Collaboration**: Apply to projects and manage contributors
- **Rich Profiles**: Showcase your skills, bio, and academic background
- **Real-time Updates**: Get notified about project applications and updates

---

## ✨ Features

### Authentication
- OAuth integration with **Google** and **GitHub**
- Secure session management with NextAuth.js
- Protected routes and API endpoints

### User Profiles
- Complete onboarding flow with step-by-step guidance
- Searchable college selection (command palette)
- Skills management with predefined categories
- Profile customization (bio, avatar, academic details)

### Project Management
- Create and publish projects with detailed descriptions
- Project status tracking (Planning, Active, Completed)
- GitHub integration for repository links
- Tech stack visualization
- Like and bookmark functionality

### Collaboration
- Application system for joining projects
- Contributor management
- Notification system for updates
- Application status tracking (Pending, Accepted, Rejected)

### Modern UI/UX
- Beautiful glassmorphic design
- Dark/Light theme support
- Smooth animations with Framer Motion and GSAP
- 3D visual effects with Three.js and React Three Fiber
- Responsive design for all devices

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Components**: Radix UI primitives
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma 6.19.0
- **Authentication**: NextAuth.js v4
- **API**: Next.js API Routes
- **HTTP Client**: Axios

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm** or **bun**
- **PostgreSQL** database (local or cloud)
- **Google OAuth App** (for Google login)
- **GitHub OAuth App** (for GitHub login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ajiet-DevNation/project_stack.git
   cd project_stack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Copy the sample environment file:
   ```bash
   cp .env.sample .env.local
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# NextAuth Configuration
AUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/project_stack"
```

#### Getting OAuth Credentials

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add callback URL: `http://localhost:3000/api/auth/callback/github`

### Database Setup

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

3. **Seed the database** (optional)
   ```bash
   npx prisma db seed
   ```

4. **Open Prisma Studio** (to view/edit data)
   ```bash
   npx prisma studio
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📁 Project Structure

```
project_stack/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication routes
│   │   │   └── onboarding/    # Onboarding flow
│   │   ├── (user)/            # Protected user routes
│   │   │   ├── home/          # Home dashboard
│   │   │   ├── profile/       # User profiles
│   │   │   └── projects/      # Project pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   └── ui/                # UI primitives
│   ├── lib/                   # Utility functions
│   │   ├── college.ts         # College list
│   │   ├── skills.ts          # Skills categories
│   │   └── validations/       # Zod schemas
│   ├── providers/             # Context providers
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
└── package.json
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Links

- **Live Demo**: [https://projectstack-dev.vercel.app](https://projectstack-dev.vercel.app)
- **Report Bug**: [GitHub Issues](https://github.com/Ajiet-DevNation/project_stack/issues)

---

<div align="center">

Made with ❤️ by the DevNation | Nexus Team of AJIET 

**[⬆ back to top](#project-stack)**

</div>
