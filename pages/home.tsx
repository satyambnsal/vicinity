/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import {prepareSrs} from '../lib/noir';
import {PlacesListNavigationProp} from '../types/navigation';
import * as AppAttest from 'react-native-ios-appattest';
import {Buffer} from 'react-native-buffer';
// import {encode} from 'cbor2';
import DeviceInfo from 'react-native-device-info';

export default function Home() {
  const navigation = useNavigation<PlacesListNavigationProp>();
  const [attestSupported, setAttestSupported] = useState<boolean>(false);

  useEffect(() => {
    // Load the local SRS (if present in resources) in internal storage
    // Only for Android, will be skipped on iOS
    DeviceInfo.getDeviceToken().then(deviceToken => {
      // iOS: "a2Jqsd0kanz..."
      console.log('Device token', deviceToken);
    });
    AppAttest.attestationSupported().then(async supported => {
      console.log('Supported', supported);
      setAttestSupported(supported);
      if (supported) {
        const newKeyId = await AppAttest.generateKeys();
        const challengeHashBase64 = Buffer.from('abc123').toString('base64');
        try {
          const attestationBase64 = await AppAttest.attestKeys(
            newKeyId,
            challengeHashBase64,
          );
          console.log('Attestation created', attestationBase64);
        } catch (error) {
          console.log('attest key error', error);
        }
      }
    });
    prepareSrs();
  }, []);

  return (
    <MainLayout>
      {/* <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          marginBottom: 20,
          textAlign: 'center',
          color: '#6B7280',
        }}>
        Hello, Expo: {encode('Hello, Expo').toString()}
      </Text> */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          marginBottom: 20,
          textAlign: 'center',
          color: '#6B7280',
        }}>
        {attestSupported ? 'Attest support' : 'attest not suo=pport'}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          marginBottom: 20,
          textAlign: 'center',
          color: '#6B7280',
        }}>
        Vicinity is a privacy focused review platform that enables users to
        anonymously share experiences at real-world locations while
        cryptographically proving they were actually there.
      </Text>
      <View
        style={{
          gap: 20,
        }}>
        <Button
          onPress={() => {
            navigation.navigate('PlacesList');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            Explore Famous Places
          </Text>
        </Button>

        <Button
          onPress={() => {
            navigation.navigate('RecentReviews');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            View Recent Reviews
          </Text>
        </Button>

        <Button
          onPress={() => {
            navigation.navigate('ProductProof');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            Proof of product
          </Text>
        </Button>
        <Button
          onPress={() => {
            navigation.navigate('PedersenProof');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            Proof of Pedersen Hash
          </Text>
        </Button>
        <Button
          onPress={() => {
            navigation.navigate('Secp256r1Proof');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            Proof of secp256r1
          </Text>
        </Button>
        <Button
          onPress={() => {
            navigation.navigate('SupabaseTest');
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
            }}>
            Test Supabase Connection
          </Text>
        </Button>
      </View>
    </MainLayout>
  );
}
