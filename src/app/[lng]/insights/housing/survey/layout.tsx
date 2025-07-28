'use client';

import { HousingSurveyProvider } from '@/app/[lng]/insights/housing/survey/context/HousingSurveyContext';
import { TooltipProvider } from '@/app/context/TooltipContext';
import HousingSurvey from './page';

const Survey = () => (
  <TooltipProvider>
    <HousingSurveyProvider>
      <HousingSurvey />
    </HousingSurveyProvider>
  </TooltipProvider>
);

export default Survey;
