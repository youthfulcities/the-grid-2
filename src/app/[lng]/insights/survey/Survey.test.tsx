import { useDimensions } from '@/hooks/useDimensions';
import { fireEvent, render, screen } from '@testing-library/react';
import Survey from './page';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

interface BarChartProps {
  setTooltipState: (state: {
    position: { x: number; y: number };
    content: string;
  }) => void;
}

interface DrawerProps {
  isopen: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

jest.mock(
  '../../../../amplifyconfiguration.json',
  () => ({
    aws_project_region: 'mock-region',
    aws_cognito_identity_pool_id: 'mock-identity-pool-id',
    aws_cognito_region: 'mock-region',
    aws_user_pools_id: 'mock-user-pools-id',
    aws_user_pools_web_client_id: 'mock-client-id',
    oauth: {},
  }),
  { virtual: true }
);

// Mock the useDimensions hook to return a fixed width
jest.mock('@/hooks/useDimensions', () => ({
  useDimensions: jest.fn(),
}));

// Mock the components that are imported in the Survey component
jest.mock('@/app/components/dataviz/BarChart', () => {
  return ({ setTooltipState }: BarChartProps) => (
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
  return ({ isopen, onOpen, onClose, children }: DrawerProps) => (
    <div>
      <div>{isopen ? 'Drawer Open' : 'Drawer Closed'}</div>
      <div>
        <button onClick={onOpen}>Open Drawer</button>
        <button onClick={onClose}>Close Drawer</button>
      </div>
      <div>{children}</div>
      <div className='tab'>Tab Visible</div>
    </div>
  );
});

jest.mock(
  '@/app/components/Accordion',
  () =>
    ({ title, children }: AccordionProps) => (
      <div>
        {`Accordion: ${title}`}
        {children}
      </div>
    )
);

describe('Survey Component', () => {
  beforeEach(() => {
    (useDimensions as jest.Mock).mockReturnValue({ width: 1000 });
    jest.clearAllMocks();
  });

  test('renders the Survey component correctly', () => {
    render(<Survey />);
    expect(
      screen.getByText(/What’s up with work lately?/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Mocked BarChart')).toBeInTheDocument();
  });

  test('handles tab changes correctly', () => {
    render(<Survey />);
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
      screen.getByText(/Accordion: More about psychographic clusters/i)
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
