// sample_datasets.js - High quality realistic datasets for Data Analyst practice
const customers = [
  { customer_id: 101, full_name: "Aarav Sharma", email: "aarav.sharma@example.in", city: "Mumbai", state: "Maharashtra", segment: "Consumer", signup_date: "2024-01-15" },
  { customer_id: 102, full_name: "Priya Patel", email: "priya.patel@example.in", city: "Ahmedabad", state: "Gujarat", segment: "Corporate", signup_date: "2024-02-10" },
  { customer_id: 103, full_name: "Rohan Gupta", email: "rohan.gupta@example.in", city: "Delhi", state: "Delhi", segment: "Home Office", signup_date: "2024-02-22" },
  { customer_id: 104, full_name: "Ananya Iyer", email: "ananya.iyer@example.in", city: "Bengaluru", state: "Karnataka", segment: "Consumer", signup_date: "2024-03-05" },
  { customer_id: 105, full_name: "Vikram Malhotra", email: "vikram.m@example.in", city: "Pune", state: "Maharashtra", segment: "Corporate", signup_date: "2024-03-18" },
  { customer_id: 106, full_name: "Neha Verma", email: "neha.verma@example.in", city: "Lucknow", state: "Uttar Pradesh", segment: "Consumer", signup_date: "2024-04-02" },
  { customer_id: 107, full_name: "Kabir Singh", email: "kabir.s@example.in", city: "Chandigarh", state: "Punjab", segment: "Home Office", signup_date: "2024-04-14" },
  { customer_id: 108, full_name: "Meera Reddy", email: "meera.reddy@example.in", city: "Hyderabad", state: "Telangana", segment: "Corporate", signup_date: "2024-05-01" },
  { customer_id: 109, full_name: "Arjun Nair", email: "arjun.nair@example.in", city: "Kochi", state: "Kerala", segment: "Consumer", signup_date: "2024-05-20" },
  { customer_id: 110, full_name: "Sanya Roy", email: "sanya.roy@example.in", city: "Kolkata", state: "West Bengal", segment: "Consumer", signup_date: "2024-06-11" }
];

const products = [
  { product_id: 501, product_name: "Ergonomic Mesh Chair", category: "Furniture", sub_category: "Chairs", unit_cost: 4500, unit_price: 7999, stock_qty: 45 },
  { product_id: 502, product_name: "Wireless Mechanical Keyboard", category: "Technology", sub_category: "Accessories", unit_cost: 2200, unit_price: 3999, stock_qty: 120 },
  { product_id: 503, product_name: "4K IPS Ultra HD Monitor 27\"", category: "Technology", sub_category: "Displays", unit_cost: 16000, unit_price: 24999, stock_qty: 30 },
  { product_id: 504, product_name: "Motorized Height Adjustable Desk", category: "Furniture", sub_category: "Desks", unit_cost: 18000, unit_price: 28500, stock_qty: 15 },
  { product_id: 505, product_name: "Active Noise Cancelling Headset", category: "Technology", sub_category: "Audio", unit_cost: 5000, unit_price: 8999, stock_qty: 65 },
  { product_id: 506, product_name: "Premium Leather Notebook & Pen", category: "Office Supplies", sub_category: "Stationery", unit_cost: 250, unit_price: 799, stock_qty: 250 },
  { product_id: 507, product_name: "Heavy Duty Paper Shredder", category: "Office Supplies", sub_category: "Equipment", unit_cost: 3200, unit_price: 5499, stock_qty: 20 },
  { product_id: 508, product_name: "USB-C Dual HDMI Multiport Hub", category: "Technology", sub_category: "Accessories", unit_cost: 1100, unit_price: 2299, stock_qty: 95 }
];

