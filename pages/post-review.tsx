/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Text,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import {supabase} from '../lib/supabase';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  clearCircuit,
  extractProof,
  generateProof,
  setupCircuit,
} from '../lib/noir';
import circuit from '../circuits/vicinity/target/vicinity.json';
import {formatProof} from '../lib';
import {Circuit} from '../types';
import {PlacesListNavigationProp} from '../types/navigation';
import {getUserLocationAndDistance} from '../lib/location-utils';

export default function PostReview() {
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [userId, setUserId] = useState(
    'anonymous-' + Math.random().toString(36).substring(2, 9),
  );

  const [locationProof, setLocationProof] = useState('');
  const [generatingProof, setGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [circuitId, setCircuitId] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<PlacesListNavigationProp>();
  const route = useRoute();
  const {place_id, placeName, latitude, longitude} = route.params as {
    place_id: string;
    placeName: string;
    latitude: number;
    longitude: number;
  };
  const [currentUserLatitude, setCurrentUserLatitude] = useState<
    Number | undefined
  >(undefined);
  const [currentUserLongitude, setCurrentUserLongitude] = useState<
    Number | undefined
  >(undefined);

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

  useEffect(() => {
    setupCircuit(circuit as unknown as Circuit).then(id => setCircuitId(id));
    return () => {
      if (circuitId) {
        clearCircuit(circuitId);
      }
    };
  }, []);

  useEffect(() => {
    if (place_id && !proximityInfo.checked && !locationLoading) {
      checkUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place_id]);

  const checkUserLocation = async () => {
    if (!place_id) {
      return;
    }

    setLocationLoading(true);

    try {
      const locationResult = await getUserLocationAndDistance(
        latitude,
        longitude,
      );

      if (locationResult.status === 'success' && locationResult.distanceInfo) {
        setProximityInfo({
          isNearby: locationResult.distanceInfo.isNearby,
          distanceInKm: locationResult.distanceInfo.distanceInKm,
          checked: true,
          permissionDenied: false,
        });
        setCurrentUserLongitude(locationResult.coordinates?.longitude);
        setCurrentUserLatitude(locationResult.coordinates?.latitude);
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

  const generateLocationProof = async () => {
    setGeneratingProof(true);
    setError(null);

    try {
      // In a real app, we would use actual location data and a ZK circuit for location verification
      // For now, we'll simulate this with the product circuit

      console.log('GENERATING PROOF');
      // const {proofWithPublicInputs} = await generateProof(
      //   {
      //     user_lat: Math.round((40714491 + 90) * 1e6),
      //     user_lon: Math.round((-74001337 + 90) * 1e6),
      //     landmark_lat: Math.round((40714403 + 90) * 1e6),
      //     landmark_lon: Math.round((-74001508 + 90) * 1e6),
      //   },
      //   circuitId!,
      // );

      if (!currentUserLatitude || !currentUserLongitude) {
        console.log('current user location is not defined');
        return;
      }

      const user_lat = Math.round((Number(currentUserLatitude) + 90) * 1e6);
      const user_lon = Math.round((Number(currentUserLongitude) + 90) * 1e6);
      const landmark_lat = Math.round((latitude + 90) * 1e6);
      const landmark_lon = Math.round((longitude + 90) * 1e6);
      console.log('locations', {
        user_lat,
        user_lon,
        landmark_lat,
        landmark_lon,
      });

      const {proofWithPublicInputs} = await generateProof(
        {
          user_lat,
          user_lon,
          landmark_lat,
          landmark_lon,
          max_distance: 80874049,
        },
        circuitId!,
      );

      // const {proofWithPublicInputs} = await generateProof(
      //   {
      //     landmark_lat: Number(40714491),
      //     landmark_lon: Number(-74001337),
      //     user_lat: Number(40714403),
      //     user_lon: Number(-74001508),
      //   },
      //   circuitId!,
      // );

      console.log('EXTRACTING PROOF');

      const proof = extractProof(
        circuit as unknown as Circuit,
        proofWithPublicInputs,
      );
      setLocationProof(proof);
      setProofGenerated(true);
      Alert.alert(
        'Success',
        'Location verified! You can now submit your review.',
      );
    } catch (err: any) {
      console.error('Error generating proof:', err);
      setError(`Failed to verify location: ${err.message}`);
      Alert.alert('Error', `Failed to verify location: ${err.message}`);
    } finally {
      setGeneratingProof(false);
    }
  };

  const submitReview = async () => {
    if (!rating || !reviewText || !locationProof) {
      Alert.alert(
        'Missing information',
        'Please fill in all fields and verify your location before submitting',
      );
      return;
    }

    if (
      isNaN(parseInt(rating)) ||
      parseInt(rating) < 1 ||
      parseInt(rating) > 5
    ) {
      Alert.alert('Invalid rating', 'Rating must be between 1 and 5');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const {data, error: supabaseError} = await supabase
        .from('reviews')
        .insert([
          {
            place_id: place_id,
            rating: parseInt(rating),
            review_text: reviewText,
            location_proof: locationProof,
            user_id: userId,
            upvotes: 0,
            downvotes: 0,
          },
        ])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      Alert.alert(
        'Review posted!',
        'Your review has been posted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('RecentReviews');
            },
          },
        ],
      );
    } catch (err: any) {
      console.error('Error posting review:', err);
      setError(`Failed to post review: ${err.message}`);
      Alert.alert('Error', `Failed to post review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout canGoBack={true}>
      <ScrollView>
        <Text style={styles.title}>Post a Review 1</Text>

        <View style={styles.placeInfoContainer}>
          <Text style={styles.placeName}>{placeName}</Text>
          <Text style={styles.placeCoordinates}>
            Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>

        <Text style={styles.label}>Rating (1-5)</Text>
        <Input
          value={rating}
          placeholder="Rate from 1-5"
          keyboardType="numeric"
          onChangeText={setRating}
          maxLength={1}
          style={styles.input}
        />

        <Text style={styles.label}>Your Review</Text>
        <TextInput
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Share your experience..."
          multiline
          numberOfLines={5}
          style={styles.textArea}
        />

        {!proofGenerated ? (
          <Button
            disabled={generatingProof || !circuitId}
            onPress={generateLocationProof}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {generatingProof
                ? 'Verifying Location...'
                : 'Verify Your Location'}
            </Text>
          </Button>
        ) : (
          <>
            <Text style={styles.verifiedText}>✓ Location Verified!</Text>
            {locationProof && (
              <Text style={styles.proofText}>{formatProof(locationProof)}</Text>
            )}

            <Button
              disabled={submitting}
              onPress={submitReview}
              style={styles.submitButton}>
              <Text style={styles.buttonText}>
                {submitting ? 'Posting Review...' : 'Post Review'}
              </Text>
            </Button>
          </>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#151628',
    textAlign: 'center',
    marginBottom: 20,
  },
  placeInfoContainer: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 5,
  },
  placeCoordinates: {
    fontSize: 14,
    color: '#64748B',
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 10,
  },
  proofText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 10,
    textAlign: 'center',
  },
});

function adjustCoordinates(lat: number, lon: number) {
  return {
    latAdj: Math.round((lat + 90) * 1e6),
    lonAdj: Math.round((lon + 180) * 1e6),
  };
}
