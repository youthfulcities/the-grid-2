import * as d3 from 'd3';

// Helper: convert any color to greyscale by removing saturation
const toGreyscale = (hexColor: string): string => {
  const c = d3.color(hexColor); // returns Color | null
  if (!c) return '#ccc';

  // Convert to HSL explicitly
  const hsl = d3.hsl(c); // Safe even if original was RGB/Hex
  hsl.s = 0; // remove saturation
  return hsl.formatHex(); // or .toString() for `hsl(...)` format
};

export default toGreyscale;
