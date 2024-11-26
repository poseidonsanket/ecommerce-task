import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { verifyToken } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `,
      [userId]
    );

    client.release();

    return NextResponse.json({ cartItems: result.rows });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    const client = await pool.connect();

    // Check if the product already exists in the cart for the user
    const existingCartItem = await client.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (existingCartItem.rows.length > 0) {
      // If the item exists, update the quantity
      const newQuantity = existingCartItem.rows[0].quantity + quantity;

      if (newQuantity <= 0) {
        // If the new quantity is zero or less, delete the item from the cart
        await client.query(
          "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
          [userId, productId]
        );
      } else {
        // If the new quantity is greater than zero, update the quantity
        await client.query(
          "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
          [newQuantity, userId, productId]
        );
      }
    } else {
      // If the item doesn't exist, insert a new row
      if (quantity > 0) {
        await client.query(
          "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
          [userId, productId, quantity]
        );
      }
    }

    client.release();

    return NextResponse.json({ message: "Item updated in cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("id");

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    await client.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
      [cartItemId, userId]
    );

    client.release();

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
