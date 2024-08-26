'use client';

import { Flex, Heading, Text, View } from '@aws-amplify/ui-react';
import { useParams } from 'next/navigation';
import { Trans } from 'react-i18next/TransWithoutContext';
import Container from '../../components/Background';
import useTranslation from '../../i18n/client';

const About = () => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, 'about');

  return (
    <Container>
      <Flex className='container section-padding'>
        <Flex direction='column'>
          <Heading marginBottom='medium' level={1}>
            <Trans
              t={t}
              i18nKey='h1'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <img
              className='clip'
              width='100%'
              src='/assets/theme_image/team-photo.jpg'
              alt={t('team_alt')}
            />
          </View>
          <Heading marginTop='xxl' level={2}>
            <Trans
              t={t}
              i18nKey='title'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <Trans t={t} i18nKey='about' components={{ p: <Text /> }} />
          </View>
          <Heading level={2} className='padding'>
            <Trans
              t={t}
              i18nKey='story_title'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <Trans t={t} i18nKey='story_content' components={{ p: <Text /> }} />
          </View>
          <Heading level={2} className='padding'>
            <Trans
              t={t}
              i18nKey='values_title'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <Trans
              t={t}
              i18nKey='values_content'
              components={{
                p: <Text />,
                a: <a href='https://www.youthfulcities.com/about-us/' />,
              }}
            />
            <Flex
              direction='column'
              gap='1rem'
              className='cards-container'
              alignItems='stretch'
            >
              <View>
                <img
                  width='100%'
                  src='/assets/theme_image/values3.png'
                  alt={t('connected')}
                />
                <Heading level={4} className='card-text'>
                  {t('connected')}
                </Heading>
                <Text className='card-small-text'>
                  {t('connected_content')}
                </Text>
              </View>
              <View>
                <img
                  width='100%'
                  src='/assets/theme_image/values4.png'
                  alt={t('open')}
                />
                <Heading level={4} className='card-text'>
                  {t('open')}
                </Heading>
                <Text className='card-small-text'>
                  <Trans
                    t={t}
                    i18nKey='open_content'
                    components={{
                      a: (
                        <a href='https://opendatacommons.org/licenses/odbl/1-0/' />
                      ),
                    }}
                  />
                </Text>
              </View>
              <View>
                <img
                  width='100%'
                  src='/assets/theme_image/values2.png'
                  alt={t('dynamic')}
                />
                <Heading level={4} className='card-text'>
                  {t('dynamic')}
                </Heading>
                <Text className='card-small-text'>{t('dynamic_content')}</Text>
              </View>
              <View>
                <img
                  width='100%'
                  src='/assets/theme_image/values7.png'
                  alt={t('playful')}
                />
                <Heading level={4} className='card-text'>
                  {t('playful')}
                </Heading>
                <Text className='card-small-text'>{t('playful_content')}</Text>
              </View>
              <View>
                <img
                  width='100%'
                  src='/assets/theme_image/values5.png'
                  alt={t('curious')}
                />
                <Heading level={4} className='card-text'>
                  {t('curious')}
                </Heading>
                <Text className='card-small-text'>{t('curious_content')}</Text>
              </View>
              <View>
                <img
                  width='100%'
                  src='/assets/theme_image/values6.png'
                  alt={t('inventive')}
                />
                <Heading level={4} className='card-text'>
                  {t('inventive')}
                </Heading>
                <Text className='card-small-text'>
                  {t('inventive_content')}
                </Text>
              </View>
            </Flex>
          </View>
          <Heading level={2} className='padding'>
            <Trans
              t={t}
              i18nKey='acknowledgement_title'
              components={{ span: <span className='highlight' /> }}
            />
          </Heading>
          <View className='inner-container'>
            <Trans
              t={t}
              i18nKey='acknowledgement_content'
              components={{ p: <Text /> }}
            />
          </View>
          {/* <View className='padding'>
            <Heading level={2}>Partners & Funding</Heading>
            <Flex
              direction='row'
              wrap='wrap'
              gap='xxl'
              justifyContent='space-around'
              alignItems='center'
            >
              <img
                width='300px'
                src='/assets/theme_image/tig.avif'
                alt='Taking It Global logo'
              />
              <img
                width='300px'
                src='/assets/theme_image/CCYP.png'
                alt='Canadian Council for Youth Prosperity logo'
              />
              <img
                width='300px'
                src='/assets/theme_image/tamarack.png'
                alt='Tamarack Institute logo'
              />
              <img
                width='300px'
                src='/assets/theme_image/sfu.png'
                alt='Simon Fraser University logo'
              />
              <img
                width='300px'
                src='/assets/theme_image/gov.png'
                alt='Government of Canada logo'
              />
              <img
                width='300px'
                src='/assets/theme_image/RBC_FL.png'
                alt='RBC Future Launch logo'
              />
            </Flex>
          </View> */}
        </Flex>
      </Flex>
    </Container>
  );
};

export default About;
