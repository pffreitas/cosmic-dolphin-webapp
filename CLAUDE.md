# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

NEVER use `npm run dev` or `npm start` to test your changes. Use only `npm run build`

## Architecture Overview

This is a Next.js 14 application using the App Router with TypeScript, built on a Supabase + Next.js starter template. The application is a note-taking and knowledge management tool called "Cosmic Dolphin."

### Key Technologies

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database/Auth**: Supabase (authentication, database)
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Rich Text Editor**: TipTap with custom extensions
- **API Integration**: Custom API package (@cosmic-dolphin/api)

### Architecture Patterns

#### Route Structure

- `app/(auth-pages)/` - Authentication flows (sign-in, sign-up, password reset)
- `app/(private)/` - Protected user pages (dashboard, library, profile)
- `app/notes/` - Note viewing and editing pages
- Public routes at root level

#### State Management

- Redux store configured with notesSlice at `lib/store/`
- Custom hooks in `lib/store/hooks.ts` for typed dispatch/selector
- ReduxProvider wraps the entire app at root layout level

#### Repository Pattern

- Data access layer in `lib/repository/` with base configuration
- Separate repositories for different domains (notes, knowledge, pipeline)
- API integration through @cosmic-dolphin/api package

#### Component Architecture

- UI components in `components/ui/` following shadcn/ui patterns
- Feature-specific components organized by domain (chat/, editor/, sidebar/)
- Custom TipTap editor (CosmicEditor) with keyboard shortcuts (Mod+Enter for submit)

#### Authentication Flow

- Supabase auth with middleware for session management
- Protected routes handled via middleware.ts
- Auth helpers for React components and server-side operations

### Key Components

#### CosmicEditor (`components/editor/CosmicEditor.tsx`)

- Custom TipTap editor with markdown support and image handling
- Keyboard shortcuts: Mod+Enter (submit), Mod+Y (insert test image)
- Integrates with marked.js for markdown processing

#### ChatBox (`components/chat/chat-box.tsx`)

- Main interface for creating new notes from prompts
- Creates notes via Redux actions and navigates to note detail page
- Uses CosmicEditor for rich text input

#### Redux Notes Slice (`lib/store/slices/notesSlice.ts`)

- Manages note creation, updates, and pending prompts
- Handles async actions for API interactions
- Integrates with @cosmic-dolphin/api for note operations

### Environment Configuration

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_API_URL` - Cosmic Dolphin API base URL

### Development Notes

- Uses font imports for Karla and Noto Sans families
- Theme provider supports light/dark mode switching
- Middleware handles all routes except static assets and images
- Repository base.ts expects API_BASE_URL from environment
