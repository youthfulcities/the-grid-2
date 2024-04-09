import { Flex, View } from '@aws-amplify/ui-react';

const HomeHeader = () => (
    <View as='section' className='home-header'>
        <Flex as='div' direction='column' className='container'>
            <h1 className='header-text'>
                Democratizing Youth <span className='highlight'>Data</span>
            </h1>
            <h3 className='header-subtext'>
                An open data portal powered by{' '}
                <a href='https://youthfulcities.com/'>Youthful Cities</a>
            </h3>
            <View as='div' className='relative-container' shrink={3}>
                <img
                    className='clip hero-img'
                    src='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                    alt='New York City at sunset'
                />
                <img
                    className='hero-logo'
                    src='/assets/theme_image/THE_GRID_logo_RGB_yellow.png'
                    alt='THE GRID logo'
                />
            </View>
        </Flex>
    </View>
);
export default HomeHeader
