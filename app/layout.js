
import { Header } from "@/components/common/Header";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Header/>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
