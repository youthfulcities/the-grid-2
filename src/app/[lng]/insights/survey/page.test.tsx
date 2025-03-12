import { WUWWLSurveyProvider } from '@/app/[lng]/insights/survey/context/WUWWLSurveyContext';
import fetchData from '@/lib/fetchData';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Survey from './page';

//this mock doesn't work in the __mocks__ folder or setupTests and has to be in the individual test files
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

jest.mock('@/lib/fetchData', () => jest.fn());

const rawData =
  'option_en,question_ID,question_en,count_Total,percentage_Total\nOption 1,1,Question 1,100,50%\nOption 2,2,Question 2,200,75%';

describe('Survey Component', () => {
  beforeEach(() => {
    (fetchData as jest.Mock).mockResolvedValue(rawData);
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('loads data on mount', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    expect(fetchData).toHaveBeenCalledWith(
      'internal/DEV/survey',
      'WUWWL_Full_National_ONLY - Questions.csv'
    );
  });

  it('displays loading state initially', () => {
    render(
      <WUWWLSurveyProvider>
        <Survey />
      </WUWWLSurveyProvider>
    );
    expect(screen.getByTestId('survey-page-placeholder')).toBeInTheDocument();
  });

  it('displays select after loading', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });

    expect(await screen.findByText('select_title')).toBeInTheDocument();
  });

  it('displays chart after loading', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    const svgElement = screen.findByTestId('bar-chart-general');
    expect(await svgElement).toBeInTheDocument();
    expect(await screen.findByText('Percent')).toBeInTheDocument();
  });

  it('displays cluster chart after loading', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    const svgElement = screen.findByTestId('cluster-chart');
    expect(await svgElement).toBeInTheDocument();
    // TODO: Provide sample data to fully test this visualization
  });

  it('displays heatmaps after loading', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    const heatmaps = await screen.findAllByTestId('heatmap');
    expect(heatmaps.length).toBeGreaterThan(0);
    // TODO: Provide sample data to fully test this visualization
  });

  it('filters questions by topic', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    const button = screen.getByRole('button', { name: 'select_other' });
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(await screen.findByText('Option 1')).toBeInTheDocument();
  });

  it('filters data by selected question', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    const button = screen.getByRole('button', { name: 'select_other' });
    await userEvent.click(button);
    fireEvent.change(screen.getByLabelText('select_question'), {
      target: { value: 'Question 2' },
    });
    expect(await screen.findByText('Option 2')).toBeInTheDocument();
  });

  it('handles drawer open and close', async () => {
    await act(async () => {
      render(
        <WUWWLSurveyProvider>
          <Survey />
        </WUWWLSurveyProvider>
      );
    });
    const overlay = screen.getByTestId('drawer-overlay');
    await userEvent.click(overlay);
    await waitFor(() => {
      expect(screen.queryByTestId('drawer-overlay')).not.toBeVisible();
    });
  });
});
