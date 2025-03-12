import { WUWWLSurveyProvider } from '@/app/[lng]/insights/survey/context/WUWWLSurveyContext';
import WUWWLSurvey from './page';

const Survey = () => (
  <WUWWLSurveyProvider>
    <WUWWLSurvey />
  </WUWWLSurveyProvider>
);

export default Survey;
