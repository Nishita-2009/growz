import { BusinessDataSource } from '../types/dataImport';

export const INITIAL_DATA_SOURCES: BusinessDataSource[] = [
  {
    id: 'source-customers',
    category: 'Customers',
    description: 'Customer profiles, contact details, acquisition channels, purchase frequency, and loyalty tiers.',
    supportedFormats: ['CSV', 'XLSX'],
    status: 'Imported',
    recordCount: 1420,
    lastImported: '2026-10-02 14:30',
    fileName: 'customers_export_q3.csv',
    dataQualityScore: 98
  },
  {
    id: 'source-orders',
    category: 'Orders & Sales',
    description: 'Transaction history, line item quantities, order dates, coupon usage, sales tax, and payment methods.',
    supportedFormats: ['CSV', 'XLSX'],
    status: 'Imported',
    recordCount: 4821,
    lastImported: '2026-10-05 09:15',
    fileName: 'sales_transactions_2026.csv',
    dataQualityScore: 95
  },
  {
    id: 'source-products',
    category: 'Products',
    description: 'Product catalog, SKUs, category classifications, wholesale cost, and retail selling price.',
    supportedFormats: ['CSV', 'XLSX'],
    status: 'Ready',
    recordCount: 310,
    lastImported: '2026-09-20 16:45',
    fileName: 'product_catalog_master.csv',
    dataQualityScore: 92
  },
  {
    id: 'source-expenses',
    category: 'Expenses',
    description: 'Operational expenses, vendor payments, payroll totals, marketing ad spend, and overhead costs.',
    supportedFormats: ['CSV', 'XLSX'],
    status: 'Not Uploaded',
    dataQualityScore: 0
  },
  {
    id: 'source-inventory',
    category: 'Inventory',
    description: 'Warehouse stock balances, SKU reorder points, holding costs, and supplier lead times.',
    supportedFormats: ['CSV', 'XLSX'],
    status: 'Not Uploaded',
    dataQualityScore: 0
  },
  {
    id: 'source-marketing',
    category: 'Marketing',
    description: 'Ad channel spend, campaign clicks, impressions, conversion tracking, and email open metrics.',
    supportedFormats: ['CSV', 'XLSX'],
    status: 'Not Uploaded',
    dataQualityScore: 0
  }
];

export const SAMPLE_CSV_DATA: Record<string, { fileName: string; csvContent: string }> = {
  'Orders & Sales': {
    fileName: 'sample_orders_q3.csv',
    csvContent: `Customer Name,Order Date,Product,Qty,Price,Total
Ananya Sharma,2026-09-01,Ergonomic Mechanical Keyboard,1,4500,4500
Rahul Verma,2026-09-01,Wireless Vertical Mouse,2,1200,2400
Priya Patel,2026-09-02,USB-C Multiport Dock,1,3200,3200
Vikram Singh,2026-09-03,UltraWide Monitor Stand,1,2800,2800
Sneha Reddy,2026-09-03,Bluetooth Noise-Canceling Headset,1,5500,5500
Amit Kumar,2026-09-04,Ergonomic Desk Mat,3,800,2400
Kavita Joshi,2026-09-05,Adjustable Laptop Stand,1,1800,1800
Rohan Gupta,2026-09-05,Wireless Ergonomic Keyboard,2,4500,9000
Meera Nair,2026-09-06,HD Webcam 1080p,1,2500,2500
Devendra Rao,2026-09-07,Mechanical Gaming Switch Kit,4,600,2400`
  },
  'Customers': {
    fileName: 'sample_customers_list.csv',
    csvContent: `Customer Name,Email,Phone,City,Total Orders,Lifetime Spend
Ananya Sharma,ananya@example.com,+91 9876543210,Mumbai,5,18500
Rahul Verma,rahul@example.com,+91 9876543211,Delhi,3,8400
Priya Patel,priya@example.com,+91 9876543212,Bengaluru,4,14200
Vikram Singh,vikram@example.com,+91 9876543213,Hyderabad,2,5600
Sneha Reddy,sneha@example.com,+91 9876543214,Chennai,6,22000`
  },
  'Inventory': {
    fileName: 'sample_inventory_levels.csv',
    csvContent: `SKU,Product Name,Current Stock,Reorder Point,Unit Cost,Supplier
SKU-1001,Ergonomic Mechanical Keyboard,42,15,2800,TechCraft Supplies
SKU-1002,Wireless Vertical Mouse,8,20,650,PeriphCorp
SKU-1003,USB-C Multiport Dock,65,25,1900,DockMaster Ltd
SKU-1004,Bluetooth Noise-Canceling Headset,12,10,3400,SoundAudio Inc`
  },
  'Expenses': {
    fileName: 'sample_monthly_expenses.csv',
    csvContent: `Expense Date,Category,Vendor,Amount,Payment Method
2026-09-01,Rent & Operations,Metro Commercial Realty,45000,Bank Transfer
2026-09-02,Marketing Ad Spend,Meta Ads Platform,18500,Credit Card
2026-09-05,Software Subscriptions,Shopify & SaaS Suite,8200,Credit Card
2026-09-10,Raw Inventory,TechCraft Supplies,85000,Bank Transfer`
  }
};
