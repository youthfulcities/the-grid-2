import { HousingSurveyProvider } from '@/app/[lng]/insights/housing/survey/context/HousingSurveyContext';
import HousingSurvey from './page';

const Survey = () => (
  <HousingSurveyProvider>
    <HousingSurvey />
  </HousingSurveyProvider>
);

export default Survey;
