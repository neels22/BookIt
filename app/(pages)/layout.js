import { Header } from "@/components/common/Header";
import { AuthProvider } from "@/context/AuthContext";


export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body
          className={` antialiased`}
        >
          <AuthProvider>

            <Header/>
          {children}
          </AuthProvider>
        </body>
      </html>
    );
  }
  