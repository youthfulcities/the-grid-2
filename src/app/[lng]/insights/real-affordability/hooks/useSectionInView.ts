// hooks/useSectionInView.ts
import { useInView } from 'react-intersection-observer';

//the sections have to be hard-coded to avoid breaking the rules of hooks. That's why this hook is scoped to the page, not resuable

export default function useSectionInView() {
  const [creatorRef, creatorInView] = useInView({ threshold: 0.3 });
  const [overviewRef, overviewInView] = useInView({ threshold: 0.3 });
  const [groceryRef, groceryInView] = useInView({ threshold: 0.3 });
  const [housingRef, housingInView] = useInView({ threshold: 0.3 });
  const [housingJourneyRef, housingJourneyInView] = useInView({
    threshold: 0.3,
  });

  return {
    creatorRef,
    overviewRef,
    groceryRef,
    housingRef,
    housingJourneyRef,
    inViewMap: {
      creatorInView,
      overviewInView,
      groceryInView,
      housingInView,
      housingJourneyInView,
    },
  };
}
