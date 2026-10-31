# 🤖 No-Code AI Chatbot Builder Platform

A production-ready, full-stack **No-Code AI Chatbot Builder** platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma**, **PostgreSQL**, **Better Auth**, **Redux Toolkit**, and the **Groq API**.

---

## ✨ Features

- **🔐 Advanced Authentication & RBAC**: Secure user authentication and session management powered by **Better Auth**.
- **🛠️ Custom Chatbot Creation**: Configure bot personas, custom system instructions, welcome messages, and temperature settings.
- **⚡ Real-Time Streaming Chat**: Lightning-fast streaming responses using the **Groq SDK** (Llama models).
- **💾 Database Persistence**: Permanent storage of chat sessions and messages using **PostgreSQL & Prisma**, ensuring history isn't lost on refresh.
- **🎨 Modern UI/UX**: Sleek, responsive dark-mode interface built with **Tailwind CSS** and **Lucide Icons**.
- **📦 State Management**: Global state handling using **Redux Toolkit**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **AI Integration**: [Groq SDK](https://groq.com/)

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/mahmudul-Hasan-2/ai-chatbot-builder.git](https://github.com/mahmudul-Hasan-2/ai-chatbot-builder.git)
cd ai-chatbot-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot_db?schema=public"
BETTER_AUTH_SECRET="your_better_auth_secret_key"
BETTER_AUTH_URL="http://localhost:3000"
GROQ_API_KEY="your_groq_api_key_here"
```

### 4. Database Setup & Migration

Push your Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
├── actions/             # Server actions (Bot management, Chat sessions)
├── app/                 # Next.js 15 App Router pages & API routes
│   ├── api/             # API endpoints (Chat, Auth info)
│   ├── chat/            # Public embed/test chat interface
│   ├── dashboard/       # User dashboard & chatbot creator
│   └── ...              # Authentication & global layouts
├── lib/                 # Configurations (Prisma, Redux store, Auth client)
├── prisma/              # Database schema definition
└── public/              # Static assets
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
