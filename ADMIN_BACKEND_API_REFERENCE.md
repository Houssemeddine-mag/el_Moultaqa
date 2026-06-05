# Admin Backend API Reference

## Quick Start

All functions are accessed through the `backend` object imported from `admin/src/backend.js`:

```javascript
import backend from "../backend.js";

// Initialize service (done automatically in App.jsx)
backend.initializeService(supabase, schemaName);

// Use any function
const users = await backend.getUsers();
```

---

## Organization Functions

### `getOrgInfo()`
Returns current organization metadata.

```javascript
const orgInfo = backend.getOrgInfo();
// Returns: { schemaName: "org_clerk_abc123" }
```

**Parameters:** None  
**Returns:** `{ schemaName: string }`  
**Throws:** None (safe to call anytime)

---

## User Management Functions

### `getUsers()`
Fetches all users registered in the current organization.

```javascript
const users = await backend.getUsers();

// Returns array like:
[
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    clerkUserId: "user_2c123456789",
    email: "john@org.com",
    fullName: "John Doe",
    role: "attendee",
    createdAt: "2024-06-01T12:00:00Z",
    updatedAt: "2024-06-02T15:30:00Z",
    profileData: { /* custom fields */ }
  },
  // ... more users
]
```

**Parameters:** None  
**Returns:** `Promise<Array<User>>`  
**Throws:** `Error` if Supabase not initialized  
**Security:** RLS-protected — only returns org members

---

### `updateUserRole(userId, newRole)`
Updates a user's role within the organization.

```javascript
await backend.updateUserRole(userId, "speaker");
// Returns: { id: "uuid", role: "speaker", updatedAt: "2024-06-02T..." }

await backend.updateUserRole(userId, "admin");
// Returns: { id: "uuid", role: "admin", updatedAt: "2024-06-02T..." }
```

**Parameters:**
- `userId: string` — UUID of the user
- `newRole: string` — One of: `"attendee"`, `"speaker"`, `"moderator"`, `"admin"`

**Returns:** `Promise<{ id, role, updatedAt }>`  
**Throws:** 
- `Error: Invalid role` — if newRole not in allowed list
- `Error` — if user not found or permission denied (RLS)

**Security:** RLS-protected — requires org membership

---

## Dashboard Functions

### `getDashboardMetrics()`
Aggregates organization-wide statistics.

```javascript
const metrics = await backend.getDashboardMetrics();

// Returns:
{
  totalUsers: 42,
  totalEvents: 3,
  totalSessions: 15,
  upcomingSessions: 8,
  usersByRole: {
    attendees: 35,
    speakers: 5,
    moderators: 1,
    admins: 1
  }
}
```

**Parameters:** None  
**Returns:** `Promise<DashboardMetrics>`  
**Fallback:** Returns zeros if Supabase not initialized  
**Security:** RLS-protected — only counts org's own data  
**Performance:** Parallel queries to users, events, and sessions tables

---

### `getTopPresenters(limit = 5)`
Fetches recently added speakers for dashboard display.

```javascript
const speakers = await backend.getTopPresenters(3);

// Returns:
[
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Dr. Jane Smith",
    title: "Chief Technology Officer",
    company: "TechCorp",
    photo: "https://example.com/jane.jpg"
  },
  // ... more speakers (up to limit)
]
```

**Parameters:**
- `limit?: number` — How many speakers to return (default: 5)

**Returns:** `Promise<Array<Speaker>>`  
**Fallback:** Returns empty array if error  
**Security:** RLS-protected — only returns org's speakers  
**Order:** Most recent first (by creation date)

---

## Programs/Sessions Functions

### `getPrograms()`
Fetches all sessions/programs in the organization.

```javascript
const programs = await backend.getPrograms();

// Returns array like:
[
  {
    id: "uuid",
    type: "session",
    title: "Keynote: Future of AI",
    date: "2024-06-15",
    start: "09:00",
    end: "10:00",
    room: "Hall A",
    chairs: ["John", "Jane"],
    keynote: { name: "Dr. Smith", affiliation: "MIT", ... },
    conferences: [],
    createdAt: "2024-06-01T...",
    updatedAt: "2024-06-02T..."
  }
]
```

**Security:** RLS-protected — only returns org's sessions

---

### `addProgram(program)`
Creates a new program/session.

```javascript
await backend.addProgram({
  type: "session",
  title: "Panel Discussion",
  date: "2024-06-15",
  start: "14:00",
  end: "15:30",
  room: "Hall B",
  chairs: ["Moderator Name"],
  keynote: { name: "", affiliation: "", bio: "", image: "" },
  conferences: []
});
```

---

### `updateProgram(id, data)`
Updates an existing program.

```javascript
await backend.updateProgram(programId, {
  title: "Updated Title",
  start: "10:00"
});
```

---

