import {createNativeStackNavigator} from '@react-navigation/native-stack';
import config from './tamagui.config';
import React from 'react';
import {TamaguiProvider} from 'tamagui';
import Home from './pages/home';
import {NavigationContainer} from '@react-navigation/native';
import PostReview from './pages/post-review';
import RecentReviews from './pages/recent-reviews';
import PlacesList from './pages/places-list';
import PlaceDetail from './pages/place-detail';
import {RootStackParamList} from './types/navigation';
import SplashScreen from './pages/splash-screen';
import BottomTabNavigator from './components/navigation/BottomTabNavigator';
import About from './pages/about';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="PostReview" component={PostReview} />
          <Stack.Screen name="RecentReviews" component={RecentReviews} />
          <Stack.Screen name="PlacesList" component={PlacesList} />
          <Stack.Screen name="PlaceDetail" component={PlaceDetail} />
          <Stack.Screen name="About" component={About} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

export default App;
