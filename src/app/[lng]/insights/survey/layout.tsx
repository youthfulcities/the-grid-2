import { WUWWLSurveyProvider } from '@/app/context/WUWWLSurveyContext';
import WUWWLSurvey from './page';

const Survey = () => (
  <WUWWLSurveyProvider>
    <WUWWLSurvey />
  </WUWWLSurveyProvider>
);

export default Survey;
