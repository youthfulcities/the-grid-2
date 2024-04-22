import { Trans } from 'react-i18next/TransWithoutContext';
import useTranslation from '../../i18n/client';

const GridInfo: React.FC<{ lng: string }> = ({ lng }) => {
  const { t } = useTranslation(lng, 'home');
  return (
    <section className='container section-padding'>
      <h2>
        <Trans
          t={t}
          i18nKey='what-is'
          components={{ span: <span className='alt-highlight' /> }}
        />
      </h2>
      <div className='inner-container'>
        <p>{t('what-is-paragraph-1')}</p>
        <p>{t('what-is-paragraph-2')}</p>
      </div>
    </section>
  );
};
export default GridInfo;
