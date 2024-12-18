import { Metadata } from "next";
import { notFound } from "next/navigation";
import pool from "../../../lib/db";
import AddToCartButton from "../../../components/AddToCartButton";



// Fetch product from the database
async function getProduct(id) {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  } finally {
    client.release();
  }
}

// Generate metadata for SEO (title and description)
export async function generateMetadata({
  params,
}) {
  const product = await getProduct(parseInt(params.id));

  return product
    ? {
        title: `${product.name} - Ecommerce Prototype`,
        description: product.description,
      }
    : {
        title: "Product Not Found",
      };
}

// Default page component
export default async function ProductPage({ params }) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    notFound(); // Trigger 404 if product is not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-4">${product.price}</p>
          <p className="text-sm text-gray-500 mb-4">
            Category: {product.category}
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
