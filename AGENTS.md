# AGENTS.md

## Commands

- `npm install` - Install dependencies and generate API client (runs postinstall hook)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run apispec` - Regenerate API client from TypeSpec definitions
- No test commands configured - check with user for testing strategy

## API Specification

The API client (`@cosmic-dolphin/api`) is generated from TypeSpec definitions located in `packages/apispec/`.

### Structure

- `packages/apispec/*.tsp` - TypeSpec definition files (source of truth)
- `packages/apispec/tspconfig.yaml` - TypeSpec compiler config
- `packages/apispec/client/` - Generated TypeScript client (auto-generated, do not edit)

### Regenerating the Client

When you modify the TypeSpec files, run:

```bash
npm run apispec
```

This will:
1. Compile TypeSpec to OpenAPI spec
2. Generate TypeScript client from OpenAPI
3. Build the client package

The client is automatically regenerated during `npm install` via the postinstall hook.

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
