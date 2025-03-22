/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Text,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  ActivityIndicator,
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
  verifyProof,
} from '../lib/noir';
import circuit from '../circuits/vicinity/target/vicinity.json';
import {formatProof} from '../lib';
import {Circuit} from '../types';
import {PlacesListNavigationProp} from '../types/navigation';
import {getUserLocationAndDistance} from '../lib/location-utils';

const maxDistance = 80874049; // ~1km in scaled coordinates
const userId = 'anonymous-' + Math.random().toString(36).substring(2, 9);

export default function PostReview() {
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');

  const [locationProof, setLocationProof] = useState('');
  const [vkey, setVkey] = useState('');
  const [proofWithPublicInputs, setProofWithPublicInputs] = useState('');
  const [generatingProof, setGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [circuitId, setCircuitId] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provingTime, setProvingTime] = useState(0);

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
      console.error('Error checking location data:', err);
      setProximityInfo({
        isNearby: false,
        distanceInKm: 0,
        checked: true,
        permissionDenied: false,
        errorMessage: 'Failed to obtain geolocation coordinates',
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const generateZKLocationProof = async () => {
    setGeneratingProof(true);
    setError(null);

    try {
      if (!currentUserLatitude || !currentUserLongitude) {
        throw new Error(
          'Client coordinates not available for ZK circuit input',
        );
      }

      console.log('Preparing circuit inputs for ZK proof generation');
      // Scale and offset coordinates to work with Noir's integer constraints
      const user_lat = Math.round((Number(currentUserLatitude) + 90) * 1e6);
      const user_lon = Math.round((Number(currentUserLongitude) + 90) * 1e6);
      const landmark_lat = Math.round((latitude + 90) * 1e6);
      const landmark_lon = Math.round((longitude + 90) * 1e6);

      console.log('ZK Circuit Inputs:', {
        user_lat,
        user_lon,
        landmark_lat,
        landmark_lon,
        max_distance: maxDistance,
      });

      const start = Date.now();
      const proofResult = await generateProof(
        {
          user_lat,
          user_lon,
          landmark_lat,
          landmark_lon,
          max_distance: maxDistance,
        },
        circuitId!,
      );
      const end = Date.now();
      setProvingTime(end - start);

      const {proofWithPublicInputs: proofData, vkey: verificationKey} =
        proofResult;
      setProofWithPublicInputs(proofData);
      setVkey(verificationKey);

      console.log('Extracting ZK proof from circuit output');
      const proof = extractProof(circuit as unknown as Circuit, proofData);
      setLocationProof(proof);
      setProofGenerated(true);

      Alert.alert(
        'ZK Proof Generated',
        'Your zero-knowledge proximity proof has been successfully generated. You can now submit your review with cryptographic location verification.',
      );
    } catch (err: any) {
      console.error('Error in ZK proof generation:', err);
      setError(`ZK proof generation failed: ${err.message}`);
      Alert.alert(
        'Proof Generation Error',
        `Failed to generate ZK proximity proof: ${err.message}`,
      );
    } finally {
      setGeneratingProof(false);
    }
  };

  const verifyZKLocationProof = async () => {
    if (!proofWithPublicInputs || !vkey || !circuitId) {
      Alert.alert('Verification Error', 'No proof available to verify');
      return;
    }

    try {
      const verified = await verifyProof(
        proofWithPublicInputs,
        vkey,
        circuitId,
      );

      if (verified) {
        Alert.alert('Proof Verification', 'The ZK proximity proof is valid!');
      } else {
        Alert.alert('Proof Verification', 'The ZK proximity proof is invalid!');
      }
    } catch (err: any) {
      console.error('Error verifying proof:', err);
      Alert.alert(
        'Verification Error',
        `Failed to verify proof: ${err.message}`,
      );
    }
  };

  const submitReview = async () => {
    if (!rating || !reviewText || !locationProof) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields and generate a ZK location proof before submitting',
      );
      return;
    }

    if (
      isNaN(parseInt(rating)) ||
      parseInt(rating) < 1 ||
      parseInt(rating) > 5
    ) {
      Alert.alert('Invalid Rating', 'Rating must be between 1 and 5');
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
        'Review Published',
        'Your cryptographically verified review has been posted successfully.',
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
      Alert.alert('Submission Error', `Failed to post review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout canGoBack={true}>
      <ScrollView>
        <Text style={styles.title}>Post a Review</Text>

        <View style={styles.placeInfoContainer}>
          <Text style={styles.placeName}>{placeName}</Text>
          <Text style={styles.placeCoordinates}>
            Venue Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>

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
                  ? `Within proximity threshold (${proximityInfo.distanceInKm.toFixed(
                      2,
                    )}km)`
                  : `Outside proximity threshold (${proximityInfo.distanceInKm.toFixed(
                      2,
                    )}km)`}
              </Text>
            </View>
          )}
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
            onPress={generateZKLocationProof}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {generatingProof
                ? 'Generating ZK Proof...'
                : 'Generate ZK Proximity Proof'}
            </Text>
          </Button>
        ) : (
          <>
            <View style={styles.proofContainer}>
              <Text style={styles.proofHeader}>
                Zero-Knowledge Proximity Proof
              </Text>
              <Text style={styles.proofGeneratedText}>
                ✓ Cryptographically Verified Location
              </Text>

              {provingTime > 0 && (
                <Text style={styles.proofMetadata}>
                  Proving Time: {provingTime}ms
                </Text>
              )}

              <Text style={styles.proofLabel}>Proof Digest (Truncated):</Text>
              <Text style={styles.proofText}>{formatProof(locationProof)}</Text>

              <Button
                onPress={verifyZKLocationProof}
                style={styles.verifyButton}>
                <Text style={styles.buttonText}>Verify ZK Proof</Text>
              </Button>
            </View>

            <Button
              disabled={submitting}
              onPress={submitReview}
              style={styles.submitButton}>
              <Text style={styles.buttonText}>
                {submitting
                  ? 'Publishing Review...'
                  : 'Publish Verified Review'}
              </Text>
            </Button>
          </>
        )}

        {locationLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.loadingText}>
              Fetching geolocation coordinates...
            </Text>
          </View>
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
    fontFamily: 'monospace',
  },
  locationStatusContainer: {
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
  },
  locationStatusText: {
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: '#3B82F6',
  },
  verifyButton: {
    marginTop: 10,
    backgroundColor: '#8B5CF6',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  proofContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  proofHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  proofGeneratedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 12,
  },
  proofMetadata: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  proofLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  proofText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    fontFamily: 'monospace',
    letterSpacing: -0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 10,
    textAlign: 'center',
  },
});
