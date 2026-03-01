# CipherSQLStudio Design Guide

## Color Palette

### Primary Colors

- **Primary Blue**: `#2563eb` - Used for CTAs, links, and interactive elements
- **Primary Hover**: `#1d4ed8` - Hover state for primary elements

### Difficulty Indicators

- **Easy**: `#10b981` (Green) - Beginner-friendly assignments
- **Medium**: `#f59e0b` (Orange) - Intermediate challenges
- **Hard**: `#ef4444` (Red) - Advanced problems

### Neutral Colors

- **Background Primary**: `#ffffff` - Card backgrounds
- **Background Secondary**: `#f8fafc` - Page background
- **Background Tertiary**: `#f1f5f9` - Table headers, subtle backgrounds
- **Text Primary**: `#0f172a` - Main text
- **Text Secondary**: `#475569` - Supporting text
- **Text Muted**: `#94a3b8` - Placeholder text
- **Border**: `#e2e8f0` - Dividers and borders

## Typography

### Font Family

System font stack for optimal performance:

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif
```

### Font Sizes

- **3xl**: 1.875rem (30px) - Page titles
- **2xl**: 1.5rem (24px) - Section headers
- **xl**: 1.25rem (20px) - Card titles
- **lg**: 1.125rem (18px) - Subheadings
- **base**: 1rem (16px) - Body text
- **sm**: 0.875rem (14px) - Supporting text
- **xs**: 0.75rem (12px) - Labels, badges

## Spacing System

Consistent spacing using rem units:

- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## Component Patterns

### Cards

- White background with subtle border
- Border radius: 0.75rem (12px)
- Box shadow on hover
- Smooth transitions (200ms)

### Buttons

- Minimum height: 44px (touch-friendly)
- Border radius: 0.5rem (8px)
- Primary: Blue background, white text
- Secondary: Light gray background, dark text
- Hover: Slight lift effect with shadow

### Tables

- Alternating row hover states
- Fixed header styling
- Responsive horizontal scroll
- Consistent padding: 0.75rem 1rem

## Responsive Behavior

### Mobile (320px+)

- Single column layout
- Full-width cards
- Stacked sections
- Touch-optimized spacing

### Tablet (641px+)

- Two-column grid for assignment cards
- Improved spacing
- Larger typography

### Desktop (1024px+)

- Three-column grid for assignments
- Side-by-side layout for attempt page
- Maximum container width: 1200px
- Enhanced hover effects

### Large Desktop (1281px+)

- Maximum container width: 1400px
- Optimized for wide screens

## Accessibility

- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 for text
- Focus indicators on interactive elements
- Keyboard navigation support
- Semantic HTML structure

## Animation & Transitions

- **Fast**: 150ms - Micro-interactions
- **Base**: 200ms - Standard transitions
- **Slow**: 300ms - Complex animations
- Easing: ease-in-out for smooth motion

## Best Practices

1. **Mobile-First**: Start with mobile styles, enhance for larger screens
2. **BEM Naming**: Block\_\_Element--Modifier for clarity
3. **SCSS Organization**: Variables, mixins, partials for maintainability
4. **Performance**: Minimal animations, optimized assets
5. **Consistency**: Reuse mixins and variables throughout
