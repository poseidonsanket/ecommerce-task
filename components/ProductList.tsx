import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import AddToCartButton from "./AddToCartButton";
import { Button } from "./ui/button";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden shadow-lg"
        >
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            </Link>
            <h3 className="text-md font-semibold mb-2">{product.category}</h3>
            <p className="text-gray-600 mb-4">${product.price}</p>
            <Link href={`/products/${product.id}`}>
              <Button className="mr-4">View Details</Button>
            </Link>

            <AddToCartButton productId={product.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
