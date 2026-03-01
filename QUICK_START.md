# Quick Start Guide

## Running the Application

### Step 1: Start Development Server

```bash
cd cipher-sql-studio
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

### Step 2: Explore the Interface

#### Assignment Listing Page

- Browse 4 sample SQL assignments
- Filter by difficulty: Easy, Medium, Hard
- Click any card to start practicing

#### Assignment Attempt Page

- **Left Panel**: Problem statement and requirements
- **Right Panel**: Sample data with schema and preview rows
- **SQL Editor**: Write your queries using Monaco Editor
- **Execute Button**: Run your query and see results
- **Get Hint Button**: Progressive hints without spoiling the solution

## Testing Responsive Design

### Browser DevTools

1. Open Chrome/Firefox DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these breakpoints:
   - 320px (Mobile)
   - 641px (Tablet)
   - 1024px (Desktop)
   - 1281px (Large Desktop)

### Mobile Testing

- Use your phone's browser
- Navigate to your computer's local IP: `http://[YOUR_IP]:3000`
- Test touch interactions and scrolling

## Sample Queries to Try

### Assignment 1: Select All Customers

```sql
SELECT * FROM customers;
```

### Assignment 2: Filter by City

```sql
SELECT * FROM customers WHERE city = 'New York';
```

### Assignment 3: Count Orders by Customer

```sql
SELECT c.name, COUNT(o.id) as order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
```

### Assignment 4: Top Spending Customers

```sql
SELECT c.name, SUM(o.total) as total_spent
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
GROUP BY c.name
ORDER BY total_spent DESC
LIMIT 5;
```

## Customizing the Application

### Adding New Assignments

Edit `src/data/assignments.js` and add new assignment objects:

```javascript
{
  id: 5,
  title: "Your Assignment Title",
  difficulty: "Easy", // Easy, Medium, or Hard
  description: "Short description",
  problemStatement: "Full problem description",
  requirements: ["Requirement 1", "Requirement 2"],
  sampleData: {
    tableName: "table_name",
    schema: [
      { name: "column1", type: "INTEGER" },
      { name: "column2", type: "VARCHAR(100)" }
    ],
    rows: [
      { column1: 1, column2: "value" }
    ]
  },
  hints: ["Hint 1", "Hint 2", "Hint 3"]
}
```

### Modifying Colors

Edit `src/styles/_variables.scss` to change the color scheme:

```scss
$primary-color: #your-color;
$easy-color: #your-color;
$medium-color: #your-color;
$hard-color: #your-color;
```

### Adjusting Breakpoints

Modify breakpoint values in `src/styles/_variables.scss`:

```scss
$breakpoint-xs: 320px;
$breakpoint-sm: 641px;
$breakpoint-md: 1024px;
$breakpoint-lg: 1281px;
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Troubleshooting

### Port Already in Use

If port 3000 is busy, React will prompt you to use another port. Press 'Y' to continue.

### Monaco Editor Not Loading

Ensure `@monaco-editor/react` is installed:

```bash
npm install @monaco-editor/react
```

### SCSS Not Compiling

Verify `sass` is installed:

```bash
npm install sass
```

### Routing Issues

Make sure `react-router-dom` is installed:

```bash
npm install react-router-dom
```

## Next Steps

1. **Backend Integration**: Connect to a real SQL database API
2. **User Authentication**: Add login and progress tracking
3. **Query Validation**: Implement actual SQL parsing and validation
4. **More Assignments**: Expand the assignment library
5. **Leaderboards**: Add competitive elements for engagement

Enjoy building with CipherSQLStudio! 🚀
