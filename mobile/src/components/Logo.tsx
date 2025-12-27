import React from 'react';
import { Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle | ImageStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 120,
  style,
  resizeMode = 'contain',
}) => {
  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={[styles.logo, { width, height }, style]}
      resizeMode={resizeMode}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});

export default Logo;
