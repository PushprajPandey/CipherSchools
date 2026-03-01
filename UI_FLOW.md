# CipherSQLStudio - UI Flow & Visual Guide

## Page 1: Assignment Listing

```
┌─────────────────────────────────────────────────────────────┐
│  CipherSQLStudio                                            │
└─────────────────────────────────────────────────────────────┘

    SQL Assignments
    Choose an assignment to practice your SQL skills

    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │ Select All       │  │ Filter by City   │  │ Count Orders by  │
    │ Customers   EASY │  │              EASY│  │ Customer  MEDIUM │
    │                  │  │                  │  │                  │
    │ Write a query to │  │ Select customers │  │ Use GROUP BY and │
    │ retrieve all     │  │ from a specific  │  │ COUNT to find    │
    │ columns from the │  │ city using the   │  │ how many orders  │
    │ customers table. │  │ WHERE clause.    │  │ each customer... │
    └──────────────────┘  └──────────────────┘  └──────────────────┘

    ┌──────────────────┐
    │ Top Spending     │
    │ Customers   HARD │
    │                  │
    │ Find the top 5   │
    │ customers by     │
    │ total spending   │
    │ using joins...   │
    └──────────────────┘
```

### Visual Elements

- **Header**: Fixed navigation with logo
- **Title**: Large, bold heading
- **Subtitle**: Supporting text in muted color
- **Cards**: Grid layout (1 col mobile → 3 cols desktop)
- **Difficulty Badge**: Color-coded (Green/Orange/Red)
- **Hover Effect**: Card lifts with shadow

---

## Page 2: Assignment Attempt

### Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────┐
│  CipherSQLStudio                                            │
└─────────────────────────────────────────────────────────────┘

← Back to Assignments

Select All Customers                                      [EASY]

┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Problem Statement           │  │ Sample Data                 │
│                             │  │                             │
│ Your task is to write a SQL │  │ Table: customers            │
│ query that selects all      │  │                             │
│ customer information from   │  │ Schema                      │
│ the customers table...      │  │ ┌──────────┬──────────────┐ │
│                             │  │ │ Column   │ Data Type    │ │
│ Requirements                │  │ ├──────────┼──────────────┤ │
│ ✓ Select all columns        │  │ │ id       │ INTEGER      │ │
│ ✓ From the customers table  │  │ │ name     │ VARCHAR(100) │ │
│ ✓ No filtering required     │  │ │ email    │ VARCHAR(100) │ │
│                             │  │ │ city     │ VARCHAR(50)  │ │
│                             │  │ └──────────┴──────────────┘ │
│                             │  │                             │
│                             │  │ Sample Rows                 │
│                             │  │ ┌────┬──────────┬─────...  │
│                             │  │ │ id │ name     │ email...  │
│                             │  │ ├────┼──────────┼─────...  │
│                             │  │ │ 1  │ Aryan Malhotra │ john...   │
│                             │  │ │ 2  │ Jane...  │ jane...   │
└─────────────────────────────┘  └─────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SQL Editor                                                  │
│                                                             │
│  1  SELECT * FROM customers;                                │
│  2  |                                                       │
│  3                                                          │
│                                                             │
│ [Execute Query]  [Get Hint]                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Results                                                     │
│                                                             │
│ ┌────┬──────────────┬─────────────────────┬──────────────┐ │
│ │ id │ name         │ email               │ city         │ │
│ ├────┼──────────────┼─────────────────────┼──────────────┤ │
│ │ 1  │ Aryan Malhotra     │ aryan@example.com    │ Mumbai     │ │
│ │ 2  │ Isha Khanna   │ isha@example.com    │ Delhi  │ │
│ │ 3  │ Devansh Agarwal  │ devansh@example.com     │ Bangalore      │ │
│ └────┴──────────────┴─────────────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Hint 1 of 3                                                 │
│                                                             │
│ Start with the SELECT keyword                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (320px+)

