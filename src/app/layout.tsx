// app/layout.tsx

import Providers from "./providers";
import AuthButton from "@/components/AuthButton";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Tasks Generator",
  description:
    "Mini planning tool to generate user stories and engineering tasks",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-light d-flex flex-column min-vh-100">
        <Providers>
          {/* Bootstrap JS */}
          <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
            strategy="afterInteractive"
          />

          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
              <a className="navbar-brand fw-semibold" href="/">
                Tasks Generator
              </a>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse"
                id="navbarNav"
              >
                <ul className="navbar-nav ms-auto align-items-center">
                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard">
                      Dashboard
                    </a>
                  </li>

                  <li className="nav-item ms-2">
                    <AuthButton />
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="container py-5 flex-grow-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-dark text-white text-center py-3 mt-auto">
            <small>
              © {new Date().getFullYear()} Tasks Generator
            </small>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
