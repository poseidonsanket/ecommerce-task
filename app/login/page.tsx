import { Metadata } from 'next';
import LoginForm from '../../components/LoginForm';

export const metadata: Metadata = {
  title: 'Ecommerce Prototype - Login',
  description: 'Log in to your account to access your cart and order history.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <LoginForm />
    </div>
  );
}