```
┌─────────────────────────┐
│  CipherSQLStudio        │
└─────────────────────────┘

← Back to Assignments

Select All Customers [EASY]

┌─────────────────────────┐
│ Problem Statement       │
│                         │
│ Your task is to write   │
│ a SQL query that        │
│ selects all customer... │
│                         │
│ Requirements            │
│ ✓ Select all columns    │
│ ✓ From customers table  │
└─────────────────────────┘

┌─────────────────────────┐
│ Sample Data             │
│                         │
│ Table: customers        │
│                         │
│ Schema                  │
│ [Scrollable table]      │
│                         │
│ Sample Rows             │
│ [Scrollable table]      │
└─────────────────────────┘

┌─────────────────────────┐
│ SQL Editor              │
│                         │
│ SELECT * FROM           │
│ customers;              │
│                         │
│ [Execute Query]         │
│ [Get Hint]              │
└─────────────────────────┘

┌─────────────────────────┐
│ Results                 │
│                         │
│ [Scrollable results]    │
└─────────────────────────┘
```

---

## Color Scheme

### Primary Colors

- **Blue**: `#2563eb` - Buttons, links, accents
- **Blue Hover**: `#1d4ed8` - Interactive states

### Difficulty Colors

- **Easy**: `#10b981` (Green)
- **Medium**: `#f59e0b` (Orange)
- **Hard**: `#ef4444` (Red)

### Backgrounds

- **Page**: `#f8fafc` (Light gray)
- **Cards**: `#ffffff` (White)
- **Tables**: `#f1f5f9` (Subtle gray)

### Text

- **Primary**: `#0f172a` (Dark)
- **Secondary**: `#475569` (Medium gray)
- **Muted**: `#94a3b8` (Light gray)

---

## Interactive States

### Cards (Assignment List)

- **Default**: White background, subtle border
- **Hover**: Lifts up 4px, blue border, shadow
- **Active**: Lifts up 2px
- **Focus**: Blue outline ring

### Buttons

- **Primary (Execute)**
  - Default: Blue background, white text
  - Hover: Darker blue, lifts up, shadow
  - Disabled: 50% opacity
- **Secondary (Get Hint)**
  - Default: Light gray background
  - Hover: Darker gray
  - Disabled: 50% opacity

### Tables

- **Header**: Gray background, bold text
- **Rows**: White background
- **Row Hover**: Light gray background
- **Borders**: Subtle gray lines

---

## Typography Hierarchy

```
Page Title (30px)
  └─ Section Title (24px)
      └─ Card Title (20px)
          └─ Body Text (16px)
              └─ Supporting Text (14px)
                  └─ Labels (12px)
```

---

## Spacing System

- **Tight**: 8px - Between related elements
- **Normal**: 16px - Standard spacing
- **Relaxed**: 24px - Between sections
- **Loose**: 32px - Between major sections

---

## Responsive Breakpoints

### Mobile (320px)

- Single column
- Stacked sections
- Full-width buttons
- Horizontal scroll for tables

### Tablet (641px)

- 2-column grid for cards
- Improved spacing
- Larger touch targets

### Desktop (1024px)

- 3-column grid for cards
- Side-by-side layout
- Enhanced hover effects
- Max width: 1200px

### Large Desktop (1281px)

- Max width: 1400px
- Optimized for wide screens

---

## User Flow

1. **Landing** → Assignment List
2. **Select Card** → Assignment Attempt Page
3. **Read Problem** → Understand requirements
4. **View Sample Data** → See table structure
5. **Write Query** → Use Monaco Editor
6. **Execute** → See results or errors
7. **Get Hints** → Progressive guidance
8. **Iterate** → Refine query
9. **Back Button** → Return to list

---

## Accessibility Features

- ✓ Semantic HTML (header, main, nav)
- ✓ ARIA roles on interactive elements
- ✓ Keyboard navigation (Tab, Enter, Space)
- ✓ Focus indicators (blue outline)
- ✓ Color contrast (4.5:1 minimum)
- ✓ Touch targets (44px minimum)
- ✓ Screen reader friendly

---

## Animation & Transitions

- **Card Hover**: 200ms ease-in-out
- **Button Hover**: 200ms ease-in-out
- **Page Transitions**: Instant (React Router)
- **Results Appear**: Instant (no animation)
- **Hint Reveal**: Instant (no animation)

Simple, performant, no unnecessary motion.