### `deleteProgram(id)`
Deletes a program.

```javascript
await backend.deleteProgram(programId);
```

---

## Keynote Speaker Functions

### `getKeynoteSpeakers()`
Fetches all speakers in the organization.

```javascript
const speakers = await backend.getKeynoteSpeakers();
```

---

### `addKeynoteSpeaker(speaker)`
Adds a new speaker.

```javascript
await backend.addKeynoteSpeaker({
  name: "Dr. John Smith",
  bio: "Expert in AI",
  title: "Chief Technology Officer",
  company: "TechCorp",
  photo: "https://...",
  socials: { twitter: "@johnsmith", linkedin: "..." }
});
```

---

### `updateKeynoteSpeaker(id, speaker)`
Updates speaker details.

```javascript
await backend.updateKeynoteSpeaker(speakerId, {
  name: "Dr. John Smith Jr.",
  bio: "Updated bio"
});
```

---

### `deleteKeynoteSpeaker(id)`
Deletes a speaker.

```javascript
await backend.deleteKeynoteSpeaker(speakerId);
```

---

## Sponsor Functions

### `getSponsors()`
Fetches all sponsors.

```javascript
const sponsors = await backend.getSponsors();
```

---

### `addSponsor(sponsor)`
Adds a new sponsor.

```javascript
await backend.addSponsor({
  name: "Acme Corp",
  tier: "platinum",
  logo: "https://..."
});
```

---

## Registration Functions

### `getRegistrationSettings(slug)`
Gets org's registration settings (mode + code).

```javascript
const settings = await backend.getRegistrationSettings("org-slug");
// Returns: { registrationMode: "public"|"private", registrationCode: "CODE123" }
```

---

### `updateRegistrationSettings(slug, mode, code)`
Updates registration settings (admin-only).

```javascript
await backend.updateRegistrationSettings(
  "org-slug",
  "private",
  "CONF2024"
);
```

---

## Error Handling Examples

### Example 1: User Not Found
```javascript
try {
  await backend.updateUserRole(invalidUserId, "speaker");
} catch (error) {
  console.error("User not found or no permission:", error.message);
}
```

### Example 2: Supabase Not Initialized
```javascript
const users = await backend.getUsers();
// If backend not initialized, returns: []
if (users.length === 0) {
  console.log("No users found or Supabase not ready");
}
```

### Example 3: Invalid Role
```javascript
try {
  await backend.updateUserRole(userId, "superadmin");  // Invalid
} catch (error) {
  console.error("Invalid role:", error.message);
  // Error: "Invalid role: must be one of attendee, speaker, moderator, admin"
}
```

---

## Type Definitions

### User
```typescript
interface User {
  id: string;              // UUID
  clerkUserId: string;     // Clerk user ID
  email: string;
  fullName: string;
  role: "attendee" | "speaker" | "moderator" | "admin";
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  profileData?: object;    // Custom fields
}
```

### Speaker
```typescript
interface Speaker {
  id: string;              // UUID
  name: string;
  title: string;
  company: string;
  photo: string;           // URL
}
```

### DashboardMetrics
```typescript
interface DashboardMetrics {
  totalUsers: number;
  totalEvents: number;
  totalSessions: number;
  upcomingSessions: number;
  usersByRole: {
    attendees: number;
    speakers: number;
    moderators: number;
    admins: number;
  };
}
```

### Program
```typescript
interface Program {
  id: string;
  type: string;
  title: string;
  date: string;            // "YYYY-MM-DD"
  start: string;           // "HH:MM"
  end: string;             // "HH:MM"
  room: string;
  chairs: string[];
  keynote: object;
  conferences: string[];
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

---

## Best Practices

### 1. Always Handle Errors
```javascript
try {
  const users = await backend.getUsers();
} catch (error) {
  console.error("Failed to fetch users:", error);
  // Show error to user
}
```

### 2. Use Loading States
```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const users = await backend.getUsers();
    setUsers(users);
  } finally {
    setLoading(false);
  }
};
```

### 3. Optimize Queries
```javascript
// Bad: Fetch data on every render
const users = await backend.getUsers();

// Good: Fetch on component mount
useEffect(() => {
  backend.getUsers().then(setUsers);
}, []);
```

### 4. Trust RLS Security
```javascript
// Don't need to filter data client-side
const users = await backend.getUsers();  // Already org-scoped by RLS
// Don't do this:
const filteredUsers = users.filter(u => u.org_id === myOrgId);  // Unnecessary
```

---

## Security Notes

✅ **All functions are RLS-protected** — Supabase enforces tenant isolation  
✅ **JWT org_id is immutable** — Can't be forged or modified  
✅ **No SQL injection possible** — Using parameterized RPC calls  
✅ **No privilege escalation possible** — RLS policies prevent it  

👉 **Always handle errors gracefully** — User might lose org membership or network fail
