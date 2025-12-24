# Agnos Candidate Assignment: Patient Form & Staff View

Live Demo: [https://agnos-frontend-henna.vercel.app/](https://agnos-frontend-henna.vercel.app/)

This project is a real-time synchronized application comprising a **Patient Form** for data entry and a **Staff View** for monitoring submissions. It demonstrates modern web development practices using **Next.js 15**, **Tailwind CSS**, and **Pusher** for WebSocket-based updates.

## 🚀 Features

- **Patient Form**:
  - Responsive input form with robust validation using **Zod** and **React Hook Form**.
  - User-friendly interface for collecting personal details, contact info, and preferences.
- **Staff View Dashboard**:
  - **Real-time Synchronization**: Instantly reflects changes from the Patient Form as they happen (typing status, form submission).
  - **Live Status Indicators**: Visual cues for active filling and submission states.
- **Architecture**:
  - Event-driven architecture using Pusher Channels to broadcast updates from Server-to-Client instantly without polling.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Beta)
- **Real-time Engine**: [Pusher Channels](https://pusher.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚠️ Data Persistence Disclaimer

**Note:** This is a frontend demonstration focused on UX and Real-time capabilities.

- Data submitted is processed for real-time display but **is not currently persisted** to a permanent database.
- Refreshing the Staff View page may reset the list of submissions.

## 📦 Prerequisites

Before running locally, ensure you have:

- Node.js 20+ installed.
- A [Pusher](https://pusher.com/) account (for API Keys).

## 💻 Getting Started

1.  **Clone the repository** and install dependencies:

    ```bash
    git clone [your-repo-link]
    cd [your-repo-name]
    npm install
    ```

2.  **Environment Configuration**:

    Create a `.env.local` file in the root directory and add your Pusher credentials:

    ```env
    PUSHER_APP_ID="your_app_id"
    NEXT_PUBLIC_PUSHER_KEY="your_app_key"
    PUSHER_SECRET="your_app_secret"
    NEXT_PUBLIC_PUSHER_CLUSTER="your_app_cluster"
    ```

3.  **Run the Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📖 Usage Guide

To test the real-time functionality locally:

1.  Open `http://localhost:3000/staff-view` in one window (Staff Dashboard).
2.  Open `http://localhost:3000/patient-form` in a **separate window or incognito tab** (Patient Input).
3.  Start typing in the Patient Form and watch the Staff View update instantly!

## 📂 Project Structure

```text
├── app/
│   ├── patient-form/    # Patient input page logic
│   ├── staff-view/      # Staff dashboard with real-time listeners
│   └── api/pusher/      # API Route for triggering Pusher events
├── components/          # Reusable UI components
├── lib/
│   └── pusher.ts        # Pusher instance configuration
└── public/              # Static assets
```
