# Architecture Patterns

**Complete definition of architecture, layers, dependencies, and project patterns.**

---

## 1. Architecture Choice

### Architectural Pattern: Screaming Architecture + Atomic Design

**Screaming Architecture** (proposed by Robert C. Martin) is an approach where the project structure "screams" its business purpose, not the tools or frameworks it uses.

**Atomic Design** (proposed by Brad Frost) is a design system that organizes UI components in hierarchical levels of complexity.

### Why was it chosen?

1. **Domain clarity**: When opening the project, you immediately see what the business is about (auth, users, projects), not the technologies (controllers, models, views)

2. **Feature scalability**: Each domain is independent and can grow without affecting others

3. **Clear separation**: Business logic (domains) vs reusable UI (components) vs infrastructure (lib)

4. **Maintainability**: Everything related to a feature is in one place

5. **React Server Components compatibility**: Architecture perfectly adapts to Next.js 15 with RSC paradigm

---

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP                         │
│                     (Routing & Pages)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   DOMAINS (Business)      │   │   COMPONENTS (UI)         │
│                           │   │                           │
│  ┌─────────────────────┐ │   │  ┌─────────────────────┐ │
│  │ auth/               │ │   │  │ ui/    (shadcn)     │ │
│  │ ├── components/     │ │   │  │ atoms/              │ │
│  │ ├── hooks/          │ │   │  │ molecules/          │ │
│  │ ├── stores/         │ │   │  │ organisms/          │ │
│  │ ├── actions.ts      │ │   │  │ layout/             │ │
│  │ ├── schema.ts       │ │   │  └─────────────────────┘ │
│  │ └── types.ts        │ │   │                           │
│  └─────────────────────┘ │   └───────────────────────────┘
│                           │                 │
│  ┌─────────────────────┐ │                 │
│  │ users/              │ │                 │
│  │ └── ...             │ │                 │
│  └─────────────────────┘ │                 │
└───────────────────────────┘                 │
                │                             │
                └──────────┬──────────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │   LIB (Infrastructure)   │
            │   ├── auth.ts            │
            │   ├── db.ts              │
            │   └── middleware.ts      │
            └──────────────────────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │   UTILS (Pure Functions) │
            │   ├── format-date.ts     │
            │   ├── validate-email.ts  │
            │   └── class-names.ts     │
            └──────────────────────────┘
```

---

## 2. Layer Definitions

### Layer 1: App (Next.js Routing)

**Responsibility**:

- Define application routes
- Layouts and page templates
- API Routes
- Routing middleware

**Contains**:

- `page.tsx`: Route pages
- `layout.tsx`: Shared layouts
- `loading.tsx`: Loading states
- `error.tsx`: Error handling
- `route.ts`: API route handlers
- Route groups: `(auth)`, `(dashboard)`

**File examples**:

```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Home page
├── (auth)/
│   ├── login/page.tsx        # Login page
│   └── register/page.tsx     # Register page
├── dashboard/
│   ├── layout.tsx            # Dashboard layout
│   ├── page.tsx              # Dashboard home
│   └── settings/page.tsx     # Settings page
└── api/
    └── users/route.ts        # API endpoint
```

**Rules**:

- ✅ Can import from: `domains/`, `components/`, `lib/`
- ❌ MUST NOT contain: Business logic, complex validations
- 📋 Responsibility: Only orchestrate components and do basic fetching

---

### Layer 2: Domains (Business Logic)

**Responsibility**:

- Encapsulate all business logic per feature
- Server Actions (mutations)
- Validations and schemas
- Domain-specific hooks
- Domain-specific state (Zustand stores)
- Domain-specific components

**Contains**:

- `components/`: Domain-specific UI components
- `hooks/`: Custom domain hooks
- `stores/`: Domain Zustand stores
- `actions.ts`: Server Actions (create, update, delete)
- `schema.ts`: Zod validations
- `types.ts`: TypeScript domain types

**File examples**:

```
domains/
├── auth/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── auth-button.tsx
│   │   └── molecules/
│   │       └── login-form.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-session-check.ts
│   ├── stores/
│   │   └── auth-store.ts
│   ├── actions.ts             # loginAction, logoutAction
│   ├── schema.ts              # loginSchema, registerSchema
│   └── types.ts               # AuthUser, LoginCredentials
│
└── users/
    ├── components/
    │   └── organisms/
    │       └── user-profile-card.tsx
    ├── hooks/
    │   └── use-user-permissions.ts
    ├── stores/
    │   └── user-store.ts
    ├── actions.ts             # createUser, updateUser
    ├── schema.ts              # userSchema
    └── types.ts               # User, UserProfile
