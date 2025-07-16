# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# gemini-frontend-clone

# 💬 Gemini Clone – Conversational AI Chat App (Frontend)

A fully functional, responsive, and visually rich frontend for a Gemini-style conversational AI chat application. Built to mimic real-world AI chat platforms like Google Gemini, this project demonstrates advanced frontend development using React, with modern UX features, OTP-based authentication, and simulated AI messaging.

---

## 🎯 Objective

This project is part of a full-stack assignment to test practical skills in:

- **Component-based architecture**
- **React + Zod + React Hook Form**
- **Client-side state management (Redux)**
- **Responsive and accessible UI**
- **Form validation and user experience optimization**

---

## 🚀 Core Features

### 🔐 Authentication

- OTP-based Login/Signup flow using country codes
- Country dial codes fetched via `restcountries.com` API
- OTP generation and validation simulated using `setTimeout`
- Form validation powered by `React Hook Form + Zod`

### 📋 Dashboard

- List of user's chatrooms
- Create/Delete chatrooms with confirmation via Toast notifications
- Debounced search bar for filtering chatrooms by title
- Persist chatroom data via `localStorage`

### 💬 Chatroom Interface

- Chat UI with:
  - User and fake AI messages
  - Timestamps
  - Typing indicator ("Gemini is typing...")
  - Simulated AI response delay (throttling)
- Features:
  - Auto-scroll to latest message
  - Reverse infinite scroll (dummy data)
  - Client-side pagination (e.g., 20 messages per page)
  - Image upload support (preview via base64/URL)
  - Copy-to-clipboard on hover

### 🌐 Global UX

- Fully mobile responsive layout (Tailwind CSS)
- LocalStorage support for auth and messages
- Keyboard accessibility for all primary interactions
- Toast notifications for all key actions

---

## 🧰 Tech Stack

| Layer            | Tool/Library          |
| ---------------- | --------------------- |
| Frontend         | React.js              |
| Styling          | Tailwind CSS          |
| Form Handling    | React Hook Form + Zod |
| Icons            | React Icons           |
| API Integration  | Axios                 |
| State Management | Redux Toolkit         |
| UX               | React Toastify        |

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/luckysharma1999/gemini-frontend-clone.git
cd gemini-frontend-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variable

Create a `.env` file in the root directory:

```
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

> _(If API is simulated, you can skip this step.)_

### 4. Start the development server

```bash
npm run dev
```

Now open your browser at `http://localhost:5173`.

---

## 🔮 Future Enhancements

- Real backend integration (Node.js, Firebase, etc.)
- JWT authentication and session expiration
- AI-powered message replies (Google Gemini API)
- Multi-user chatrooms or group conversations
- Dark mode toggle

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Credits

Developed by [Lucky Sharma](https://github.com/luckysharma1999)

Inspired by:

- Google's Gemini AI chat interface
- UI/UX principles from ChatGPT and Gemini

---

## 📬 Contact

For issues, ideas, or collaboration, feel free to open an issue or connect via GitHub.

---

## 🧠 Redux Slices Overview

This project uses **Redux Toolkit** to manage application-wide state through modular "slices" — making the app easier to scale, debug, and maintain.

---

### 🔐 `authSlice` – Authentication State

Manages everything related to user login and session status:

- **Stores** whether the user is authenticated (`isAuthenticated`) and their details (`user`)
- **Persists** login state in `localStorage` to survive page refreshes
- Provides actions like:
  - `loginSuccess(userData)` – Logs the user in and stores their data
  - `logout()` – Logs the user out and clears data
  - `loadUserFromStorage()` – Loads existing session from `localStorage` when app initializes

> This ensures users stay logged in even after refreshing or reopening the app.

---

### 💬 `chatSlice` – Chatrooms & Messages

Handles the user's chatroom data and messages:

- **Tracks** all chatrooms, selected chatroom, and their messages
- **Supports** creating, selecting, and deleting chatrooms
- **Stores messages**, paginates them, and simulates infinite scrolling
- Provides actions like:
  - `addChatroom(title)` – Creates a new chatroom
  - `deleteChatroom(id)` – Deletes an existing chatroom
  - `addMessage(chatroomId, message)` – Adds a new user or AI message
  - `loadMessages(chatroomId)` – Loads older messages (simulated)

> This modular design keeps your UI reactive and your logic organized.
