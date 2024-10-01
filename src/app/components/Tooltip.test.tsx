import { render, screen } from '@testing-library/react';
import MyTooltip from './Tooltip'; // Adjust the import path as necessary

describe('MyTooltip Component', () => {
  it('should not show tooltip when showTooltip is false', () => {
    render(
      <MyTooltip showTooltip={false} tooltipMsg='Tooltip message'>
        <button>Hover me</button>
      </MyTooltip>
    );
    const tooltip = screen.queryByText(/Tooltip message/i);
    expect(tooltip).not.toBeVisible(); // Check that the tooltip is not visible
  });

  it('should show tooltip when showTooltip is true', () => {
    render(
      <MyTooltip showTooltip tooltipMsg='Tooltip message'>
        <button>Hover me</button>
      </MyTooltip>
    );

    // Tooltip should be in the document
    expect(screen.getByText(/Tooltip message/i)).toBeInTheDocument();
  });

  it('should show tooltip description when provided', () => {
    render(
      <MyTooltip
        showTooltip
        tooltipMsg='Tooltip message'
        tooltipDesc='Tooltip description'
      >
        <button>Hover me</button>
      </MyTooltip>
    );

    // Tooltip should show the description
    expect(screen.getByText(/Tooltip description/i)).toBeInTheDocument();
  });

  it('should determine if the tooltip is big based on the tooltip message length', () => {
    const longMessage =
      'This is a long tooltip message that exceeds fifty characters and should trigger the big tooltip style.';
    render(
      <MyTooltip showTooltip tooltipMsg={longMessage}>
        <button>Hover me</button>
      </MyTooltip>
    );
    // Tooltip should be rendered
    expect(screen.getByText(longMessage)).toBeInTheDocument();

    // Check the visibility and size of the tooltip (this could be done with jest-styled-components)
    const tooltip = screen.getByText(longMessage).closest('span'); // Adjust the selector based on your component's structure
    expect(tooltip).toHaveStyleRule('width: 300%'); // Check if the tooltip is styled as big
  });
});
