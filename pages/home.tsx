/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import {prepareSrs} from '../lib/noir';
import {PlacesListNavigationProp} from '../types/navigation';

export default function Home() {
  const navigation = useNavigation<PlacesListNavigationProp>();

  useEffect(() => {
    // Load the local SRS (if present in resources) in internal storage
    // Only for Android, will be skipped on iOS
    prepareSrs();
  }, []);

  return (
    <MainLayout>
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
