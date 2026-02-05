# WikiHub - Frontend

Modern, collaborative team wiki frontend built with React, TypeScript, and Redux Toolkit, featuring real-time collaboration and a beautiful UI.

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Fast build tool
- **Redux Toolkit** - State management
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time features
- **React Hook Form + Zod** - Form validation
- **Lucide React** - Icons
- **React Markdown** - Markdown rendering

## Features

- 🔐 **Authentication** - Login, registration, email verification
- 👥 **Workspace Management** - Create and switch between workspaces
- 📁 **Folder Tree Navigation** - Hierarchical organization
- ✍️ **Markdown Editor** - Split-view editor with live preview
- 📝 **Version History** - View and compare page versions
- 💬 **Real-time Comments** - Threaded discussions
- 📎 **File Attachments** - Upload and manage files
- ⭐ **Favorites** - Quick access to important pages
- 🔍 **Search** - Full-text search across pages
- 🔔 **Activity Feed** - Track workspace changes
- ⚡ **Live Collaboration** - Real-time presence indicators

## Quick Start

### Prerequisites
- Node.js 18+
- Backend API running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` to access the application.

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API service functions
│   ├── components/       # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── ConfirmationModal.tsx
│   ├── layouts/          # Layout components
│   │   ├── AppLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── providers/        # Context providers
│   │   └── AuthContext.tsx
│   ├── router/           # Route configuration
│   ├── store/            # Redux store and slices
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── workspaceSlice.ts
│   │       └── editorSlice.ts
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── features/
│   ├── auth/             # Authentication pages
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── VerifyEmailPage.tsx
│   ├── dashboard/        # Dashboard pages
│   │   └── pages/
│   │       └── WorkspacesPage.tsx
│   └── wiki/             # Wiki feature
│       ├── components/
│       │   ├── FolderTree.tsx
│       │   ├── PageList.tsx
│       │   ├── MarkdownEditor.tsx
│       │   ├── CommentList.tsx
│       │   └── AttachmentGallery.tsx
│       └── pages/
│           ├── WikiHomePage.tsx
│           ├── PageViewPage.tsx
│           ├── PageEditorPage.tsx
│           ├── VersionHistoryPage.tsx
│           └── ActivityFeedPage.tsx
└── main.tsx              # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Implementation

### State Management
- Redux Toolkit for global state
- Slices for auth, workspace, and editor state
- Typed hooks (`useAppDispatch`, `useAppSelector`)

### Real-time Collaboration
- Socket.IO client integration
- Presence indicators showing active users
- Live updates for pages, comments, and activities

### Routing
- React Router v7 with nested routes
- Protected routes requiring authentication
- Workspace-scoped routes

### Form Handling
- React Hook Form for form management
- Zod schema validation
- Type-safe form inputs

## UI Components

All components follow a consistent design system:
- **Colors**: Primary (purple), slate for neutrals
- **Typography**: Bold headings, medium body text
- **Spacing**: Consistent padding and margins
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design

## API Integration

All API calls are centralized in `src/app/api/`:
- `auth.api.ts` - Authentication
- `workspace.api.ts` - Workspace management
- `page.api.ts` - Page operations
- `folder.api.ts` - Folder operations
- `comment.api.ts` - Comments
- `attachment.api.ts` - File uploads
- `activity.api.ts` - Activity feed