```

**Rules**:

- ✅ Can import from: `components/` (global UI), `lib/`, `utils/`
- ❌ MUST NOT import from: other `domains/` (see `ddd-domain-structure.md` Cross-Domain Isolation). Share contracts via `lib/`; compose several domains only in `app/`
- ❌ MUST NOT import from: `app/`
- 📋 Responsibility: Contain ALL logic related to the feature

---

### Layer 3: Components (Reusable UI)

**Responsibility**:

- Reusable UI components without business logic
- shadcn/ui components
- Atomic Design: atoms, molecules, organisms
- Shared layouts

**Contains**:

- `ui/`: shadcn/ui components
- `atoms/`: Atomic components (button, input, icon)
- `molecules/`: Composition of atoms (search-bar, form-field)
- `organisms/`: Composition of molecules (header, data-table)
- `layout/`: Shared layouts (main-layout, sidebar)

**File examples**:

```
components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── dropdown-menu.tsx
│
├── atoms/                     # Atomic components
│   ├── icon-button.tsx
│   ├── logo.tsx
│   └── badge.tsx
│
├── molecules/                 # Composition of atoms
│   ├── search-bar.tsx
│   ├── form-field.tsx
│   └── user-avatar.tsx
│
├── organisms/                 # Composition of molecules
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── data-table.tsx
│   └── navigation-menu.tsx
│
└── layout/                    # Shared layouts
    ├── main-layout.tsx
    ├── auth-layout.tsx
    └── dashboard-layout.tsx
```

**Rules**:

- ✅ Can import from: `components/` (other components), `lib/`, `utils/`
- ❌ MUST NOT import from: `domains/`, `app/`
- ❌ MUST NOT contain: Business logic, Server Actions, validations
- 📋 Responsibility: Only visual presentation and generic UI behavior

---

### Layer 4: Lib (Infrastructure)

**Responsibility**:

- External tool configuration
- Database clients
- Authentication configuration
- Global middlewares
- Initializations

**Contains**:

- NextAuth configuration
- Database client (Prisma, Drizzle)
- Shared middlewares
- External API configuration

**File examples**:

```
lib/
├── auth.ts                    # NextAuth configuration
├── db.ts                      # Database client
├── middleware.ts              # Shared middleware functions
├── api-client.ts              # External API client
└── types.ts                   # Global shared types
```

**Rules**:

- ✅ Can import from: `utils/`
- ❌ MUST NOT import from: `domains/`, `components/`, `app/`
- 📋 Responsibility: Low-level infrastructure and configuration

---

### Layer 5: Utils (Pure Functions)

**Responsibility**:

- Pure functions without side effects
- Utilities shared across the application
- Formatting, validation, transformation helpers

**Contains**:

- Formatting functions (dates, numbers, strings)
- Simple validators
- CSS helpers
- Data transformers

**File examples**:

```
utils/
├── format-date.ts             # formatDate(), formatRelativeTime()
├── validate-email.ts          # isValidEmail()
├── class-names.ts             # cn() to combine classes
├── debounce.ts                # debounce(), throttle()
└── capitalize.ts              # capitalize(), slugify()
```

**Rules**:

- ❌ CANNOT import from: Any other layer
- ✅ Can be imported by: All layers
- 📋 Responsibility: Pure and reusable functions

---

### Layer 6: Config (Configuration)

**Responsibility**:

- Global application configurations
- Metadata, SEO
- Hardcoded texts (i18n future)
- Application constants

**Contains**:

```
config/
├── site.ts                    # Site metadata, SEO, titles
└── messages.ts                # Hardcoded UI text strings
```

**Rules**:

- ❌ CANNOT import from: Any other layer (except types from `lib/`)
- ✅ Can be imported by: All layers
- 📋 Responsibility: Static configurations

---

### Layer 7: Styles (Styles)

**Responsibility**:

- Reusable CSS styles
- Extracted styles with @apply
- CSS utilities

**Contains**:

```
styles/
├── main.css                   # Global styles, Tailwind base
├── components/                # Component-specific styles
│   ├── atoms/
│   │   ├── button.css
│   │   └── input.css
│   ├── molecules/
│   └── organisms/
└── domains/                   # Domain-specific styles
    └── auth/
        └── login-form.css
