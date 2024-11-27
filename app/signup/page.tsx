import { Metadata } from 'next';
import SignupForm from '../../components/SignupForm';

export const metadata: Metadata = {
  title: 'Ecommerce Prototype - Sign Up',
  description: 'Create a new account to start shopping with us.',
};

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <SignupForm />
    </div>
  );
}

