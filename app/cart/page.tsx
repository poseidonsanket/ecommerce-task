import { Metadata } from 'next';
import CartItems from '../../components/CartItems';

export const metadata: Metadata = {
  title: 'Ecommerce Prototype - Cart',
  description: 'View and manage your shopping cart.',
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      <CartItems />
    </div>
  );
}