```

**Rules**:

- ❌ DOES NOT contain: JavaScript logic
- 📋 Responsibility: Only visual styles

---

## 3. Dependency Rules (CRITICAL)

### Dependency Diagram

```
┌─────────────────────────────────────────────────────────┐
│                         APP                             │
│                    (can import)                         │
│                           ↓                             │
│              domains, components, lib                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       DOMAINS                           │
│                    (can import)                         │
│                           ↓                             │
│              components, lib, utils                     │
│            (other domains with caution)                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     COMPONENTS                          │
│                    (can import)                         │
│                           ↓                             │
│              other components, lib, utils               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                         LIB                             │
│                    (can import)                         │
│                           ↓                             │
│                        utils                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                        UTILS                            │
│                  (CANNOT import)                        │
│                           ↓                             │
│                     NOTHING (pure)                      │
└─────────────────────────────────────────────────────────┘
```

---

### Dependency Matrix

| From ↓ / To →  | app | domains | components | lib | utils | config |
| -------------- | --- | ------- | ---------- | --- | ----- | ------ |
| **app**        | ✅  | ✅      | ✅         | ✅  | ✅    | ✅     |
| **domains**    | ❌  | ⚠️      | ✅         | ✅  | ✅    | ✅     |
| **components** | ❌  | ❌      | ✅         | ✅  | ✅    | ✅     |
| **lib**        | ❌  | ❌      | ❌         | ✅  | ✅    | ✅     |
| **utils**      | ❌  | ❌      | ❌         | ❌  | ✅    | ✅     |
| **config**     | ❌  | ❌      | ❌         | ❌  | ❌    | ✅     |

**Legend**:

- ✅ = Allowed
- ❌ = Forbidden
- ⚠️ = Allowed with caution (avoid circular dependencies)

---

### Explicit Rules

#### ✅ ALLOWED

```tsx
// ✅ App can import from domains
// app/dashboard/page.tsx
import { UserProfile } from '@/domains/users/components/organisms/user-profile';

// ✅ App can import from components
// app/layout.tsx
import { Header } from '@/components/layout/header';

// ✅ Domains can import from components
// domains/auth/components/molecules/login-form.tsx
import { Button } from '@/components/ui/button';

// ✅ Domains can import from lib
// domains/users/actions.ts
import { db } from '@/lib/db';

// ✅ Components can import from utils
// components/ui/button.tsx
import { cn } from '@/utils/class-names';

// ✅ Lib can import from utils
// lib/auth.ts
import { formatDate } from '@/utils/format-date';

// ⚠️ Domain can import from another domain (with caution)
// domains/users/actions.ts
import { useAuth } from '@/domains/auth/hooks/use-auth';
```

---

#### ❌ FORBIDDEN

```tsx
// ❌ Components CANNOT import from domains
// components/organisms/header.tsx
import { useAuth } from '@/domains/auth/hooks/use-auth'; // ❌ FORBIDDEN

// ❌ Components CANNOT import from app
// components/ui/button.tsx
import { metadata } from '@/app/layout'; // ❌ FORBIDDEN

// ❌ Lib CANNOT import from domains
// lib/middleware.ts
import { loginAction } from '@/domains/auth/actions'; // ❌ FORBIDDEN

// ❌ Lib CANNOT import from components
// lib/db.ts
import { Button } from '@/components/ui/button'; // ❌ FORBIDDEN

// ❌ Utils CANNOT import from any upper layer
// utils/format-date.ts
import { db } from '@/lib/db'; // ❌ FORBIDDEN

