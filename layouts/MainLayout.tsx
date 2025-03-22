/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Header from '../components/navigation/Header';

export default function MainLayout({
  children,
  canGoBack = false,
  disableScroll = false,
  hideHeader = false,
  headerTitle,
  headerRightAction,
  headerRightActionIcon,
  headerRightActionLabel,
}: {
  children: React.ReactNode;
  canGoBack?: boolean;
  disableScroll?: boolean;
  hideHeader?: boolean;
  headerTitle?: string;
  headerRightAction?: () => void;
  headerRightActionIcon?: string;
  headerRightActionLabel?: string;
}): JSX.Element {
  // Determine whether to show app info/logo in header
  const showAppInfo = !headerTitle && !hideHeader;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {!hideHeader && (
        <Header
          title={headerTitle}
          showBackButton={canGoBack}
          showLogo={!headerTitle}
          rightAction={headerRightAction}
          rightActionIcon={headerRightActionIcon}
          rightActionLabel={headerRightActionLabel}
        />
      )}

      {showAppInfo && (
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>Vicinity</Text>
          <Text style={styles.appTagline}>
            Privacy-Preserving Location-Verified Reviews
          </Text>
        </View>
      )}

      {disableScroll ? (
        <View style={styles.content}>{children}</View>
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    backgroundColor: '#F8FAFC',
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
});
