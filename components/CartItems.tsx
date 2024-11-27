"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import {
  incrementItemCount,
  decrementItemCount,
  setTotalItems,
} from "@/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const response = await fetch("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCartItems(data.cartItems);
    } else {
      console.error("Failed to fetch cart items");
    }
  };

  const removeFromCart = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const response = await fetch(`/api/cart?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      fetchCartItems();
      dispatch(decrementItemCount());
    } else {
      console.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (
    id: number,
    productId: number,
    quantityChange: number
  ) => {
    if (quantityChange > 0) {
      dispatch(incrementItemCount());
    } else {
      dispatch(decrementItemCount());
    }
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Find the current item to check current quantity
    const currentItem = cartItems.find((item) => item.id === id);
    if (!currentItem) return;

    // Prevent quantity from going below 1
    const newQuantity = currentItem.quantity + quantityChange;

    // If new quantity is zero, remove the item
    if (newQuantity === 0 || newQuantity <= 0) {
      await removeFromCart(id);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantityChange,
        }),
      });

      if (response.ok) {
        // Optimistically update the local state
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update cart item quantity");
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Your cart is empty.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Price: ${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.product_id, -1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.product_id, 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <p className="font-semibold">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
