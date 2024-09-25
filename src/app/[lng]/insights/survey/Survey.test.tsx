import { useDimensions } from '@/hooks/useDimensions';
import { fireEvent, render, screen } from '@testing-library/react';
import Survey from './page';

// Mock the useDimensions hook to return a fixed width
jest.mock('@/hooks/useDimensions', () => ({
  useDimensions: jest.fn(),
}));

// Mock the config and Amplify
jest.mock('@/amplifyconfiguration.json', () => ({
  aws_project_region: 'mock-region',
  aws_cognito_identity_pool_id: 'mock-identity-pool-id',
  aws_cognito_region: 'mock-region',
  aws_user_pools_id: 'mock-user-pools-id',
  aws_user_pools_web_client_id: 'mock-client-id',
  oauth: {},
}));

jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

// Mock the components that are imported in the Survey component
jest.mock('@/app/components/dataviz/BarChart', () => {
  return ({ setTooltipState }) => (
    <div
      onMouseEnter={() =>
        setTooltipState({
          position: { x: 10, y: 20 },
          content: 'Mocked Tooltip',
        })
      }
    >
      Mocked BarChart
    </div>
  );
});
jest.mock('@/app/components/dataviz/Clusters', () => () => (
  <div>Mocked Clusters</div>
));
jest.mock('@/app/components/dataviz/Demographics', () => () => (
  <div>Mocked Demographics</div>
));
jest.mock('@/app/components/dataviz/TooltipChart', () => () => (
  <div>Mocked Tooltip</div>
));
jest.mock('@/app/components/Drawer', () => {
  return ({ isOpen, onOpen, onClose, children }) => (
    <div>
      <div>{isOpen ? 'Drawer Open' : 'Drawer Closed'}</div>
      <div>
        <button onClick={onOpen}>Open Drawer</button>
        <button onClick={onClose}>Close Drawer</button>
      </div>
      <div>{children}</div>
      <div className='tab'>Tab Visible</div>
    </div>
  );
});
jest.mock('@/app/components/Accordion', () => ({ title, children }) => (
  <div>
    {`Accordion: ${title}`}
    {children}
  </div>
));

describe('Survey Component', () => {
  beforeEach(() => {
    (useDimensions as jest.Mock).mockReturnValue({ width: 1000 });
  });

  test('renders the Survey component correctly', () => {
    render(<Survey />);

    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    expect(
      screen.getByText(/What’s up with work lately?/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked BarChart')).toBeInTheDocument();
    expect(screen.getByText(/Psychographic/i)).toBeInTheDocument();
  });

  test('handles tab changes correctly', () => {
    render(<Survey />);
    expect(screen.getByText(/Psychographic/i)).toBeInTheDocument();
    const cityTabButton = screen.getByRole('tab', { name: /city/i });
    expect(cityTabButton).toBeInTheDocument();
  });

  test('opens and closes the drawer', () => {
    render(<Survey />);
    expect(screen.getByText(/Drawer Closed/i)).toBeInTheDocument();
    expect(screen.getByText(/Tab Visible/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Open Drawer/i));
    expect(screen.getByText(/Drawer Open/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Close Drawer/i));
    expect(screen.getByText(/Drawer Closed/i)).toBeInTheDocument();
  });

  test('renders Accordion and Clusters component', () => {
    render(<Survey />);
    expect(
      screen.getByText(/Accordion: Examine clusters/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked Clusters')).toBeInTheDocument();
  });

  test('renders Tooltip when tooltipState.position is set', () => {
    render(<Survey />);

    // Tooltip should not be visible initially
    expect(screen.queryByText('Mocked Tooltip')).toBeNull();

    // Simulate hovering over the BarChart to set tooltipState.position
    fireEvent.mouseEnter(screen.getByText('Mocked BarChart'));

    // Tooltip should be rendered
    expect(screen.getByText('Mocked Tooltip')).toBeInTheDocument();
  });
});
