import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
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
};

export type PlacesListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlacesList'
>;
export type PlaceDetailRouteProp = RouteProp<RootStackParamList, 'PlaceDetail'>;
export type PostReviewRouteProp = RouteProp<RootStackParamList, 'PostReview'>;
