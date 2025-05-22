
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

// Define a type for our color object
interface AccentColor {
  r: number;
  g: number;
  b: number;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor; // Changed from string to AccentColor
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to generate a random pastel color
const generateRandomPastelColor = () => {
  // Use higher base values (130-220) to ensure pastel-like colors
  const r = Math.floor(Math.random() * 90 + 130);
  const g = Math.floor(Math.random() * 90 + 130);
  const b = Math.floor(Math.random() * 90 + 130);
  return { r, g, b };
};

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme;
      return stored || "system";
    } catch {
      return "system";
    }
  });

  // Generate a random pastel color on initial load
  const [accentColor] = useState(() => {
    return generateRandomPastelColor();
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }

    // Apply the accent color to CSS variables
    const { r, g, b } = accentColor;
    
    // Set main accent color
    root.style.setProperty('--accent-r', r.toString());
    root.style.setProperty('--accent-g', g.toString());
    root.style.setProperty('--accent-b', b.toString());
    
    // Create lighter version for light mode accent
    root.style.setProperty('--accent-light-r', Math.min(r + 35, 255).toString());
    root.style.setProperty('--accent-light-g', Math.min(g + 35, 255).toString());
    root.style.setProperty('--accent-light-b', Math.min(b + 35, 255).toString());
    
    // Create darker version for dark mode accent
    root.style.setProperty('--accent-dark-r', Math.max(r - 70, 0).toString());
    root.style.setProperty('--accent-dark-g', Math.max(g - 70, 0).toString());
    root.style.setProperty('--accent-dark-b', Math.max(b - 70, 0).toString());
    
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme, accentColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
