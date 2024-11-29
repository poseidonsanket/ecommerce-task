# 🛒 Ecommerce Task - Next.js Full-Stack Project

## 📝 Project Overview

This is a full-stack ecommerce website built using Next.js, demonstrating advanced web development skills including server-side rendering, SEO optimization, and robust API development.

## 🌐 Project Links

- **Live Demo**: https://ecommerce-task-azure.vercel.app/
- **GitHub Repository**: https://github.com/poseidonsanket/ecommerce-task

## 🚀 Technologies Used

- **Frontend**: Next.js
- **Backend**: PostgreSQL (Neon Database)
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🔧 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

## 💻 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/poseidonsanket/ecommerce-task.git
cd ecommerce-task
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Connection
NEXT_PUBLIC_DB_USER=neondb_owner
NEXT_PUBLIC_DB_PASSWORD=your_database_password
NEXT_PUBLIC_DB_HOST=your_database_host
NEXT_PUBLIC_DB_PORT=5432
NEXT_PUBLIC_DB_DATABASE=ecommerce_task
NEXT_PUBLIC_DB_SSL=true

# Authentication
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Database Setup

Run the following SQL commands to initialize your database:

```sql
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Products
INSERT INTO products (name, description, price, category) VALUES 
('Laptop', 'High-performance laptop', 999.99, 'Electronics'),
('Smartphone', 'Latest model smartphone', 699.99, 'Electronics'),
('T-shirt', 'Cotton t-shirt', 19.99, 'Clothing'),
('Jeans', 'Denim jeans', 49.99, 'Clothing'),
('Coffee Maker', 'Automatic coffee maker', 79.99, 'Home Appliances'),
('Blender', 'High-speed blender', 59.99, 'Home Appliances'),
('Running Shoes', 'Comfortable running shoes', 89.99, 'Footwear'),
('Backpack', 'Durable backpack', 39.99, 'Accessories'),
('Headphones', 'Noise-cancelling headphones', 149.99, 'Electronics'),
('Watch', 'Stylish wristwatch', 129.99, 'Accessories');
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

## ✨ Features

- 🖥️ Server-side rendering for optimal performance
- 🔐 Secure user authentication with JWT
- 📦 Dynamic product listing and categorization
- 🛍️ Interactive shopping cart functionality
- 📱 Fully responsive design
- 🔍 SEO-optimized pages

## 🌈 API Endpoints

- `/api/products`: Retrieve product list
- `/api/cart`: Manage cart items
- `/api/auth/login`: User authentication
- `/api/auth/register`: User registration

## 🚀 Deployment

The project is deployed on Vercel and accessible at the provided live demo URL.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