// ❌ Domains CANNOT import from app
// domains/auth/actions.ts
import { metadata } from '@/app/layout'; // ❌ FORBIDDEN
```

---

### Why these rules?

1. **Unidirectionality**: Dependencies flow in one direction (top to bottom)
2. **Low coupling**: Lower layers don't know about upper layers
3. **Reusability**: Components and utils are reusable because they don't depend on business logic
4. **Testability**: Easy to test lower layers without complex dependencies
5. **Maintainability**: Changes in one layer don't break lower layers

---

## 4. Patterns and Practices

### 4.1 Server Actions Pattern (Replaces Repository)

In Next.js 15 with React Server Components, we don't use the traditional Repository pattern. Instead, we use **Server Actions** as the data access and mutation layer.

**Server Action = Repository + Service + Controller**

```tsx
// domains/users/actions.ts
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { userSchema } from './schema';

// ✅ Server Action combines validation + authorization + logic + persistence
export async function createUser(prevState: any, formData: FormData) {
  // 1. Authentication (like controller middleware)
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  // 2. Authorization (like controller guard)
  if (!session.user.roles.includes('admin')) {
    return { error: 'Forbidden' };
  }

  // 3. Validation (like DTO or schema)
  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  // 4. Business logic (like service)
  const { name, email } = validatedFields.data;

  try {
    // 5. Persistence (like repository)
    const user = await db.user.create({
      data: { name, email }
    });

    // 6. Cache invalidation
    revalidatePath('/users');

    return { success: true, user };
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}
```

**Why not traditional Repository?**

- Server Actions are already on the server
- No need to abstract data access (already abstracted by RSC)
- Reduces unnecessary boilerplate
- More direct and efficient

---

### 4.2 Custom Hooks Pattern (Replaces Service on Client)

For complex client-side logic, we use **custom hooks** instead of services.

```tsx
// domains/auth/hooks/use-auth.ts
import { useAuthStore } from '../stores/auth-store';
import { loginAction } from '../actions';

export function useAuth() {
  const { user, setUser } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    const result = await loginAction(credentials);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
}
```

**Usage in component**:

```tsx
// domains/auth/components/molecules/login-form.tsx
'use client';

import { useAuth } from '@/domains/auth/hooks/use-auth';

export function LoginForm() {
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    await login({ email, password });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### 4.3 State Management Strategy

Different types of state require different tools. We follow a **clear decision matrix** to choose the right tool for each use case.

#### State Management Decision Matrix

| State Type    | Tool            | When to Use                         | Example                        |
| ------------- | --------------- | ----------------------------------- | ------------------------------ |
| **Server**    | React Query     | Data from backend (fetched, cached) | User list, workouts, exercises |
| **Client/UI** | Zustand         | UI state, local preferences         | Sidebar open, theme, filters   |
| **Local**     | useState        | Component-only state                | Form input, modal open         |
| **Forms**     | React Hook Form | Complex forms with validation       | Multi-step forms, registration |

---

#### A. React Query for Server State

**Use for**: All data from backend APIs, databases, or external sources.

```tsx
// domains/workouts/hooks/use-workouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkouts, createWorkout, updateWorkout } from '../actions';

// ✅ Fetching data
export function useWorkouts(userId: string) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => getWorkouts(userId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

// ✅ Creating data
export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      // Automatic cache invalidation
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
    onError: error => {
      // Centralized error handling
      console.error('Failed to create workout:', error);
    }
  });
}

// ✅ Updating data with optimistic updates
export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkout,
    onMutate: async updatedWorkout => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['workouts'] });

      // Snapshot previous value
      const previousWorkouts = queryClient.getQueryData(['workouts']);

      // Optimistically update
      queryClient.setQueryData(['workouts'], old => {
        return old?.map(w => (w.id === updatedWorkout.id ? updatedWorkout : w));
      });

      return { previousWorkouts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['workouts'], context?.previousWorkouts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    }
  });
}
```

**Usage in component**:

```tsx
// domains/workouts/components/workout-list.tsx
'use client';

import { useWorkouts, useCreateWorkout } from '../hooks/use-workouts';

export function WorkoutList({ userId }: { userId: string }) {
  const { data: workouts, isLoading, error } = useWorkouts(userId);
  const createWorkout = useCreateWorkout();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  const handleCreate = async () => {
    await createWorkout.mutateAsync({ name: 'New Workout' });
  };

  return (
    <div>
      {workouts?.map(workout => (
        <div key={workout.id}>{workout.name}</div>
      ))}
      <button onClick={handleCreate}>Add Workout</button>
    </div>
  );
}
```

**Why React Query?**

- ✅ Automatic caching and background refetching
- ✅ Automatic loading and error states
- ✅ Optimistic updates
- ✅ Request deduplication
- ✅ Pagination and infinite scroll support
- ✅ Devtools for debugging

---

#### B. Zustand for Client/UI State

**Use for**: UI state, user preferences, local filters, sidebar state, theme, etc.

```tsx
// domains/ui/stores/sidebar-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

// ✅ Simple UI state store
export const useSidebarStore = create<SidebarStore>()(
  persist(
    set => ({
      isOpen: true,
      toggle: () => set(state => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false })
    }),
    {
      name: 'sidebar-storage' // localStorage key
    }
  )
);

// domains/ui/stores/theme-store.ts
interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    set => ({
      theme: 'system',
      setTheme: theme => set({ theme })
    }),
    {
      name: 'theme-storage'
    }
  )
);
```

**Usage in component**:

```tsx
// components/layout/sidebar.tsx
'use client';

import { useSidebarStore } from '@/domains/ui/stores/sidebar-store';

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <aside className={isOpen ? 'open' : 'closed'}>
      <button onClick={toggle}>Toggle Sidebar</button>
      {/* Sidebar content */}
    </aside>
  );
}
```

**Why Zustand for UI state?**

- ✅ No provider needed
- ✅ Simple and lightweight
- ✅ Compatible with RSC
- ✅ Built-in persistence middleware
- ✅ No boilerplate

**Important**: Never use Zustand for backend data. Use React Query instead.

---

#### C. useState for Local Component State

**Use for**: State that only belongs to a single component and doesn't need to be shared.

```tsx
// components/molecules/search-bar.tsx
'use client';

import { useState } from 'react';

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  // ✅ Local state - only this component needs it
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </form>
  );
}
```

---

#### D. React Hook Form for Complex Forms

**Use for**: Forms with validation, multi-step forms, complex field dependencies.

```tsx
// domains/auth/components/register-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schema';
import type { RegisterInput } from '../types';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input {...register('password')} type="password" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <input {...register('confirmPassword')} type="password" />
        {errors.confirmPassword && (
          <span>{errors.confirmPassword.message}</span>
        )}
      </div>

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

**Why React Hook Form?**

- ✅ Built-in validation with Zod
- ✅ Minimal re-renders
- ✅ Easy field management
- ✅ Built-in error handling
- ✅ TypeScript support

---

#### Common Anti-Patterns to Avoid

**❌ WRONG: Using Zustand for server data**

```tsx
// DON'T DO THIS
const useUserStore = create(set => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    const users = await api.getUsers();
    set({ users, loading: false });
  }
}));
```

**✅ CORRECT: Use React Query**

```tsx
// DO THIS
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers
  });
}
```

---

**❌ WRONG: Using useState for shared UI state**

```tsx
// DON'T DO THIS - duplicated in multiple components
function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
}

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
}
```

**✅ CORRECT: Use Zustand for shared UI state**

```tsx
// DO THIS
const useSidebarStore = create(set => ({
  isOpen: false,
  toggle: () => set(state => ({ isOpen: !state.isOpen }))
}));

