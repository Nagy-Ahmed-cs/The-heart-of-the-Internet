import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Reddit - Dive into anything",
  description: "Reddit is a network of communities where people can dive into their interests, hobbies and passions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased">
        <Navbar />
        <main className="pt-12">{children}</main>
      </body>
    </html>
  );
}
