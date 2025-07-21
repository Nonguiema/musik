import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  ...props
}) => {
  const { colors } = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  
  const renderPasswordIcon = () => {
    if (!isPassword) return rightIcon;
    
    return (
      <TouchableOpacity onPress={toggleSecureEntry} style={styles.passwordIcon}>
        {secureTextEntry ? (
          <Eye size={20} color={colors.muted} />
        ) : (
          <EyeOff size={20} color={colors.muted} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 16,
              paddingRight: (rightIcon || isPassword) ? 0 : 16,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <View style={styles.rightIcon}>{renderPasswordIcon()}</View>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  leftIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rightIcon: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  passwordIcon: {
    padding: 4,
  },
  error: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
});