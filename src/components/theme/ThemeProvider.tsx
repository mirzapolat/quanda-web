
import { createContext, useContext, useEffect, useState } from "react";
import { generateRandomPastelColor } from "@/utils/colors";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  // Apply random pastel color on initial render
  useEffect(() => {
    const randomPastelColor = generateRandomPastelColor();
    const root = window.document.documentElement;
    
    // Update CSS variables for accent colors in both light and dark modes
    root.style.setProperty('--accent', randomPastelColor);
    
    // Create a slightly darker version for the dark mode accent
    const [hue, saturation, lightness] = randomPastelColor.split(' ');
    const lightnessValue = parseInt(lightness);
    const darkerLightness = Math.max(lightnessValue - 60, 20) + '%';
    const darkerColor = `${hue} ${saturation} ${darkerLightness}`;
    root.style.setProperty('--accent-dark', darkerColor);
    
    console.log("Applied random pastel color:", randomPastelColor);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
