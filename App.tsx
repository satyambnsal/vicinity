import {createNativeStackNavigator} from '@react-navigation/native-stack';
import config from './tamagui.config';
import React from 'react';
import {TamaguiProvider} from 'tamagui';
import Home from './pages/home';
import {NavigationContainer} from '@react-navigation/native';
import ProductProof from './pages/product-proof';
import PedersenProof from './pages/pedersen-proof';
import Secp256r1Proof from './pages/secp256r1-proof';
import SupabaseTest from './pages/supabase-test';
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
          <Stack.Screen name="ProductProof" component={ProductProof} />
          <Stack.Screen name="PedersenProof" component={PedersenProof} />
          <Stack.Screen name="Secp256r1Proof" component={Secp256r1Proof} />
          <Stack.Screen
            name="SupabaseTest"
            component={SupabaseTest}
            options={{headerShown: false}}
          />
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
