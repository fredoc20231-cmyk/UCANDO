import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BgTheme = "day" | "night" | "sky";

interface BackgroundContextType {
  bgTheme: BgTheme;
  setBgTheme: (theme: BgTheme) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [bgTheme, setBgTheme] = useState<BgTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ucando_bg_theme") as BgTheme;
      if (saved === "day" || saved === "night" || saved === "sky") return saved;
    }
    return "day";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-bg-theme", bgTheme);

    if (bgTheme === "day") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }

    localStorage.setItem("ucando_bg_theme", bgTheme);
  }, [bgTheme]);

  return (
    <BackgroundContext.Provider value={{ bgTheme, setBgTheme }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackgroundTheme() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackgroundTheme must be used within a BackgroundProvider");
  }
  return context;
}
