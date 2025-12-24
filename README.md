# Agnos Candidate Assignment: Patient Form & Staff View

This project is a real-time synchronized application comprising a **Patient Form** for data entry and a **Staff View** for monitoring submissions. It is built with **Next.js 16**, **Tailwind CSS 4**, and **Pusher** for WebSocket-based updates.

## Features

- **Patient Form**:
  - Responsive input form with validation (Zod + React Hook Form).
  - Collects personal details, contact info, and preferences.
- **Staff View**:
  - Real-time updates as patients type or submit data.
  - Status indicators for active filling and submission state.
- **Real-Time Synchronization**:
  - Instantly reflects changes from the Patient Form to the Staff View using Pusher Channels.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Real-time**: [Pusher](https://pusher.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

- Node.js 18+ installed.
- A [Pusher](https://pusher.com/) account (Channels).

## Getting Started

1.  **Clone the repository** (if applicable) and install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Environment Configuration**:

    Create a `.env.local` file in the root directory and add your Pusher credentials:

    ```env
    PUSHER_APP_ID="your_app_id"
    NEXT_PUBLIC_PUSHER_KEY="your_app_key"
    PUSHER_SECRET="your_app_secret"
    NEXT_PUBLIC_PUSHER_CLUSTER="your_app_cluster"
    ```

    > **Note**: These keys can be found in your Pusher Dashboard under App Keys.

3.  **Run the Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

- **Patient Form**: Navigate to `http://localhost:3000/patient-form` to access the input form.
- **Staff View**: Open `http://localhost:3000/staff-view` in a separate window or tab to monitor real-time updates.

## Project Structure

- `app/patient-form`: Contains the page and logic for the patient input form.
- `app/staff-view`: Contains the real-time dashboard for staff members.
- `lib/pusher.ts`: Pusher configuration and server instance.
