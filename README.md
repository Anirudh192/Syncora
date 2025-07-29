<h1 align="center">🚀 SYNCORA</h1>
<p align="center">🧠 Real-Time Team Collaboration Platform built with React, Tailwind CSS, Zustand, and Socket.IO</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/react-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/tailwindcss-3-38b2ac?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/socket.io-live-black?style=for-the-badge&logo=socketdotio" />
</p>

---

## 🌟 Overview

**SYNCORA** is a cutting-edge web app for **real-time team collaboration**. It combines project + task management with **live chat**, **whiteboarding**, and **team presence** — all packed into a sleek, responsive interface.

Designed for speed, clarity, and scalability, SYNCORA is perfect for teams who work fast and communicate even faster.

---

## 🎯 Features

### 📁 Project & Task Management
- ✅ Create & manage projects
- ✅ Add, assign & update tasks
- ✅ Real-time task updates

### 🧑‍🤝‍🧑 Team & User Management
- 🏗 Create & join teams
- 👥 Role-based access: Owner, Admin, Member
- 📩 Invite users via email

### 🧑‍🎨 Real-Time Whiteboard
- 🎨 Built with **Excalidraw**
- 🔄 Live sync with other users
- 🧲 Follow users’ cursors with a click

### 💬 Real-Time Chat
- ⚡ Instant messaging via **Socket.IO**
- 👀 Online/offline presence
- 🔔 Typing indicators

### 🧭 Clean & Modular Frontend
- ✨ Built with **React + Vite**
- 🎨 Styled using **Tailwind CSS**
- 🧠 Managed by **Zustand**
- 🧩 Modular structure for quick UI redesign

---

## 🧱 Tech Stack

| Category       | Tools / Frameworks                               |
|----------------|--------------------------------------------------|
| 💻 Frontend     | React, Vite, Tailwind CSS, Zustand               |
| 🧠 State Mgmt   | Zustand (lightweight & scalable)                |
| 🔙 Backend      | Node.js, Express, REST APIs                      |
| 🧩 Auth         | JWT (with secure HTTP-only cookies)              |
| ⚡ Realtime     | Socket.IO, Excalidraw                            |
| 🛢️ Database     | PostgreSQL, Prisma ORM                           |

---

## 🛠️ Getting Started

### ✅ Prerequisites
- Node.js (v18+)
- PostgreSQL (with schema setup)
- `.env` file with secrets (API keys, DB connection)

### 🧪 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/syncora.git
cd syncora

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

---

## 🗂️ Project Structure

```
syncora/
├── src/
│   ├── api/             # Axios-based API calls
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable UI components
│   ├── features/        # Task, project, chat modules
│   ├── pages/           # Page-level components (routes)
│   ├── store/           # Zustand stores
│   └── utils/           # Helper functions
└── App.tsx              # Root component
```

---

## ✅ Status

- 🔐 Auth system (JWT + secure cookies) — DONE  
- 🧠 Zustand-powered global state — DONE  
- 🎨 Real-time collaborative whiteboard — DONE  
- 💬 Live chat + presence system — DONE  
- 🧼 Clean UI structure for redesign — IN PROGRESS  

---

## 📸 Screenshots

> UI screenshots coming soon! Stay tuned 👀

---

## 🔮 Roadmap

- ✅ Backend integration complete
- 🔄 Add animations for better UX
- 📱 Add mobile responsiveness (MVP+)
- 🧪 Add unit & integration testing
- 🌍 Multi-language support (planned)

---

## 🤝 Contributing

Pull requests are welcome!  
Want to add a feature or fix a bug? Fork the repo, create a branch, and submit a PR 🚀

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## ✨ Credits

- [Excalidraw](https://excalidraw.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.IO](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 Inspiration

SYNCORA was built to answer one question:  
> _"What if Trello, Miro, and Notion had a real-time baby?"_
