import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stok Yonetimi",
  description: "Stok yonetim uygulamasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="max-w-7xl mx-auto px-6">
      {children}
      </div>
    
      </body>
    </html>
  );
}
