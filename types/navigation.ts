import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  Home: undefined;
  PlacesList: undefined;
  PlaceDetail: {place_id: string};
  PostReview: {
    place_id: string;
    placeName: string;
    latitude: number;
    longitude: number;
  };
  RecentReviews: undefined;
  ProductProof: undefined;
  PedersenProof: undefined;
  Secp256r1Proof: undefined;
  SupabaseTest: undefined;
  About: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  PlacesTab: undefined;
  ReviewsTab: undefined;
};

export type HomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type PlacesListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlacesList'
>;

export type PlaceDetailRouteProp = RouteProp<RootStackParamList, 'PlaceDetail'>;
export type PostReviewRouteProp = RouteProp<RootStackParamList, 'PostReview'>;

export type TabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
