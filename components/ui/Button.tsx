import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return colors.error;
      default:
        return colors.primary;
    }
  };
  
  const getBorderColor = () => {
    switch (variant) {
      case 'outline':
        return colors.border;
      default:
        return 'transparent';
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };
  
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };
  
  const buttonStyles = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    ...getPadding(),
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles, style]}
      disabled={loading || props.disabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {leftIcon && <Text style={styles.iconContainer}>{leftIcon}</Text>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontFamily: 'Inter-Medium' },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <Text style={styles.iconContainer}>{rightIcon}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  iconContainer: {
    marginHorizontal: 8,
  },
});