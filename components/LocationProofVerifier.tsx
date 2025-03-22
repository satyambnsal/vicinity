import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Button from './Button';
import {setupCircuit, verifyProof} from '../lib/noir';
import {formatProof} from '../lib';
import {Circuit} from '../types';
import circuit from '../circuits/vicinity/target/vicinity.json';
import {V_KEY} from '../lib/constants';

interface LocationProofVerifierProps {
  proof: string;
  placeName: string;
}

const LocationProofVerifier = ({
  proof,
  placeName,
}: LocationProofVerifierProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    error?: string;
  } | null>(null);
  const [circuitId, setCircuitId] = useState<string | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const showProofDetails = () => {
    setModalVisible(true);
    if (!circuitId) {
      setupCircuit(circuit as unknown as Circuit).then(id => setCircuitId(id));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setVerificationResult(null);
  };

  const showToastMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        100,
      );
    } else {
      Alert.alert(
        'Success',
        message,
        [{text: 'OK', onPress: () => {}, style: 'cancel'}],
        {cancelable: true},
      );
    }
  };

  const copyProofToClipboard = () => {
    Clipboard.setString(proof);
    showToastMessage('Proof copied to clipboard');
    setShowCopyToast(true);

    setTimeout(() => {
      setShowCopyToast(false);
    }, 2000);
  };

  const verifyLocationProof = async () => {
    if (!circuitId) {
      setVerificationResult({
        verified: false,
        error: 'Circuit not ready. Please try again.',
      });
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    try {
      const verified = await verifyProof(proof, V_KEY, circuitId);

      setVerificationResult({
        verified,
      });
    } catch (err: any) {
      console.error('Error verifying proof:', err);
      setVerificationResult({
        verified: false,
        error: err.message || 'An error occurred during verification',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={showProofDetails} style={styles.proofButton}>
        <Text style={styles.proofButtonText}>View Proof</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Location Verification Proof</Text>

            <View style={styles.placeInfoContainer}>
              <Text style={styles.placeNameText}>{placeName}</Text>
            </View>

            <Text style={styles.sectionTitle}>Zero-Knowledge Proof</Text>
            <ScrollView style={styles.proofScrollView}>
              <Text style={styles.proofText}>{formatProof(proof)}</Text>
            </ScrollView>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.copyButton,
                  showCopyToast && styles.copyButtonActive,
                ]}
                onPress={copyProofToClipboard}>
                <Text style={styles.copyButtonText}>
                  {showCopyToast ? 'Copied!' : 'Copy Proof'}
                </Text>
              </TouchableOpacity>

              {!verificationResult && (
                <Button
                  onPress={verifyLocationProof}
                  disabled={verifying || !circuitId}
                  style={styles.verifyButton}>
                  <Text style={styles.verifyButtonText}>
                    {verifying ? 'Verifying...' : 'Verify Proof'}
                  </Text>
                </Button>
              )}
            </View>

            {verifying && (
              <ActivityIndicator
                size="small"
                color="#3B82F6"
                style={styles.loader}
              />
            )}

            {verificationResult && (
              <View
                style={[
                  styles.resultContainer,
                  {
                    backgroundColor: verificationResult.verified
                      ? '#ECFDF5'
                      : '#FEF2F2',
                  },
                ]}>
                <Text
                  style={[
                    styles.resultText,
                    {
                      color: verificationResult.verified
                        ? '#059669'
                        : '#EF4444',
                    },
                  ]}>
                  {verificationResult.verified
                    ? '✓ Proof successfully verified!'
                    : '✗ Proof verification failed'}
                </Text>
                {verificationResult.error && (
                  <Text style={styles.errorText}>
                    {verificationResult.error}
                  </Text>
                )}
              </View>
            )}

            <Button onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  proofButton: {
    padding: 6,
  },
  proofButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  placeInfoContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  proofScrollView: {
    maxHeight: 150,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  proofText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  copyButtonActive: {
    backgroundColor: '#C7D2FE',
    borderColor: '#4F46E5',
    borderWidth: 1,
  },
  copyButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  verifyButton: {
    backgroundColor: '#3B82F6',
    maxWidth: '50%',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  loader: {
    marginVertical: 16,
  },
  resultContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#64748B',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default LocationProofVerifier;