const orders = [
  { order_id: 1001, customer_id: 101, product_id: 501, order_date: "2024-07-01", quantity: 2, discount_pct: 0.05, total_amount: 15198.10, payment_status: "Paid", shipping_region: "West" },
  { order_id: 1002, customer_id: 103, product_id: 503, order_date: "2024-07-03", quantity: 1, discount_pct: 0.10, total_amount: 22499.10, payment_status: "Paid", shipping_region: "North" },
  { order_id: 1003, customer_id: 104, product_id: 502, order_date: "2024-07-05", quantity: 3, discount_pct: 0.00, total_amount: 11997.00, payment_status: "Paid", shipping_region: "South" },
  { order_id: 1004, customer_id: 102, product_id: 504, order_date: "2024-07-08", quantity: 2, discount_pct: 0.15, total_amount: 48450.00, payment_status: "Paid", shipping_region: "West" },
  { order_id: 1005, customer_id: 105, product_id: 505, order_date: "2024-07-12", quantity: 1, discount_pct: 0.00, total_amount: 8999.00, payment_status: "Paid", shipping_region: "West" },
  { order_id: 1006, customer_id: 106, product_id: 506, order_date: "2024-07-15", quantity: 10, discount_pct: 0.20, total_amount: 6392.00, payment_status: "Paid", shipping_region: "North" },
  { order_id: 1007, customer_id: 107, product_id: 508, order_date: "2024-07-19", quantity: 4, discount_pct: 0.05, total_amount: 8736.20, payment_status: "Paid", shipping_region: "North" },
  { order_id: 1008, customer_id: 108, product_id: 501, order_date: "2024-07-22", quantity: 5, discount_pct: 0.10, total_amount: 35995.50, payment_status: "Paid", shipping_region: "South" },
  { order_id: 1009, customer_id: 101, product_id: 502, order_date: "2024-07-25", quantity: 1, discount_pct: 0.00, total_amount: 3999.00, payment_status: "Paid", shipping_region: "West" },
  { order_id: 1010, customer_id: 109, product_id: 507, order_date: "2024-07-29", quantity: 1, discount_pct: 0.05, total_amount: 5224.05, payment_status: "Paid", shipping_region: "South" },
  { order_id: 1011, customer_id: 110, product_id: 503, order_date: "2024-08-02", quantity: 1, discount_pct: 0.00, total_amount: 24999.00, payment_status: "Paid", shipping_region: "East" },
  { order_id: 1012, customer_id: 104, product_id: 504, order_date: "2024-08-06", quantity: 1, discount_pct: 0.10, total_amount: 25650.00, payment_status: "Paid", shipping_region: "South" },
  { order_id: 1013, customer_id: 103, product_id: 505, order_date: "2024-08-11", quantity: 2, discount_pct: 0.05, total_amount: 17098.10, payment_status: "Paid", shipping_region: "North" },
  { order_id: 1014, customer_id: 105, product_id: 508, order_date: "2024-08-15", quantity: 2, discount_pct: 0.00, total_amount: 4598.00, payment_status: "Paid", shipping_region: "West" },
  { order_id: 1015, customer_id: 102, product_id: 501, order_date: "2024-08-20", quantity: 3, discount_pct: 0.05, total_amount: 22797.15, payment_status: "Paid", shipping_region: "West" }
];

const employee_churn = [
  { emp_id: "E01", department: "Sales", tenure_months: 24, satisfaction_score: 3.8, last_evaluation: 0.72, monthly_salary: 58000, left_company: 0 },
  { emp_id: "E02", department: "Engineering", tenure_months: 14, satisfaction_score: 2.1, last_evaluation: 0.88, monthly_salary: 92000, left_company: 1 },
  { emp_id: "E03", department: "Support", tenure_months: 36, satisfaction_score: 4.5, last_evaluation: 0.79, monthly_salary: 42000, left_company: 0 },
  { emp_id: "E04", department: "Marketing", tenure_months: 8, satisfaction_score: 1.9, last_evaluation: 0.54, monthly_salary: 51000, left_company: 1 },
  { emp_id: "E05", department: "Finance", tenure_months: 48, satisfaction_score: 4.2, last_evaluation: 0.85, monthly_salary: 76000, left_company: 0 },
  { emp_id: "E06", department: "Sales", tenure_months: 18, satisfaction_score: 2.4, last_evaluation: 0.69, monthly_salary: 61000, left_company: 1 },
  { emp_id: "E07", department: "Engineering", tenure_months: 30, satisfaction_score: 4.0, last_evaluation: 0.91, monthly_salary: 98000, left_company: 0 },
  { emp_id: "E08", department: "Support", tenure_months: 12, satisfaction_score: 2.3, last_evaluation: 0.62, monthly_salary: 39000, left_company: 1 }
];

module.exports = {
  customers,
  products,
  orders,
  employee_churn
};
