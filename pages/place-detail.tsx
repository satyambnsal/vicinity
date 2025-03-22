/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import {supabase} from '../lib/supabase';
import {useNavigation, useRoute} from '@react-navigation/native';
import Button from '../components/Button';
import {PlacesListNavigationProp} from '../types/navigation';
import {
  getUserLocationAndDistance,
  promptOpenSettings,
  requestLocationPermission,
} from '../lib/location-utils';

// Get screen dimensions for responsive design
const {width} = Dimensions.get('window');
const cardWidth = width - 40;

interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  image_url: string;
  created_at: string;
  place_id: string;
}

interface Review {
  id: string;
  place_id: string;
  rating: number;
  review_text: string;
  location_proof: string;
  created_at: string;
  user_id: string;
  upvotes: number;
  downvotes: number;
}

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

export default function PlaceDetail() {
  const [place, setPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const [proximityInfo, setProximityInfo] = useState<{
    isNearby: boolean;
    distanceInKm: number;
    checked: boolean;
    permissionDenied: boolean;
    errorMessage?: string;
  }>({
    isNearby: false,
    distanceInKm: 0,
    checked: false,
    permissionDenied: false,
  });

  const navigation = useNavigation<PlacesListNavigationProp>();
  const route = useRoute();
  const {place_id} = route.params as {place_id: string};

  useEffect(() => {
    fetchPlaceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place_id]);

  useEffect(() => {
    if (place && !proximityInfo.checked && !locationLoading) {
      checkUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place]);

  const checkUserLocation = async () => {
    if (!place) {
      return;
    }

    setLocationLoading(true);

    try {
      const locationResult = await getUserLocationAndDistance(
        place.latitude,
        place.longitude,
      );

      if (locationResult.status === 'success' && locationResult.distanceInfo) {
        setProximityInfo({
          isNearby: locationResult.distanceInfo.isNearby,
          distanceInKm: locationResult.distanceInfo.distanceInKm,
          checked: true,
          permissionDenied: false,
        });
      } else if (locationResult.status === 'permission_denied') {
        setProximityInfo({
          isNearby: false,
          distanceInKm: 0,
          checked: true,
          permissionDenied: true,
          errorMessage: locationResult.message,
        });
      } else {
        setProximityInfo({
          isNearby: false,
          distanceInKm: 0,
          checked: true,
          permissionDenied: false,
          errorMessage: locationResult.message,
        });
      }
    } catch (err) {
      console.error('Error checking location:', err);
      setProximityInfo({
        isNearby: false,
        distanceInKm: 0,
        checked: true,
        permissionDenied: false,
        errorMessage: 'Failed to check your location',
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchPlaceDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch place details
      const {data: placeData, error: placeError} = await supabase
        .from('places')
        .select('*')
        .eq('place_id', place_id)
        .single();

      if (placeError) throw placeError;
      if (!placeData) throw new Error('Place not found');

      setPlace(placeData);

      // Fetch reviews for this place
      const {data: reviewsData, error: reviewsError} = await supabase
        .from('reviews')
        .select('*')
        .eq('place_id', place_id)
        .order('created_at', {ascending: false});

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
    } catch (err: any) {
      console.error('Error fetching place details:', err);
      setError(`Failed to load place details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const navigateToPostReview = async () => {
    if (!place) {
      return;
    }

    if (!proximityInfo.checked) {
      checkUserLocation();
      return;
    }

    if (proximityInfo.permissionDenied) {
      promptOpenSettings();
      return;
    }

    if (!proximityInfo.isNearby) {
      Alert.alert(
        'Location Verification Failed',
        `You appear to be ${proximityInfo.distanceInKm.toFixed(
          2,
        )}km away from this location. You must be at the venue to post a verified review.`,
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
      );
    } else {
      // User is nearby, proceed with review
      navigation.navigate('PostReview', {
        place_id: place.place_id,
        placeName: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
      });
    }
  };

  const retryLocationCheck = async () => {
    const permissionResult = await requestLocationPermission();

    if (permissionResult.granted) {
      setProximityInfo(prev => ({
        ...prev,
        checked: false,
        permissionDenied: false,
      }));
      checkUserLocation();
    } else {
      // Either permission denied or location services are off
      promptOpenSettings(!permissionResult.locationServicesEnabled);
    }
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(reviewId)) {
        newExpanded.delete(reviewId);
      } else {
        newExpanded.add(reviewId);
      }
      return newExpanded;
    });
  };

  const handleVote = async (reviewId: string, isUpvote: boolean) => {
    const reviewToUpdate = reviews.find(r => r.id === reviewId);
    if (!reviewToUpdate) {
      return;
    }

    try {
      const {data, error: supabaseError} = await supabase
        .from('reviews')
        .update({
          upvotes: isUpvote
            ? reviewToUpdate.upvotes + 1
            : reviewToUpdate.upvotes,
          downvotes: !isUpvote
            ? reviewToUpdate.downvotes + 1
            : reviewToUpdate.downvotes,
        })
        .eq('id', reviewId)
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review => (review.id === reviewId ? data[0] : review)),
      );
    } catch (err: any) {
      console.error('Error updating votes:', err);
    }
  };

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{color: i <= rating ? '#FFC107' : '#E0E0E0', fontSize: 18}}>
          ★
        </Text>,
      );
    }
    return <View style={{flexDirection: 'row'}}>{stars}</View>;
  };

  if (loading) {
    return (
      <MainLayout canGoBack={true}>
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      </MainLayout>
    );
  }

  if (error || !place) {
    return (
      <MainLayout canGoBack={true}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Place not found'}</Text>
          <Button onPress={fetchPlaceDetails} style={styles.retryButton}>
            <Text style={styles.buttonText}>Retry</Text>
          </Button>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout canGoBack={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.placeHeader}>
          <Image
            source={{
              uri: `https://oqymtqolwjujkayjyxdt.supabase.co/storage/v1/object/public/places//${place_id}.jpg`,
            }}
            style={styles.placeImage}
            resizeMode="cover"
          />
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeCategory}>{place.category}</Text>
            <Text style={styles.placeAddress}>{place.address}</Text>

            {proximityInfo.checked && !proximityInfo.permissionDenied && (
              <View
                style={[
                  styles.locationStatusContainer,
                  {
                    backgroundColor: proximityInfo.isNearby
                      ? '#ECFDF5'
                      : '#FEF2F2',
                  },
                ]}>
                <Text
                  style={[
                    styles.locationStatusText,
                    {color: proximityInfo.isNearby ? '#059669' : '#EF4444'},
                  ]}>
                  {proximityInfo.isNearby
                    ? '✓ You are at this location'
                    : `You are ${proximityInfo.distanceInKm.toFixed(2)}km away`}
                </Text>
              </View>
            )}

            {proximityInfo.checked && proximityInfo.permissionDenied && (
              <View
                style={[
                  styles.locationStatusContainer,
                  {backgroundColor: '#FEF3C7'},
                ]}>
                <Text style={[styles.locationStatusText, {color: '#D97706'}]}>
                  ⚠️ {proximityInfo.errorMessage}
                </Text>
                <TouchableOpacity onPress={retryLocationCheck}>
                  <Text style={styles.retryLocationText}>Enable location</Text>
                </TouchableOpacity>
              </View>
            )}

            {locationLoading && (
              <View
                style={[
                  styles.locationStatusContainer,
                  {backgroundColor: '#F0F9FF'},
                ]}>
                <ActivityIndicator
                  size="small"
                  color="#3B82F6"
                  style={{marginRight: 8}}
                />
                <Text style={[styles.locationStatusText, {color: '#0369A1'}]}>
                  Checking your location...
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Place Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About this place</Text>
          <Text style={styles.description}>{place.description}</Text>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Reviews ({reviews.length})</Text>
            <Button
              onPress={navigateToPostReview}
              style={styles.reviewButton}
              disabled={locationLoading}>
              <Text style={styles.buttonText}>Post a Review</Text>
            </Button>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>
                No reviews yet. Be the first to review this place!
              </Text>
            </View>
          ) : (
            reviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewerId}>
                      User {review.user_id.substring(0, 10)}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {getTimeAgo(review.created_at)}
                    </Text>
                  </View>
                  {renderRating(review.rating)}
                </View>

                <Text
                  style={styles.reviewText}
                  numberOfLines={
                    expandedReviews.has(review.id) ? undefined : 3
                  }>
                  {review.review_text}
                </Text>

                {review.review_text.length > 150 && (
                  <TouchableOpacity
                    onPress={() => toggleExpandReview(review.id)}>
                    <Text style={styles.readMoreText}>
                      {expandedReviews.has(review.id)
                        ? 'Show less'
                        : 'Read more'}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.proofContainer}>
                  <View style={styles.proofBadge}>
                    <Text style={styles.proofText}>Location Verified</Text>
                  </View>
                </View>

                <View style={styles.reviewFooter}>
                  <View style={styles.votesContainer}>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(review.id, true)}>
                      <Text style={styles.voteIcon}>👍</Text>
                      <Text style={styles.voteCount}>{review.upvotes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(review.id, false)}>
                      <Text style={styles.voteIcon}>👎</Text>
                      <Text style={styles.voteCount}>{review.downvotes}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 30,
  },
  placeHeader: {
    marginBottom: 20,
  },
  placeImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  placeInfo: {
    padding: 15,
  },
  placeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  placeCategory: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 8,
  },
  placeAddress: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
  },
  locationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  locationStatusText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  retryLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  descriptionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 10,
    marginBottom: 5,
  },
  reviewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#10B981',
    maxWidth: '50%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  noReviewsContainer: {
    padding: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noReviewsText: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    width: cardWidth,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#64748B',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 12,
  },
  readMoreText: {
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 12,
  },
  proofContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  proofBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  proofText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  voteIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  voteCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
});
