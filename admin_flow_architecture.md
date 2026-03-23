# 🛡️ Admin Flow Architecture — SkillRise India

## Overview

The admin flow is a fully role-gated, JWT-secured system that gives the platform administrator access to a dedicated dashboard for analytics and NGO management. It spans across the **backend** (auth, model, middleware, routes) and the **frontend** (routing, protected layout, pages, components).

---

## 1. Entry Point — Admin Account Creation

```
scripts/seedAdmin.js
│
├── Connects to MongoDB
├── Checks if admin@skillrise.com already exists
└── Creates User with { role: "admin", isVerified: true }
```

> Run once via `node scripts/seedAdmin.js` to bootstrap the platform admin.

---

## 2. Authentication Flow

```
POST /api/auth/login
│
├── authController.loginUser()
│   ├── Find user by email (with password field included)
│   ├── bcrypt.compare(password) → matchPassword()
│   ├── user.getSignedJwtToken()  → JWT signed with JWT_SECRET
│   └── Returns { token, user: { id, name, email, role: "admin" } }
│
└── Client (Login.jsx)
    ├── Stores token → localStorage("token")
    ├── Stores role  → localStorage("role")
    └── if (role === "admin") → window.location.href = "/admin"
```

---

## 3. JWT Middleware Pipeline (Backend)

```
Every admin-protected API request:
│
├── protect middleware (authMiddleware.js)
│   ├── Reads Authorization: Bearer <token>
│   ├── jwt.verify(token, JWT_SECRET) → decoded.id
│   ├── User.findById(decoded.id).select("-password")
│   └── Attaches req.user
│
└── authorize("admin") middleware
    ├── Checks req.user.role === "admin"
    └── 403 if not authorized
```

---

## 4. Backend — Admin-Only API Routes

```
routes/authRoutes.js
│
├── POST /register          → public
├── POST /login             → public
├── POST /send-otp          → public
├── POST /verify-otp        → public
├── POST /forgot-password   → public
├── POST /reset-password    → public
│
└── POST /create-ngo        → protect + authorize("admin")
    └── authController.createNgo()
        ├── Validates { name, email, password }
        ├── Checks for duplicate email
        ├── Creates User { role: "ngo", isVerified: true }
        └── Returns { success, user: { id, name, email, role: "ngo" } }
```

---

## 5. Frontend — Routing & Route Guard

```
App.jsx
│
├── <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
│   └── <Route path="/admin" element={<AdminLayout />}>
│       ├── <Route index element={<AdminDashboard />} />
│       └── <Route path="ngo-register" element={<NgoRegister />} />
│
└── ProtectedRoute.jsx
    ├── Reads token + role from localStorage
    ├── No token        → redirect /login
    ├── Wrong role      → redirect to own dashboard (/admin, /ngo, /dashboard)
    └── Correct role    → render <Outlet />
```

---

## 6. Frontend — Admin Panel Structure

```
client/src/admin/
│
├── AdminLayout.jsx              ← Shell: Sidebar + <Outlet />
│
├── components/
│   ├── Sidebar.jsx              ← Nav: Dashboard | NGO Registration | Logout
│   ├── StatsCard.jsx            ← Metric cards (users, NGOs, states, top skill)
│   ├── Heatmap.jsx              ← India state heatmap (skill gap by state)
│   ├── SkillChart.jsx           ← Bar/line chart: demand vs supply per skill
│   ├── TrendingSkills.jsx       ← Top N skills by market demand
│   └── Insights.jsx             ← Auto-generated AI-style text insights
│
├── pages/
│   ├── Dashboard.jsx            ← Composes all components with analytics data
│   └── NgoRegister.jsx          ← Form: name, email, password, org type → POST /create-ngo
│
└── utils/
    ├── mockData.js              ← Static user/NGO/demand seed data
    └── calculations.js          ← Pure functions: skill gaps, state analytics, insights, trending
```

---

## 7. Data Flow — Admin Dashboard

```
mockData.js  (users[], ngos[], demand{}, SKILL_LABELS{})
     │
     ▼
calculations.js
     ├── getSkillSupply()       → count users per skill
     ├── getSkillGaps()         → demand - supply per skill
     ├── getUsersByState()      → group users by location
     ├── getStateAnalytics()    → state-level: topSkills, missingSkills, gapLevel, gapColor
     ├── getInsights()          → auto text insights (critical/warning/info/success)
     └── getTrendingSkills(n)   → top N skills by demand
           │
           ▼
Dashboard.jsx
     ├── StatsCard ← users.length, ngos.length, stateData.length, topSkill
     ├── Heatmap   ← getStateAnalytics() → SVG India map with color-coded states
     ├── SkillChart ← getSkillGaps() → chart of demand vs supply
     ├── TrendingSkills ← getTrendingSkills()
     └── Insights  ← getInsights()
```

---

## 8. Data Flow — NGO Registration (Admin Action)

```
NgoRegister.jsx
│
├── Form State: { name, email, type, password }
├── Client-side validate()
├── POST /api/auth/create-ngo
│   Headers: { Authorization: "Bearer <token>" }
│   Body:    { name, email, password, type }
│
└── Backend
    ├── protect        → verify JWT
    ├── authorize      → role === "admin"
    └── createNgo()    → User.create({ role: "ngo", isVerified: true })
```

---

## 9. Role System Summary

| Role    | Registered By    | Dashboard       | Can Create NGOs |
|---------|-----------------|-----------------|-----------------|
| `user`  | Public Register  | `/dashboard`    | ❌              |
| `ngo`   | Admin only       | `/ngo`          | ❌              |
| `admin` | Seed Script only | `/admin`        | ✅              |

---

## 10. Full End-to-End Flow Diagram

```
[seedAdmin.js]
     │  Creates admin user in MongoDB
     ▼
[Login Page]  →  POST /api/auth/login
     │           Returns { token, role: "admin" }
     │           localStorage.setItem("token", "role")
     ▼
[ProtectedRoute allowedRoles=["admin"]]
     │           token ✓  |  role === "admin" ✓
     ▼
[AdminLayout]   ←  Sidebar (nav links)
     │
     ├─── /admin           → Dashboard.jsx
     │       ├── StatsCard, Heatmap, SkillChart, TrendingSkills, Insights
     │       └── Data from: mockData.js + calculations.js
     │
     └─── /admin/ngo-register → NgoRegister.jsx
              └── POST /api/auth/create-ngo
                    ├── protect + authorize("admin")
                    └── Creates NGO user in MongoDB
```
