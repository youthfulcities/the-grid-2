import * as d3 from 'd3';
import calculateLuminance from './calculateLuminance';

const shouldUseWhiteText = (color: string) => {
  const rgb = d3.rgb(color);
  const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  return luminance < 0.3;
};

export default shouldUseWhiteText;
