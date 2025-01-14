import { HousingSurveyProvider } from '@/app/context/HousingSurveyContext';
import HousingSurvey from './page';

const Survey = () => (
  <HousingSurveyProvider>
    <HousingSurvey />
  </HousingSurveyProvider>
);

export default Survey;
