# 🏫 BETA Digital Hub — Frontend

<div align="center">

### A modern, responsive React application for BETA's digital platform

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Axios** — providing a seamless interface for event management, team directories, alumni records, global search, and AI assistance.

[![Live Application](https://img.shields.io/badge/Live-Application-brightgreen?style=for-the-badge&logo=netlify)](https://beta-hub.netlify.app)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

🔗 **Live URL:** [`https://beta-hub.netlify.app`](https://beta-hub.netlify.app)  
📦 **Backend Repo:** [github.com/Sujit9911/BETA_HUB_BE](https://github.com/Sujit9911/BETA_HUB_BE)  
🎨 **Frontend Repo:** [github.com/Sujit9911/BETA_HUB_FE](https://github.com/Sujit9911/BETA_HUB_FE)

</div>

---

## 📖 Overview

BETA Digital Hub's frontend is the user-facing application for the **Bench for Electronics and Telecommunication Association (BETA) at MMCOE, Pune**. 

The application provides a centralized, modern platform for students, members, and administrators to access and manage BETA activities, including events, team records, alumni directories, notices, alerts, document templates, and an intelligent AI assistant powered by Google Gemini.

Built with performance, accessibility, and user experience as core priorities, the frontend integrates seamlessly with the Spring Boot backend through secure REST APIs and provides role-based interfaces tailored for both members and administrators.

---

## ✨ Key Features

### 🔐 Authentication & Security
- User registration and login with email validation
- JWT-based stateless authentication
- Persistent authentication state across sessions
- Protected routes and API endpoints
- Automatic session recovery
- BCrypt password hashing (server-side)

### 👮 Role-Based Access Control
- **Member Dashboard** — Access to core platform features
- **Admin Dashboard** — Administrative management interfaces
- Role-based UI rendering and access control
- Protected administrative actions

### 📅 Event Management
- View upcoming and past events with filtering
- Browse events by category
- View detailed event information with images and documents
- Event image galleries with Cloudinary integration
- Download event documents
- **Admin:** Create, edit, and delete events
- **Admin:** Upload and manage event media

### 👥 Team Directory
- Browse BETA core committee members
- View team records by academic year
- Team member details and positions
- Historical team records
- **Admin:** Manage team members and positions
- **Admin:** Add and update team records

### 🎓 Alumni Directory
- Browse comprehensive alumni profiles
- Advanced filtering by batch, domain, and company
- Search alumni by name and details
- Alumni profile information and contact
- **Admin:** Manage alumni records
- **Admin:** Add and update alumni profiles

### 📢 Notices & Announcements
- View all platform notices and announcements
- Pinned notices for important information
- Notice details and timestamps
- **Admin:** Create and publish notices
- **Admin:** Pin/unpin notices for visibility

### 🔔 Alerts & Notifications
- Real-time notification system
- Unread notification count tracking
- View all alerts and announcements
- Mark individual alerts as read
- Mark all alerts as read in one action
- Optional Google Meet link for alerts
- **Admin:** Broadcast notifications to all users
- **Admin:** Create alerts with meeting links

### 📄 Document Templates
- Access reusable document templates (proposals, letters, certificates)
- Download and preview templates
- Browse template library
- **Admin:** Upload and manage document templates
- **Admin:** Organize templates by category

### 🔍 Global Search
- Unified search across multiple modules
- Search events, team members, alumni, notices, and templates
- Real-time search results
- Filter and refine search results
- Cross-module discovery

### 🤖 Ask BETA — AI Assistant
- Intelligent AI assistant powered by Google Gemini
- Context-aware responses about BETA and the platform
- Integration with platform data
- Chat interface with conversation history
- Real-time streaming responses

### 🎨 Theme System
- Light and dark mode support
- System-level theme detection
- User theme preference persistence
- Smooth theme transitions
- Tailwind CSS-powered styling

### 📱 Responsive Design
- Mobile-first design approach
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly interface elements
- Adaptive navigation and layout
- Performance-optimized for all devices

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | React | 18+ |
| **Build Tool** | Vite | Latest |
| **Styling** | Tailwind CSS | 3+ |
| **HTTP Client** | Axios | Latest |
| **State Management** | React Context API | Built-in |
| **Routing** | React Router | 6+ |
| **Authentication** | JWT (Bearer tokens) | — |
| **API Integration** | REST APIs | OpenAPI |
| **Package Manager** | npm | 9+ |
| **Backend** | Spring Boot 4, Java 17 | — |
| **Database** | PostgreSQL | — |
| **Deployment** | Netlify | — |

### External Services
- **Backend API:** Spring Boot REST API at `https://beta-hub-be.onrender.com/api/v1`
- **Media Storage:** Cloudinary (images and documents)
- **AI Integration:** Google Gemini via Spring AI
- **Email Service:** Brevo API (backend)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **npm** 9 or higher
- **Git**
- Backend API running (see [BETA_HUB_BE](https://github.com/Sujit9911/BETA_HUB_BE))


### Session Persistence

The `AuthContext` automatically restores the user's session on page reload by:
1. Checking for stored JWT token
2. Validating token with backend
3. Restoring user authentication state

---

## 👮 Role-Based Access

The application supports two primary user roles:

### MEMBER
- View events and event details
- Browse team information
- Access alumni directory
- Read notices
- View alerts and notifications
- Use global search
- Chat with Ask BETA AI
- Access available document templates

### ADMIN
**All member features plus:**
- Create, edit, and delete events
- Upload and manage event media
- Manage team records and positions
- Manage alumni profiles
- Create and manage notices
- Broadcast alerts to all users
- Manage document templates
- Access admin dashboard with analytics


## 🎨 Styling & Theme System

The application uses **Tailwind CSS** for styling with a custom theme system supporting light and dark modes.

### Theme Features

- **Light Mode:** Clean, bright interface for daytime usage
- **Dark Mode:** Dark interface for low-light environments
- **System Detection:** Automatically detects system theme preference
- **User Persistence:** Remembers user's theme selection
- **Smooth Transitions:** CSS transitions for mode switching

--

## 🚀 Deployment

### Netlify Deployment

The frontend is deployed on **Netlify** with automatic deployments from the GitHub repository.

**Production URL:** [`https://beta-hub.netlify.app`](https://beta-hub.netlify.app)


---

## 🔒 Security Best Practices

- **JWT Authentication:** Stateless, secure token-based auth
- **Protected Routes:** Private routes require authentication
- **HTTPS Communication:** All production traffic encrypted
- **No Plaintext Secrets:** Sensitive data in environment variables
- **CORS Configuration:** Backend configured for frontend domain
- **Secure Token Storage:** Tokens stored securely
- **Input Validation:** Client-side form validation
- **XSS Prevention:** React automatically escapes JSX content


---

## 📦 Dependencies

Key dependencies and their purposes:

| Package | Purpose |
|---|---|
| `react` | UI library |
| `react-dom` | DOM rendering |
| `react-router-dom` | Routing |
| `axios` | HTTP client |
| `tailwindcss` | Styling |
| `vite` | Build tool |


---

---

## 👨‍💻 Author

**Sujit Gawali**  
Java Full Stack Developer

Built BETA Digital Hub as a production-oriented full-stack platform covering:
- Frontend architecture and component design
- REST API integration with Spring Boot backend
- JWT-based authentication and security
- Role-based access control and interfaces
- Responsive and accessible UI design
- Cloud service integration (Cloudinary, Gemini)
- Deployment and DevOps

### Contact & Links

- **GitHub:** [github.com/Sujit9911](https://github.com/Sujit9911)
- **LinkedIn:** [linkedin.com/in/sujitgawali451](https://linkedin.com/in/sujitgawali451)

---

## 🌟 Support

If you find this project useful, please consider:
- Giving the repository a ⭐
- Sharing the project
- Providing feedback and suggestions
- Contributing to improvements

---

## 📞 Support Links

- **Live Application:** [beta-hub.netlify.app](https://beta-hub.netlify.app)
- **Frontend Repository:** [github.com/Sujit9911/BETA_HUB_FE](https://github.com/Sujit9911/BETA_HUB_FE)
- **Backend Repository:** [github.com/Sujit9911/BETA_HUB_BE](https://github.com/Sujit9911/BETA_HUB_BE)
- **Backend API:** [beta-hub-be.onrender.com](https://beta-hub-be.onrender.com)

---

<div align="center">

Made with ❤️ for BETA Digital Hub

</div>