// Now both components share the same state
```

---

### 4.4 Presentation Pattern (Server Component + Client Component)

We separate presentation logic using React's composition pattern.

**Structure**:

- Server Component: Data fetching, server logic
- Client Component: Interactivity, local state

```tsx
// app/users/page.tsx (Server Component)
import { Suspense } from 'react';
import { getUsers } from '@/domains/users/actions';
import { UserList } from '@/domains/users/components/organisms/user-list';
import { Skeleton } from '@/components/ui/skeleton';

export default async function UsersPage() {
  // ✅ Fetch in Server Component
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={<Skeleton />}>
        {/* ✅ Pass data to Client Component */}
        <UserList initialUsers={users} />
      </Suspense>
    </div>
  );
}
```

```tsx
// domains/users/components/organisms/user-list.tsx (Client Component)
'use client';

import { useState } from 'react';
import type { User } from '@/domains/users/types';

interface UserListProps {
  initialUsers: User[];
}

export function UserList({ initialUsers }: UserListProps) {
  // ✅ Local state for interactivity
  const [filter, setFilter] = useState('');

  const filteredUsers = initialUsers.filter(user => user.name.includes(filter));

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter users..."
      />
      {filteredUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

### 4.5 Validation Pattern (Zod Schema)

All validation is done with Zod schemas, shared between client and server.

```tsx
// domains/users/schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old').optional()
});

export type UserInput = z.infer<typeof userSchema>;
```

**Usage in Server Action**:

```tsx
// domains/users/actions.ts
'use server';

import { userSchema } from './schema';

export async function createUser(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email')
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  // Proceed with validated data...
}
```

**Usage in Client (instant validation)**:

```tsx
// domains/users/components/molecules/user-form.tsx
'use client';

import { userSchema } from '@/domains/users/schema';

export function UserForm() {
  const validate = (data: unknown) => {
    const result = userSchema.safeParse(data);
    return result.success ? null : result.error.errors;
  };

  // Use in form...
}
```

---

## 5. Code Examples

### Example 1: Complete Feature Creation

#### ❌ INCORRECT (Flat architecture)

```
src/
├── components/
│   ├── LoginForm.tsx          # Mixed with generic components
│   ├── Button.tsx
│   └── UserCard.tsx
├── hooks/
│   ├── useAuth.ts             # Mixed with generic hooks
│   └── useDebounce.ts
├── services/
│   └── authService.ts         # Unnecessary layer
└── utils/
    └── api.ts
```

#### ✅ CORRECT (Screaming Architecture)

```
src/
├── domains/
│   └── auth/                  # ✅ All auth in one place
│       ├── components/
│       │   └── molecules/
│       │       └── login-form.tsx
│       ├── hooks/
│       │   └── use-auth.ts
│       ├── stores/
│       │   └── auth-store.ts
│       ├── actions.ts         # ✅ Server Actions (no service)
│       ├── schema.ts
│       └── types.ts
├── components/                # ✅ Only reusable UI
│   ├── ui/
│   │   └── button.tsx
│   └── atoms/
│       └── user-card.tsx
└── utils/                     # ✅ Only pure functions
    └── debounce.ts
```

---

### Example 2: Correct vs Incorrect Imports

#### ❌ INCORRECT

```tsx
// components/organisms/header.tsx
import { useAuth } from '@/domains/auth/hooks/use-auth'; // ❌ Component importing from domain

export function Header() {
  const { user } = useAuth();
  return <header>{user?.name}</header>;
}
```

#### ✅ CORRECT

```tsx
// components/organisms/header.tsx
interface HeaderProps {
  userName?: string; // ✅ Receive data as props
}

export function Header({ userName }: HeaderProps) {
  return <header>{userName}</header>;
}

// app/layout.tsx (orchestrator)
import { auth } from '@/lib/auth';
import { Header } from '@/components/organisms/header';

export default async function RootLayout() {
  const session = await auth();

  return (
    <html>
      <body>
        <Header userName={session?.user?.name} />
        {/* ... */}
      </body>
    </html>
  );
}
```

---

### Example 3: Server Action vs Traditional Service

#### ❌ INCORRECT (Old architecture with Services)

```tsx
// services/userService.ts
export class UserService {
  async createUser(data: UserInput) {
    // Business logic
    return await userRepository.create(data);
  }
}

// repositories/userRepository.ts
export class UserRepository {
  async create(data: UserInput) {
    // Data access
    return await db.user.create({ data });
  }
}

// controllers/userController.ts
export async function createUserController(req, res) {
  const userService = new UserService();
  const user = await userService.createUser(req.body);
  res.json(user);
}
```

**Problems**:

- Too many unnecessary layers
- Excessive boilerplate
- Doesn't leverage RSC
- Not type-safe

#### ✅ CORRECT (Server Action)

```tsx
// domains/users/actions.ts
'use server';

import { db } from '@/lib/db';
import { userSchema } from './schema';

export async function createUser(formData: FormData) {
  // Everything in one place: validation + logic + persistence
  const validated = userSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email')
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await db.user.create({
    data: validated.data
  });

  return { success: true, user };
}
```

**Advantages**:

- ✅ Simple and direct
- ✅ Automatic type-safety
- ✅ Leverages RSC
- ✅ Less code

---

### Example 4: Server State vs Client State

#### ❌ INCORRECT (Using Zustand for server data)

```tsx
// domains/workouts/stores/workout-store.ts
import { create } from 'zustand';

// ❌ DON'T DO THIS - Using Zustand for backend data
export const useWorkoutStore = create(set => ({
  workouts: [],
  loading: false,
  error: null,

  fetchWorkouts: async () => {
    set({ loading: true });
    try {
      const data = await api.getWorkouts();
      set({ workouts: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  createWorkout: async workout => {
    const newWorkout = await api.createWorkout(workout);
    set(state => ({ workouts: [...state.workouts, newWorkout] }));
  }
}));
```

**Problems**:

- Manual loading/error state management
- No automatic cache invalidation
- Stale data issues
- No optimistic updates
- Hard to sync across components
- Duplicates React Query functionality

#### ✅ CORRECT (React Query for server data, Zustand for UI state)

```tsx
// domains/workouts/hooks/use-workouts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ✅ React Query for server data
export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: () => workoutRepository.findAll()
  });
}

export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workoutRepository.create,
    onSuccess: () => {
      // ✅ Automatic cache invalidation
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    }
  });
}

// domains/ui/stores/workout-filters-store.ts
import { create } from 'zustand';

// ✅ Zustand only for UI state
export const useWorkoutFiltersStore = create(set => ({
  sortBy: 'date',
  filterType: 'all',
  viewMode: 'grid',

  setSortBy: sortBy => set({ sortBy }),
  setFilterType: filterType => set({ filterType }),
  setViewMode: viewMode => set({ viewMode })
}));

// domains/ui/stores/sidebar-store.ts
// ✅ Zustand for UI preferences
export const useSidebarStore = create(set => ({
  isOpen: true,
  toggle: () => set(state => ({ isOpen: !state.isOpen }))
}));
```

**Advantages**:

- ✅ Clear separation: React Query (server) vs Zustand (UI)
- ✅ Automatic cache management
- ✅ No manual loading states
- ✅ Optimistic updates built-in
- ✅ Better performance and DX

---

### Example 5: Component with vs without Business Logic

#### ❌ INCORRECT (Component with business logic)

```tsx
// components/organisms/user-profile.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db'; // ❌ Component accessing DB

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ❌ Business logic in UI component
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  // ❌ Business validation in component
  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>{user.name}</div>;
}
```

#### ✅ CORRECT (Separation of concerns)

```tsx
// app/profile/[userId]/page.tsx (Server Component with logic)
import { auth } from '@/lib/auth';
import { getUser } from '@/domains/users/actions';
import { UserProfileCard } from '@/domains/users/components/organisms/user-profile-card';
import { redirect } from 'next/navigation';

export default async function ProfilePage({
  params
}: {
  params: { userId: string };
}) {
  // ✅ Business logic in Server Component
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  const user = await getUser(params.userId);

  // ✅ UI component only receives props
  return <UserProfileCard user={user} />;
}

// domains/users/components/organisms/user-profile-card.tsx
import type { User } from '@/domains/users/types';

interface UserProfileCardProps {
  user: User;
}

// ✅ Pure presentation component
export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## Summary of Architectural Principles

### 1. Screaming Architecture

- Structure screams business purpose
- Organization by feature/domain, not technical type

### 2. Separation of Concerns

- UI (components) separated from business logic (domains)
- Server Components for data, Client Components for interactivity

### 3. Dependency Rule

- Dependencies point inward
- Inner layers don't know outer layers

### 4. Single Responsibility

- Each layer/module/function has one responsibility
- Server Actions = Repository + Service + Controller

### 5. DRY (Don't Repeat Yourself)

- Utils for reusable pure functions
- Components for reusable UI
- Schemas shared between client and server

### 6. YAGNI (You Aren't Gonna Need It)

- Don't use unnecessary traditional patterns (Repository, Service)
- Leverage Next.js 15 native capabilities

### 7. Composition over Inheritance

- Use component composition
- Atomic Zustand stores instead of global store
