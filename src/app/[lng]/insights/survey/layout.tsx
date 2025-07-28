import { WUWWLSurveyProvider } from '@/app/[lng]/insights/survey/context/WUWWLSurveyContext';
import { TooltipProvider } from '@/app/context/TooltipContext';
import WUWWLSurvey from './page';

const Survey = () => (
  <TooltipProvider>
    <WUWWLSurveyProvider>
      <WUWWLSurvey />
    </WUWWLSurveyProvider>
  </TooltipProvider>
);

export default Survey;
