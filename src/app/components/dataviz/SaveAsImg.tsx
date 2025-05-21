import useTranslation from '@/app/i18n/client';
import { Button } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';

interface SvgToImageProps {
  svgRef: React.RefObject<SVGSVGElement>;
}

const SaveAsImg: React.FC<SvgToImageProps> = ({ svgRef }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'translation');

  // **Extract & Inline CSS Styles**
  const inlineStyles = (svgElement: SVGSVGElement) => {
    let css = '';

    // Extract styles from all stylesheets
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        css = Array.from(sheet.cssRules || []).reduce(
          (acc, rule) => `${acc}${rule.cssText}\n`,
          ''
        );
      } catch (e) {
        console.warn('Could not access stylesheet:', sheet, e);
      }
    });

    // Create a <style> tag inside <defs>
    const styleElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'style'
    );
    styleElement.textContent = css;

    const defs =
      svgElement.querySelector('defs') ||
      document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.appendChild(styleElement);
    svgElement.insertBefore(defs, svgElement.firstChild);
  };

  // **Convert SVG to PNG & Download**
  const downloadSVGAsImage = (format: 'png' | 'jpeg') => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current.cloneNode(true) as SVGSVGElement;
    inlineStyles(svgElement);

    // Extract width and height from the SVG element
    let width = parseFloat(svgElement.getAttribute('width') || '2000'); // Default to 800px if not set
    let height = parseFloat(svgElement.getAttribute('height') || '1600'); // Default to 600px if not set

    if (svgElement.hasAttribute('viewBox')) {
      const viewBoxValues = svgElement
        .getAttribute('viewBox')
        ?.split(' ')
        .map(Number);
      if (viewBoxValues && viewBoxValues.length === 4) {
        [, , width, height] = viewBoxValues; // Width and Height from viewBox
      }
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const scaleFactor = 2;

    // Set correct canvas size
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    ctx?.scale(scaleFactor, scaleFactor); // Scale the canvas before drawing

    img.onload = () => {
      ctx?.clearRect(0, 0, width, height);
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert Canvas to Image URL
      const imageURL = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `chart.${format}`;
      link.click();
    };

    // Convert SVG string to base64
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
  };

  return (
    <Button
      fontSize='small'
      paddingTop='xxs'
      paddingBottom='xxs'
      color='#fff'
      onClick={() => downloadSVGAsImage('png')}
    >
      {t('download_png')}
    </Button>
  );
};

export default SaveAsImg;
