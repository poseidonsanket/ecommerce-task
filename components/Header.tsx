// components/Header.tsx
"use client";
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { login, logout } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { setTotalItems } from "@/store/cartSlice";

export const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const islogin = useSelector((state: RootState) => state.auth.isLogin);
  const totalCartItems = useSelector(
    (state: RootState) => state.totalCartItems.totalItems
  );
  console.log(totalCartItems);

  useEffect(() => {
    const authtoken = localStorage.getItem("token");
    console.log(authtoken);
    if (authtoken) {
      //@ts-ignore
      dispatch(login({ token: authtoken }));
    }

    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const totalQuantity = data.cartItems.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        dispatch(setTotalItems(totalQuantity));
      } else {
        console.error("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout()); // Dispatch logout action
    router.push("/");
    setTimeout(() => {
      window.location.reload()
    }, 100)
  };

  const pathname = usePathname(); // Get the current pathname

  // useEffect(() => {
  //   if (pathname === "/") {
  //     window.location.reload(); // Reload the page when the pathname is "/"
  //   }
  // }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 ml-2">
            <span className="hidden font-bold sm:inline-block">Ecommerce</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/products">Products</Link>
            <Link href="/cart">Cart</Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="mr-2 md:hidden ml-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col space-y-4">
              <Link href="/">
                <button>Home</button>
              </Link>
              <Link href="/products">
                <button>Products</button>
              </Link>
              <Link href="/cart">
                <div className="relative">
                  <button>Cart</button>
                  {totalCartItems > 0 && (
                    <span className="absolute bottom-3 left-9 inline-flex items-center justify-center h-4 w-4 rounded-full bg-black text-white text-xs font-semibold">
                      {totalCartItems}
                    </span>
                  )}
                </div>
              </Link>
              {!islogin ? (
                <div>
                  <Link href="/login">
                    <button>Login</button>
                  </Link>
                  <br></br>
                  <div className="mt-2"></div>
                  <Link href="/signup">
                    <button>Sign Up</button>
                  </Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="text-left">
                  Logout
                </button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="lg:flex flex-1 items-center justify-between space-x-2 md:justify-end hidden">
          <nav className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {/* Cart Item Count Badge */}
                  {totalCartItems > 0 && (
                    <span className="absolute bottom-2 left-3 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-semibold">
                      {totalCartItems}
                    </span>
                  )}
                </div>
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            {!islogin ? (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
