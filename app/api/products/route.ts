import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Parse filter parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice") 
    ? parseFloat(searchParams.get("minPrice")!) 
    : undefined;
  const maxPrice = searchParams.get("maxPrice") 
    ? parseFloat(searchParams.get("maxPrice")!) 
    : undefined;
  const search = searchParams.get("search") || undefined;

  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    // Build where clause dynamically
    const whereClauses: string[] = [];
    const queryParams: any[] = [];
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
      whereClauses.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Construct the full query
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
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
      pool.query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(totalCountResult.rows[0].count, 10);

    return NextResponse.json({
      products: productsResult.rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}