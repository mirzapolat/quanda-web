
/**
 * Generates a random pastel color in HSL format
 * @returns HSL color string (e.g., "195 83% 90%")
 */
export function generateRandomPastelColor(): string {
  // Generate a random hue (0-360)
  const hue = Math.floor(Math.random() * 360);
  
  // For pastels, we want high lightness and medium-low saturation
  const saturation = Math.floor(Math.random() * 30) + 50; // 50-80%
  const lightness = Math.floor(Math.random() * 15) + 80; // 80-95%
  
  return `${hue} ${saturation}% ${lightness}%`;
}
