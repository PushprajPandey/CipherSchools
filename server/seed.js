/**
 * Seed script - Pre-populates MongoDB with SQL assignments.
 * Run: node seed.js
 *
 * This inserts all assignment data into MongoDB Atlas.
 * Assignments are pre-configured by administrators; students only consume them.
 */
require("dotenv").config();

const mongoose = require("mongoose");
const Assignment = require("./models/Assignment");

const assignments = [
  {
    title: "Select All Customers",
    difficulty: "Easy",
    category: "SELECT",
    description: "Write a query to retrieve all columns from the customers table.",
    question:
      "Your task is to write a SQL query that selects all customer information from the customers table. This is a basic SELECT query that will help you understand how to retrieve data from a database.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
          { columnName: "email", dataType: "VARCHAR(100)" },
          { columnName: "city", dataType: "VARCHAR(50)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra", email: "aryan@example.com", city: "Mumbai" },
          { id: 2, name: "Isha Khanna", email: "isha@example.com", city: "Delhi" },
          { id: 3, name: "Devansh Agarwal", email: "devansh@example.com", city: "Bangalore" },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 1, name: "Aryan Malhotra", email: "aryan@example.com", city: "Mumbai" },
        { id: 2, name: "Isha Khanna", email: "isha@example.com", city: "Delhi" },
        { id: 3, name: "Devansh Agarwal", email: "devansh@example.com", city: "Bangalore" },
      ],
    },
    hints: [
      "Start with the SELECT keyword",
      "Use * to select all columns",
      "Don't forget the FROM clause",
    ],
  },
  {
    title: "Filter by City",
    difficulty: "Easy",
    category: "WHERE",
    description: "Select customers from a specific city using the WHERE clause.",
    question:
      "Write a SQL query to find all customers who live in 'Mumbai'. You'll need to use the WHERE clause to filter the results.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
          { columnName: "email", dataType: "VARCHAR(100)" },
          { columnName: "city", dataType: "VARCHAR(50)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra", email: "aryan@example.com", city: "Mumbai" },
          { id: 2, name: "Isha Khanna", email: "isha@example.com", city: "Delhi" },
          { id: 3, name: "Devansh Agarwal", email: "devansh@example.com", city: "Bangalore" },
          { id: 4, name: "Tanvi Jain", email: "tanvi@example.com", city: "Mumbai" },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 1, name: "Aryan Malhotra", email: "aryan@example.com", city: "Mumbai" },
        { id: 4, name: "Tanvi Jain", email: "tanvi@example.com", city: "Mumbai" },
      ],
    },
    hints: [
      "Use the WHERE clause after FROM",
      "String values need single quotes",
      "Column name is 'city'",
    ],
  },
  {
    title: "Count Orders by Customer",
    difficulty: "Medium",
    category: "GROUP BY",
    description: "Use GROUP BY and COUNT to find how many orders each customer has placed.",
    question:
      "Write a query that shows each customer's name and the total number of orders they have placed. You'll need to join the customers and orders tables, then group the results.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra" },
          { id: 2, name: "Isha Khanna" },
        ],
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "total", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 101, customer_id: 1, total: 150.0 },
          { id: 102, customer_id: 1, total: 200.0 },
          { id: 103, customer_id: 2, total: 75.0 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { name: "Aryan Malhotra", order_count: 2 },
        { name: "Isha Khanna", order_count: 1 },
      ],
    },
    hints: [
      "Use INNER JOIN to connect customers and orders",
      "The join condition uses customer_id",
      "GROUP BY the customer name",
      "Use COUNT() to count orders",
    ],
  },
  {
    title: "Top Spending Customers",
    difficulty: "Hard",
    category: "Aggregation",
    description: "Find the top 5 customers by total spending using joins, aggregation, and ordering.",
    question:
      "Write a query to identify the top 5 customers based on their total spending. Calculate the sum of all order totals for each customer, and return the results ordered from highest to lowest spending.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra" },
          { id: 2, name: "Isha Khanna" },
          { id: 3, name: "Devansh Agarwal" },
        ],
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "total", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 101, customer_id: 1, total: 500.0 },
          { id: 102, customer_id: 2, total: 750.0 },
          { id: 103, customer_id: 3, total: 300.0 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { name: "Isha Khanna", total_spent: 750.0 },
        { name: "Aryan Malhotra", total_spent: 500.0 },
        { name: "Devansh Agarwal", total_spent: 300.0 },
      ],
    },
    hints: [
      "Start with a JOIN between customers and orders",
      "Use SUM(orders.total) to calculate total spending",
      "GROUP BY customer",
      "Use ORDER BY with DESC for descending order",
      "LIMIT 5 restricts to top 5 results",
    ],
  },
  {
    title: "Sort Products by Price",
    difficulty: "Easy",
    category: "ORDER BY",
    description: "Retrieve all products sorted by their price from lowest to highest.",
    question:
      "Write a SQL query that lists all products from the products table, ordered by their price in ascending order.",
    sampleTables: [
      {
        tableName: "products",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "product_name", dataType: "VARCHAR(100)" },
          { columnName: "category", dataType: "VARCHAR(50)" },
          { columnName: "price", dataType: "DECIMAL(10,2)" },
          { columnName: "stock_qty", dataType: "INTEGER" },
        ],
        rows: [
          { id: 1, product_name: "Wireless Mouse", category: "Electronics", price: 29.99, stock_qty: 150 },
          { id: 2, product_name: "USB Keyboard", category: "Electronics", price: 49.99, stock_qty: 80 },
          { id: 3, product_name: "Notebook", category: "Stationery", price: 5.99, stock_qty: 500 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 3, product_name: "Notebook", category: "Stationery", price: 5.99, stock_qty: 500 },
        { id: 1, product_name: "Wireless Mouse", category: "Electronics", price: 29.99, stock_qty: 150 },
        { id: 2, product_name: "USB Keyboard", category: "Electronics", price: 49.99, stock_qty: 80 },
      ],
    },
    hints: [
      "Use ORDER BY at the end of your query",
      "ASC keyword sorts from lowest to highest",
      "The column to sort by is 'price'",
    ],
  },
  {
    title: "Pattern Matching with LIKE",
    difficulty: "Easy",
    category: "WHERE",
    description: "Find all employees whose name starts with the letter 'A' using LIKE.",
    question:
      "Write a SQL query to find all employees from the employees table whose first_name starts with the letter 'A'. Use the LIKE operator with a wildcard pattern.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "last_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, first_name: "Priya", last_name: "Wang", department: "Engineering", salary: 85000 },
          { id: 2, first_name: "Vikram", last_name: "Lee", department: "Marketing", salary: 62000 },
          { id: 3, first_name: "Neha", last_name: "Chen", department: "Engineering", salary: 91000 },
          { id: 4, first_name: "Rohan", last_name: "Kim", department: "Sales", salary: 58000 },
          { id: 5, first_name: "Riya", last_name: "Patel", department: "HR", salary: 70000 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 1, first_name: "Priya", last_name: "Wang", department: "Engineering", salary: 85000 },
        { id: 3, first_name: "Neha", last_name: "Chen", department: "Engineering", salary: 91000 },
        { id: 5, first_name: "Riya", last_name: "Patel", department: "HR", salary: 70000 },
      ],
    },
    hints: [
      "LIKE is used for pattern matching in WHERE",
      "The % wildcard matches any sequence of characters",
      "To match names starting with 'A', use 'A%'",
    ],
  },
  {
    title: "Distinct Cities",
    difficulty: "Easy",
    category: "SELECT",
    description: "Get a list of unique cities from the customers table using DISTINCT.",
    question:
      "Write a SQL query that returns a list of all unique cities where your customers are located. Avoid duplicate city names in the output.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
          { columnName: "email", dataType: "VARCHAR(100)" },
          { columnName: "city", dataType: "VARCHAR(50)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra", email: "aryan@example.com", city: "Mumbai" },
          { id: 2, name: "Isha Khanna", email: "isha@example.com", city: "Delhi" },
          { id: 3, name: "Devansh Agarwal", email: "devansh@example.com", city: "Mumbai" },
          { id: 4, name: "Tanvi Jain", email: "tanvi@example.com", city: "Bangalore" },
          { id: 5, name: "Karan Kapoor", email: "karan@example.com", city: "Delhi" },
        ],
      },
    ],
    expectedOutput: {
      type: "column",
      value: ["Mumbai", "Delhi", "Bangalore"],
    },
    hints: [
      "Use SELECT DISTINCT instead of just SELECT",
      "You only need to select the city column",
      "DISTINCT removes duplicate rows from results",
    ],
  },
  {
    title: "Average Salary by Department",
    difficulty: "Medium",
    category: "GROUP BY",
    description: "Calculate the average salary for each department using GROUP BY and AVG.",
    question:
      "Write a SQL query that calculates the average salary for each department in the employees table. Display the department name alongside its average salary, rounded to two decimal places.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
          { columnName: "hire_date", dataType: "DATE" },
        ],
        rows: [
          { id: 1, first_name: "Priya", department: "Engineering", salary: 85000, hire_date: "2021-03-15" },
          { id: 2, first_name: "Vikram", department: "Marketing", salary: 62000, hire_date: "2020-07-01" },
          { id: 3, first_name: "Neha", department: "Engineering", salary: 91000, hire_date: "2019-11-20" },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 58000, hire_date: "2022-01-10" },
          { id: 5, first_name: "Ananya", department: "Marketing", salary: 67000, hire_date: "2021-09-05" },
          { id: 6, first_name: "Rahul", department: "Engineering", salary: 95000, hire_date: "2018-06-12" },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { department: "Engineering", avg_salary: 90333.33 },
        { department: "Marketing", avg_salary: 64500.0 },
        { department: "Sales", avg_salary: 58000.0 },
      ],
    },
    hints: [
      "AVG() calculates the average of a numeric column",
      "GROUP BY department groups rows by department",
      "ROUND(value, 2) rounds to 2 decimal places",
      "Give the calculated column an alias using AS",
    ],
  },
  {
    title: "Employees Hired After 2020",
    difficulty: "Easy",
    category: "WHERE",
    description: "Filter employees based on their hire date using date comparison.",
    question:
      "Write a SQL query to find all employees who were hired after January 1, 2020. Display their name, department, and hire date.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
          { columnName: "hire_date", dataType: "DATE" },
        ],
        rows: [
          { id: 1, first_name: "Priya", department: "Engineering", salary: 85000, hire_date: "2021-03-15" },
          { id: 2, first_name: "Vikram", department: "Marketing", salary: 62000, hire_date: "2020-07-01" },
          { id: 3, first_name: "Neha", department: "Engineering", salary: 91000, hire_date: "2019-11-20" },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 58000, hire_date: "2022-01-10" },
          { id: 5, first_name: "Ananya", department: "Marketing", salary: 67000, hire_date: "2021-09-05" },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { first_name: "Priya", department: "Engineering", hire_date: "2021-03-15" },
        { first_name: "Vikram", department: "Marketing", hire_date: "2020-07-01" },
        { first_name: "Rohan", department: "Sales", hire_date: "2022-01-10" },
        { first_name: "Ananya", department: "Marketing", hire_date: "2021-09-05" },
      ],
    },
    hints: [
      "Use WHERE hire_date > 'date_value'",
      "Dates in PostgreSQL use the format 'YYYY-MM-DD'",
      "The comparison operator > works with dates",
    ],
  },
  {
    title: "Inner Join: Orders with Products",
    difficulty: "Medium",
    category: "JOIN",
    description: "Join orders and products tables to display order details with product names.",
    question:
      "Write a query that combines the orders and products tables to show each order along with the product name, quantity ordered, and total price. Use an INNER JOIN on the product_id column.",
    sampleTables: [
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "product_id", dataType: "INTEGER" },
          { columnName: "quantity", dataType: "INTEGER" },
          { columnName: "total_price", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, product_id: 101, quantity: 2, total_price: 59.98 },
          { id: 2, product_id: 102, quantity: 1, total_price: 49.99 },
          { id: 3, product_id: 101, quantity: 3, total_price: 89.97 },
        ],
      },
      {
        tableName: "products",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "product_name", dataType: "VARCHAR(100)" },
          { columnName: "price", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 101, product_name: "Wireless Mouse", price: 29.99 },
          { id: 102, product_name: "USB Keyboard", price: 49.99 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 1, product_name: "Wireless Mouse", quantity: 2, total_price: 59.98 },
        { id: 2, product_name: "USB Keyboard", quantity: 1, total_price: 49.99 },
        { id: 3, product_name: "Wireless Mouse", quantity: 3, total_price: 89.97 },
      ],
    },
    hints: [
      "Use INNER JOIN to combine the two tables",
      "The ON clause specifies the join condition",
      "Use aliases like 'o' for orders and 'p' for products",
      "Select specific columns from each table",
    ],
  },
  {
    title: "Subquery: Above Average Salary",
    difficulty: "Hard",
    category: "Subquery",
    description: "Find employees earning more than the company average using a subquery.",
    question:
      "Write a SQL query that finds all employees whose salary is above the overall company average. Display their name, department, and salary. Use a subquery to calculate the average salary dynamically.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, first_name: "Priya", department: "Engineering", salary: 85000 },
          { id: 2, first_name: "Vikram", department: "Marketing", salary: 62000 },
          { id: 3, first_name: "Neha", department: "Engineering", salary: 91000 },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 58000 },
          { id: 5, first_name: "Ananya", department: "Marketing", salary: 67000 },
          { id: 6, first_name: "Rahul", department: "Engineering", salary: 95000 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { first_name: "Priya", department: "Engineering", salary: 85000 },
        { first_name: "Neha", department: "Engineering", salary: 91000 },
        { first_name: "Rahul", department: "Engineering", salary: 95000 },
      ],
    },
    hints: [
      "A subquery is a query inside another query",
      "Use (SELECT AVG(salary) FROM employees) as a subquery",
      "Place the subquery in the WHERE clause",
      "Compare salary > (subquery result)",
    ],
  },
  {
    title: "HAVING Clause: Big Departments",
    difficulty: "Medium",
    category: "GROUP BY",
    description: "Find departments with more than 2 employees using GROUP BY and HAVING.",
    question:
      "Write a SQL query to find all departments that have more than 2 employees. Display the department name and the number of employees in each qualifying department.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, first_name: "Priya", department: "Engineering", salary: 85000 },
          { id: 2, first_name: "Vikram", department: "Marketing", salary: 62000 },
          { id: 3, first_name: "Neha", department: "Engineering", salary: 91000 },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 58000 },
          { id: 5, first_name: "Ananya", department: "Marketing", salary: 67000 },
          { id: 6, first_name: "Rahul", department: "Engineering", salary: 95000 },
          { id: 7, first_name: "Kavya", department: "Engineering", salary: 78000 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [{ department: "Engineering", employee_count: 4 }],
    },
    hints: [
      "HAVING is like WHERE but for grouped results",
      "First GROUP BY department, then use HAVING",
      "COUNT(*) counts the number of rows in each group",
      "HAVING COUNT(*) > 2 filters groups",
    ],
  },
  {
    title: "Left Join: All Customers with Orders",
    difficulty: "Medium",
    category: "JOIN",
    description: "Use LEFT JOIN to find all customers, including those who never placed an order.",
    question:
      "Write a SQL query that lists ALL customers along with their order information. Customers who have not placed any orders should still appear in the results with NULL values for order columns.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra" },
          { id: 2, name: "Isha Khanna" },
          { id: 3, name: "Devansh Agarwal" },
          { id: 4, name: "Tanvi Jain" },
        ],
      },
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "total", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 101, customer_id: 1, total: 150.0 },
          { id: 102, customer_id: 2, total: 200.0 },
          { id: 103, customer_id: 4, total: 75.0 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { name: "Aryan Malhotra", id: 101, total: 150.0 },
        { name: "Isha Khanna", id: 102, total: 200.0 },
        { name: "Devansh Agarwal", id: null, total: null },
        { name: "Tanvi Jain", id: 103, total: 75.0 },
      ],
    },
    hints: [
      "LEFT JOIN keeps ALL rows from the left table",
      "Unmatched rows from the right table show as NULL",
      "The left table is customers, right table is orders",
      "Join condition: customers.id = orders.customer_id",
    ],
  },
  {
    title: "Update Product Prices",
    difficulty: "Medium",
    category: "UPDATE",
    description: "Increase the price of all Electronics products by 10% using UPDATE.",
    question:
      "Write a SQL UPDATE statement that increases the price of all products in the 'Electronics' category by 10%. Only products in the Electronics category should be affected.",
    sampleTables: [
      {
        tableName: "products",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "product_name", dataType: "VARCHAR(100)" },
          { columnName: "category", dataType: "VARCHAR(50)" },
          { columnName: "price", dataType: "DECIMAL(10,2)" },
          { columnName: "stock_qty", dataType: "INTEGER" },
        ],
        rows: [
          { id: 1, product_name: "Wireless Mouse", category: "Electronics", price: 29.99, stock_qty: 150 },
          { id: 2, product_name: "USB Keyboard", category: "Electronics", price: 49.99, stock_qty: 80 },
          { id: 3, product_name: "Notebook", category: "Stationery", price: 5.99, stock_qty: 500 },
        ],
      },
    ],
    expectedOutput: { type: "count", value: 2 },
    hints: [
      "UPDATE table_name SET column = new_value WHERE condition",
      "To increase by 10%, multiply the current price by 1.10",
      "Use WHERE category = 'Electronics' to target specific rows",
    ],
  },
  {
    title: "CASE Statement: Salary Tiers",
    difficulty: "Hard",
    category: "CASE",
    description: "Classify employees into salary tiers using a CASE expression.",
    question:
      "Write a SQL query that displays each employee's name, salary, and a new column called 'salary_tier'. Classify employees as 'Junior' (below 65000), 'Mid-Level' (65000-85000), or 'Senior' (above 85000).",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, first_name: "Priya", department: "Engineering", salary: 85000 },
          { id: 2, first_name: "Vikram", department: "Marketing", salary: 62000 },
          { id: 3, first_name: "Neha", department: "Engineering", salary: 91000 },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 58000 },
          { id: 5, first_name: "Ananya", department: "Marketing", salary: 67000 },
          { id: 6, first_name: "Rahul", department: "Engineering", salary: 95000 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { first_name: "Priya", salary: 85000, salary_tier: "Mid-Level" },
        { first_name: "Vikram", salary: 62000, salary_tier: "Junior" },
        { first_name: "Neha", salary: 91000, salary_tier: "Senior" },
        { first_name: "Rohan", salary: 58000, salary_tier: "Junior" },
        { first_name: "Ananya", salary: 67000, salary_tier: "Mid-Level" },
        { first_name: "Rahul", salary: 95000, salary_tier: "Senior" },
      ],
    },
    hints: [
      "CASE WHEN condition THEN result ... END creates conditional columns",
      "You can chain multiple WHEN clauses",
      "Use ELSE for the default/last tier",
      "Give the CASE expression an alias with AS salary_tier",
    ],
  },
  {
    title: "Self Join: Employee Managers",
    difficulty: "Hard",
    category: "JOIN",
    description: "Use a self join to display each employee alongside their manager's name.",
    question:
      "Write a SQL query that shows each employee's name and their manager's name. The employees table has a manager_id column that references the id of another employee in the same table. Use a self join to resolve manager names.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
          { columnName: "manager_id", dataType: "INTEGER" },
        ],
        rows: [
          { id: 1, first_name: "Meera", department: "Executive", salary: 150000, manager_id: null },
          { id: 2, first_name: "Priya", department: "Engineering", salary: 95000, manager_id: 1 },
          { id: 3, first_name: "Vikram", department: "Engineering", salary: 85000, manager_id: 2 },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 70000, manager_id: 1 },
          { id: 5, first_name: "Ananya", department: "Sales", salary: 62000, manager_id: 4 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { employee: "Sarah", manager: null },
        { employee: "Alice", manager: "Sarah" },
        { employee: "Brian", manager: "Alice" },
        { employee: "David", manager: "Sarah" },
        { employee: "Eva", manager: "David" },
      ],
    },
    hints: [
      "A self join joins a table with itself using aliases",
      "Use LEFT JOIN so employees without managers still appear",
      "e.manager_id = m.id connects employee to their manager",
      "Select e.first_name as employee, m.first_name as manager",
    ],
  },
  {
    title: "Window Function: Running Total",
    difficulty: "Hard",
    category: "Window",
    description: "Calculate a running total of order amounts using a window function.",
    question:
      "Write a SQL query that displays each order's date, amount, and a running total of all order amounts up to that point. Use a window function with ORDER BY to achieve this without GROUP BY.",
    sampleTables: [
      {
        tableName: "orders",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "order_date", dataType: "DATE" },
          { columnName: "customer_id", dataType: "INTEGER" },
          { columnName: "amount", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, order_date: "2024-01-05", customer_id: 1, amount: 120.0 },
          { id: 2, order_date: "2024-01-12", customer_id: 3, amount: 85.5 },
          { id: 3, order_date: "2024-01-18", customer_id: 2, amount: 200.0 },
          { id: 4, order_date: "2024-01-25", customer_id: 1, amount: 45.0 },
          { id: 5, order_date: "2024-02-02", customer_id: 4, amount: 310.0 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { order_date: "2024-01-05", amount: 120.0, running_total: 120.0 },
        { order_date: "2024-01-12", amount: 85.5, running_total: 205.5 },
        { order_date: "2024-01-18", amount: 200.0, running_total: 405.5 },
        { order_date: "2024-01-25", amount: 45.0, running_total: 450.5 },
        { order_date: "2024-02-02", amount: 310.0, running_total: 760.5 },
      ],
    },
    hints: [
      "Window functions perform calculations across rows",
      "SUM(amount) OVER (ORDER BY order_date) creates a running total",
      "The OVER() clause defines the window frame",
      "No GROUP BY is needed - window functions work row-by-row",
    ],
  },
  {
    title: "NULL Handling with COALESCE",
    difficulty: "Medium",
    category: "Functions",
    description: "Replace NULL values with defaults using COALESCE in a query.",
    question:
      "Write a SQL query that selects all customers and their phone numbers. Some customers do not have a phone number (NULL). Use COALESCE to display 'N/A' instead of NULL for missing phone numbers.",
    sampleTables: [
      {
        tableName: "customers",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "VARCHAR(100)" },
          { columnName: "email", dataType: "VARCHAR(100)" },
          { columnName: "phone", dataType: "VARCHAR(20)" },
        ],
        rows: [
          { id: 1, name: "Aryan Malhotra", email: "aryan@example.com", phone: "555-0101" },
          { id: 2, name: "Isha Khanna", email: "isha@example.com", phone: null },
          { id: 3, name: "Devansh Agarwal", email: "devansh@example.com", phone: "555-0303" },
          { id: 4, name: "Tanvi Jain", email: "tanvi@example.com", phone: null },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { name: "Aryan Malhotra", contact_phone: "555-0101" },
        { name: "Isha Khanna", contact_phone: "N/A" },
        { name: "Devansh Agarwal", contact_phone: "555-0303" },
        { name: "Tanvi Jain", contact_phone: "N/A" },
      ],
    },
    hints: [
      "COALESCE returns the first non-NULL value from its arguments",
      "COALESCE(phone, 'N/A') replaces NULL with 'N/A'",
      "Use AS to alias the result as contact_phone",
    ],
  },
  {
    title: "INSERT New Records",
    difficulty: "Easy",
    category: "INSERT",
    description: "Insert a new product into the products table with specified values.",
    question:
      "Write a SQL INSERT statement to add a new product to the products table. The new product should be a 'Standing Desk' in the 'Furniture' category, priced at $299.99, with 25 in stock.",
    sampleTables: [
      {
        tableName: "products",
        columns: [
          { columnName: "id", dataType: "SERIAL" },
          { columnName: "product_name", dataType: "VARCHAR(100)" },
          { columnName: "category", dataType: "VARCHAR(50)" },
          { columnName: "price", dataType: "DECIMAL(10,2)" },
          { columnName: "stock_qty", dataType: "INTEGER" },
        ],
        rows: [
          { id: 1, product_name: "Wireless Mouse", category: "Electronics", price: 29.99, stock_qty: 150 },
          { id: 2, product_name: "USB Keyboard", category: "Electronics", price: 49.99, stock_qty: 80 },
        ],
      },
    ],
    expectedOutput: { type: "count", value: 1 },
    hints: [
      "INSERT INTO table_name (columns) VALUES (values)",
      "List column names in parentheses after the table name",
      "String values need single quotes",
      "Numeric values do not need quotes",
    ],
  },
  {
    title: "Correlated Subquery: Department Max",
    difficulty: "Hard",
    category: "Subquery",
    description: "Find the highest-paid employee in each department using a correlated subquery.",
    question:
      "Write a SQL query to find employees who earn the highest salary in their respective department. Use a correlated subquery that references the outer query's department to find the max salary per department.",
    sampleTables: [
      {
        tableName: "employees",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "first_name", dataType: "VARCHAR(50)" },
          { columnName: "department", dataType: "VARCHAR(50)" },
          { columnName: "salary", dataType: "DECIMAL(10,2)" },
        ],
        rows: [
          { id: 1, first_name: "Priya", department: "Engineering", salary: 85000 },
          { id: 2, first_name: "Vikram", department: "Marketing", salary: 62000 },
          { id: 3, first_name: "Neha", department: "Engineering", salary: 91000 },
          { id: 4, first_name: "Rohan", department: "Sales", salary: 70000 },
          { id: 5, first_name: "Ananya", department: "Marketing", salary: 67000 },
          { id: 6, first_name: "Rahul", department: "Engineering", salary: 95000 },
        ],
      },
    ],
    expectedOutput: {
      type: "table",
      value: [
        { first_name: "Rahul", department: "Engineering", salary: 95000 },
        { first_name: "Ananya", department: "Marketing", salary: 67000 },
        { first_name: "Rohan", department: "Sales", salary: 70000 },
      ],
    },
    hints: [
      "A correlated subquery runs once for each row in the outer query",
      "Reference the outer table's department inside the subquery",
      "WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department = e1.department)",
      "Use table aliases to distinguish outer and inner queries",
    ],
  },
];

async function seedDatabase() {
  try {
    await require("mongoose").connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log("Cleared existing assignments");

    // Insert all assignments
    const inserted = await Assignment.insertMany(assignments);
    console.log(`Seeded ${inserted.length} assignments successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seedDatabase();
