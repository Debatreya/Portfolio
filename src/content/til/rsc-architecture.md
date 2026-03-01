---
title: "Understanding React Server Components Architecture"
date: "2026-03-01T12:00:00Z"
category: "React"
tags: ["nextjs", "rsc", "performance"]
excerpt: "A deep dive into how React Server Components fundamentally shift the modern web rendering paradigm and decouple data fetching."
---

# The Evolution of Rendering

React Server Components (RSC) represent a paradigm shift in how we build React applications. They allow us to render components *exclusively* on the server, sending zero JavaScript to the client.

## Why RSC Matters?

1. **Zero Bundle Size:** Components executed on the server don't add to the client-side JavaScript bundle.
2. **Direct Backend Access:** You can securely access databases, APIs, and microservices directly within your component body without exposing secrets.
3. **Automatic Code Splitting:** Client Components are automatically code-split by the bundler when imported by a Server Component.

Here is an example of fetching data directly inside an RSC without `useEffect`:

```typescript
// app/page.tsx (Server Component by default)
import db from '@/lib/db'

export default async function Dashboard() {
  // Direct database query! No API route needed.
  const users = await db.query('SELECT * FROM users');
  
  return (
    <div>
      <h1>User Dashboard</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

> RSCs are not a replacement for Client Components (`"use client"`). They work together. Use RSCs for data fetching and static rendering, and Client Components for interactivity.

### Summary
The mental model shifts from "Where is this rendered?" to "What does this component need?" If it needs backend data, make it a Server Component. If it needs state, effects, or browser APIs, make it a Client Component.
