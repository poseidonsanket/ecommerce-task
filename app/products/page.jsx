import { Suspense } from "react";
import pool from "@/lib/db";
import ProductList from "@/components/ProductList";
import PaginationControls from "@/components/PaginationControls";
import ProductListSkeleton from "@/components/ProductListSkeleton";
import ProductFilterForm from "@/components/ProductFilterForm";

// Enhanced function to build dynamic SQL query with filters
async function getProducts(options) {
  const { page = 1, category, minPrice, maxPrice, search } = options;

  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    // Build where clause dynamically
    const whereClauses = [];
    const queryParams = [];
    let paramCount = 1;

    if (category) {
      whereClauses.push(`category = $${paramCount}`);
      queryParams.push(category);
      paramCount++;
    }

    if (minPrice !== undefined) {
      whereClauses.push(`price >= $${paramCount}`);
      queryParams.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      whereClauses.push(`price <= $${paramCount}`);
      queryParams.push(maxPrice);
      paramCount++;
    }

    if (search) {
      whereClauses.push(
        `(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    console.log("params" + paramCount);

    // Construct the full query
    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const productsQuery = `
      SELECT * FROM products 
      ${whereClause} 
      ORDER BY id 
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    // Add limit and offset to query params
    queryParams.push(limit, offset);

    // Execute queries
    const [productsResult, totalCountResult] = await Promise.all([
      pool.query(productsQuery, queryParams),
      pool.query(countQuery, queryParams.slice(0, -2)),
    ]);

    const total = parseInt(totalCountResult.rows[0].count, 10);

    return {
      products: productsResult.rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export default async function ProductsPage({
  searchParams,
}
) {
  const page = parseInt(searchParams?.page || "1", 10);
  const category = searchParams?.category;
  const minPrice = searchParams?.minPrice
    ? parseFloat(searchParams?.minPrice)
    : undefined;
  const maxPrice = searchParams?.maxPrice
    ? parseFloat(searchParams?.maxPrice)
    : undefined;
  const search = searchParams?.search;

  const { products, currentPage, totalPages } = await getProducts({
    page,
    category,
    minPrice,
    maxPrice,
    search,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <ProductFilterForm
        initialCategory={category}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
        initialSearch={search}
      />

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList products={products} />
      </Suspense>

      <div className="mt-8">
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

