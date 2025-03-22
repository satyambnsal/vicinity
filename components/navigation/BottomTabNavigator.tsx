import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Platform, Image} from 'react-native';
import PlacesList from '../../pages/places-list';
import Home from '../../pages/home';
import RecentReviews from '../../pages/recent-reviews';

const Tab = createBottomTabNavigator();

const HomeIcon = ({color}: {color: string}) => (
  <Image
    source={require('../../assets/images/icons/home.png')}
    style={[styles.tabBarIcon, {tintColor: color}]}
  />
);

const PlacesIcon = ({color}: {color: string}) => (
  <Image
    source={require('../../assets/images/icons/map-pin.png')}
    style={[styles.tabBarIcon, {tintColor: color}]}
  />
);

const ReviewsIcon = ({color}: {color: string}) => (
  <Image
    source={require('../../assets/images/icons/message-square.png')}
    style={[styles.tabBarIcon, {tintColor: color}]}
  />
);

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="PlacesTab"
        component={PlacesList}
        options={{
          tabBarLabel: 'Places',
          tabBarIcon: PlacesIcon,
        }}
      />
      <Tab.Screen
        name="ReviewsTab"
        component={RecentReviews}
        options={{
          tabBarLabel: 'Reviews',
          tabBarIcon: ReviewsIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 12,
  },
  tabBarItem: {
    paddingVertical: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 0 : 5,
  },
  tabBarIcon: {
    width: 24,
    height: 24,
  },
});
