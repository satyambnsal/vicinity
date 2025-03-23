/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import MainLayout from '../layouts/MainLayout';
// import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import {PlacesListNavigationProp} from '../types/navigation';
import * as AppAttest from 'react-native-ios-appattest';
import {Buffer} from 'react-native-buffer';
import DeviceInfo from 'react-native-device-info';

export default function Home() {
  const navigation = useNavigation<PlacesListNavigationProp>();
  const [attestSupported, setAttestSupported] = useState<boolean>(false);

  useEffect(() => {
    // Check device capabilities
    DeviceInfo.getDeviceToken().then(deviceToken => {});
    AppAttest.attestationSupported().then(async supported => {
      setAttestSupported(supported);
      if (supported) {
        try {
          const newKeyId = await AppAttest.generateKeys();
          const challengeHashBase64 = Buffer.from('abc123').toString('base64');
          const attestationBase64 = await AppAttest.attestKeys(
            newKeyId,
            challengeHashBase64,
          );
        } catch (error) {
          console.log('attest key error', error);
        }
      }
    });
  }, []);

  return (
    <MainLayout hideHeader>
      <View style={styles.heroSection}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Vicinity</Text>
        <Text style={styles.subtitle}>
          Privacy-Preserving Location-Verified Reviews
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Vicinity enables you to anonymously share experiences at real-world
          locations while cryptographically proving you were actually there,
          protecting your privacy while ensuring authentic reviews.
        </Text>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        <View style={styles.featuredCards}>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('PlacesList')}>
            <Image
              source={require('../assets/images/icons/map-pin.png')}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Explore Places</Text>
            <Text style={styles.cardDescription}>
              Discover venues and see location-verified reviews
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('RecentReviews')}>
            <Image
              source={require('../assets/images/icons/message-square.png')}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Recent Reviews</Text>
            <Text style={styles.cardDescription}>
              See the latest verified reviews from users
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.advancedSection}>
        <Text style={styles.sectionTitle}>Advanced Features</Text>
        <View style={styles.advancedButtons}>
          <Button
            onPress={() => navigation.navigate('ProductProof')}
            style={styles.advancedButton}>
            <Text style={styles.buttonText}>Proof of Product</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate('PedersenProof')}
            style={styles.advancedButton}>
            <Text style={styles.buttonText}>Pedersen Hash Proof</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate('Secp256r1Proof')}
            style={styles.advancedButton}>
            <Text style={styles.buttonText}>Secp256r1 Proof</Text>
          </Button>

          <Button
            onPress={() => navigation.navigate('SupabaseTest')}
            style={styles.advancedButton}>
            <Text style={styles.buttonText}>Test Supabase</Text>
          </Button>
        </View>
      </View> */}

      {attestSupported && (
        <View style={styles.statusSection}>
          <Text style={styles.statusText}>✓ Device attestation supported</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate('About')}>
        <Text style={styles.aboutButtonText}>About Vicinity</Text>
      </TouchableOpacity>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  featuredCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  featuredCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 12,
    tintColor: '#3B82F6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  advancedSection: {
    marginBottom: 24,
  },
  advancedButtons: {
    gap: 12,
  },
  advancedButton: {
    backgroundColor: '#334155',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  statusSection: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },
  statusText: {
    color: '#059669',
    fontWeight: '600',
  },
  aboutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  aboutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 8,
  },
});
