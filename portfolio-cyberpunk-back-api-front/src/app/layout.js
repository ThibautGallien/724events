"use client";

import "../styles/main.scss";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <ProjectsProvider>
            <Header />
            <main className="main-content">
              {loading ? (
                <div className="loading-screen">
                  <div className="glitch-text" data-text="INITIALIZING SYSTEM">
                    INITIALIZING SYSTEM
                  </div>
                  <div className="loading-bar">
                    <div className="loading-progress"></div>
                  </div>
                  <div className="loading-info">THIBAUT.DEV v2.0.77</div>
                </div>
              ) : (
                children
              )}
            </main>
            <Footer />
          </ProjectsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
