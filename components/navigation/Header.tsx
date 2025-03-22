import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  rightAction?: () => void;
  rightActionIcon?: string;
  rightActionLabel?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showLogo = true,
  rightAction,
  rightActionIcon,
  rightActionLabel,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/icons/arrow-left.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        {showLogo && (
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightContainer}>
        {rightAction && (
          <TouchableOpacity style={styles.rightButton} onPress={rightAction}>
            {rightActionIcon && (
              <Image
                source={{uri: rightActionIcon}}
                style={styles.rightIcon}
                resizeMode="contain"
              />
            )}
            {rightActionLabel && (
              <Text style={styles.rightActionText}>{rightActionLabel}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  rightActionText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Header;
