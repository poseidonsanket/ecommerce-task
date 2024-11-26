// app/layout.tsx or your main layout file
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header"; // Import the new Header component
import ReduxProvider from "@/components/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Use the Header component here */}
        <ReduxProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
