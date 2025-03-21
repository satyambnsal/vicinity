/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

export default function MainLayout({
  children,
  canGoBack = false,
}: {
  children: React.ReactNode;
  canGoBack?: boolean;
}): JSX.Element {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#F5F7FA',
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          backgroundColor: '#F5F7FA',
          height: '100%',
        }}>
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}>
          {canGoBack && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 30,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', gap: 9}}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image
                  source={require('../assets/images/icons/arrow-left.png')}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                <Text
                  style={{color: '#3B82F6', fontSize: 14, fontWeight: '700'}}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Image
            source={require('../assets/images/logo.png')}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 20,
              marginBottom: 15,
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1E293B',
              marginBottom: 8,
            }}>
            Vicinity
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: '#64748B',
              marginBottom: 30,
            }}>
            Privacy-Preserving Location-Verified Reviews
          </Text>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
