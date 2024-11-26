import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Ecommerce Prototype - Home',
  description: 'Welcome to our Ecommerce Prototype. Browse our wide range of products.',
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-100 to-white">
      <h1 className="text-5xl font-bold mb-8 text-center">Welcome to Our Ecommerce Store</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">Discover a world of amazing products at your fingertips. Start shopping now and experience the future of online retail.</p>
      <div className="flex space-x-4">
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline" size="lg">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}

