# AGENTS.md

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- No test commands configured - check with user for testing strategy

## Code Style Guidelines

### Imports & Organization

- Use `"use client"` directive for client components
- Import order: external libs, internal components (@/), relative imports
- Use path alias `@/` for root-level imports (configured in tsconfig.json)
- Prefer named exports over default exports for utilities

### TypeScript & Types

- Strict TypeScript enabled - all files must be properly typed
- Use interfaces for component props (e.g., `ChatBoxProps`)
- Leverage types from `@cosmic-dolphin/api` package for domain models
- Use proper typing for async thunks and Redux state

### Component & File Conventions

- Use PascalCase for component files and functions
- Functional components with TypeScript interfaces for props
- Use `React.forwardRef` for components that need ref forwarding
- File structure: `/components/domain/component-name.tsx`

### Styling & UI

- Tailwind CSS with shadcn/ui component library
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Class variance authority (cva) for component variants
- Responsive design with mobile-first approach
