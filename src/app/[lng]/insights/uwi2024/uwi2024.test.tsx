import useTranslation from '@/app/i18n/client';
import { useDimensions } from '@/hooks/useDimensions';
import { fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';
import Index from './page';

interface IndexHeatmapProps {
  setTooltipState: (state: {
    position: { x: number; y: number };
    content: string;
  }) => void;
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

// Mock the useTranslation hook
jest.mock('@/app/i18n/client', () => ({
  useTranslation: jest.fn(),
}));

// Mock hooks and components
jest.mock('@/hooks/useDimensions', () => ({
  useDimensions: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/app/i18n/client', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/components/dataviz/Map', () => () => (
  <div>Mocked CustomMap</div>
));

jest.mock('@/app/components/dataviz/IndexHeatmap', () => {
  return ({ setTooltipState }: IndexHeatmapProps) => (
    <div
      onMouseEnter={() =>
        setTooltipState({
          position: { x: 10, y: 20 },
          content: 'Mocked Tooltip',
        })
      }
    >
      Mocked IndexHeatmap
    </div>
  );
});

jest.mock('@/app/components/dataviz/TooltipChart', () => () => (
  <div>Mocked Tooltip</div>
));

describe('Index Component', () => {
  beforeEach(() => {
    (useDimensions as jest.Mock).mockReturnValue({ width: 1000 });
    (useParams as jest.Mock).mockReturnValue({ lng: 'en' });
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key, // Mock translation function
    });
    jest.clearAllMocks();
  });

  test('renders Index component with headings and map', () => {
    render(<Index />);

    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/map_heading/i)).toBeInTheDocument();
    expect(screen.getByText('Mocked CustomMap')).toBeInTheDocument();
  });

  test('renders IndexHeatmap and Tooltip components', () => {
    render(<Index />);

    expect(screen.getByText('Mocked IndexHeatmap')).toBeInTheDocument();
    expect(screen.queryByText('Mocked Tooltip')).toBeNull();
  });

  test('displays Tooltip when tooltipState.position is set', () => {
    render(<Index />);

    // Tooltip should not be visible initially
    expect(screen.queryByText('Mocked Tooltip')).toBeNull();

    // Simulate setting the tooltipState
    fireEvent.mouseEnter(screen.getByText('Mocked IndexHeatmap'));

    // Since Tooltip is conditionally rendered, verify it becomes visible
    expect(screen.getByText('Mocked Tooltip')).toBeInTheDocument();
  });

  test('renders buttons with correct text', () => {
    render(<Index />);

    expect(screen.getByText(/chatbot_button/i)).toBeInTheDocument();
    expect(screen.getByText(/stories_button/i)).toBeInTheDocument();
  });

  test('renders Accordions and content correctly', () => {
    render(<Index />);

    expect(screen.getByText(/scoring_heading/i)).toBeInTheDocument();
    expect(screen.getByText(/scoring_blurb/i)).toBeInTheDocument();
  });
});
