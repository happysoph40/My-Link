# MyLink Project Guide

This project is a link-in-bio service that allows users to aggregate their social media, website, and blog links into a single shared URL.

## 🚀 Project Overview

*   **Goal**: An integrated link-sharing service for creators, influencers, and entrepreneurs.
*   **Key Features**:
    *   Google Social Login (Firebase Auth)
    *   Personalized Profile Pages (`domain.com/nickname`)
    *   Inline Editing for profile and link management in the dashboard
    *   Automatic Favicon Fetching for links via Google API
    *   Mobile-optimized and responsive layout

## 🛠 Tech Stack

*   **Framework**: Next.js (v16.1.7, App Router)
*   **Language**: TypeScript
*   **UI/UX**: Base UI (@base-ui/react), Lucide React, Sonner (Toasts)
*   **Styling**: Tailwind CSS (v4)
*   **Backend/Auth**: Firebase (Auth, Firestore)

## 📁 Key Directory Structure

*   `app/`: Next.js App Router pages and layouts
*   `components/`: Shared components and `shadcn/ui` components
*   `hooks/`: Custom React hooks (e.g., `useAuth`)
*   `lib/`: Utility functions and configurations (e.g., Firebase initialization)
*   `.docs/`: Planning documents (PRD, User Scenarios, Wireframes)

## 💻 Key Commands

*   **Dev Server**: `npm run dev`
*   **Build**: `npm run build`
*   **Lint**: `npm run lint`
*   **Format**: `npm run format`
*   **Type Check**: `npm run typecheck`
*   **Add UI Component**: `npx shadcn@latest add [component-name]`

## 📏 Development Rules & Conventions

1.  **UI Components**: Use **Base UI (@base-ui/react)** as the primary design system. Tailored with Tailwind CSS for premium aesthetics.
2.  **Editing Mode**: Use **Inline Editing** for all dashboard updates. Save on `Enter` or `Focus Out` without a separate save button.
3.  **Database Structure**:
    *   `users` collection: User profiles (`uid`, `email`, `displayName`, `username`, `bio`)
    *   `users/{uid}/links` sub-collection: Individual links (`title`, `url`, `faviconUrl`, `order`)
4.  **User Identity**: Upon signup, use the ID part of the Gmail address as the initial `displayName` (URL slug).
5.  **Images**: No manual image uploads. Use the Google Favicon API for link icons.
6.  **Documentation**: All plans, tasks, and walkthroughs must be written in **Korean** (한글).

## 🗄 Data Model (TypeScript)

```typescript
// User Document [Collection: users]
interface User {
  uid: string;
  email: string;
  displayName: string; // URL Slug
  username: string;    // Display Name
  bio: string;
  createdAt: Timestamp;
}

// Link Document [Subcollection: users/{uid}/links]
interface Link {
  id: string;
  title: string;
  url: string;
  faviconUrl: string;
  order: number;
  createdAt: Timestamp;
}
```
