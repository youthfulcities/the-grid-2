import { Image, View } from '@aws-amplify/ui-react';

export default function Home() {
  return (
    <View
      style={{
        backgroundColor: '#550d35',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ textAlign: 'center' }}>
        <Image
          src='/assets/theme_image/THE_GRID_logo_RGB_yellow.png'
          alt='Logo'
          style={{ maxWidth: '45%' }}
        />
        <h1 style={{ color: 'white', marginTop: '0px' }}>Coming Soon</h1>
        <p style={{ color: 'white', fontSize: '15px', marginTop: '15px' }}>
          If you have any questions or want to contact us,{' '}
          <a
            href='https://www.youthfulcities.com/contact-us/#lets-talk'
            style={{ color: '#fbd166' }}
          >
            click here
          </a>
          .
        </p>
      </View>
    </View>
  );
}
