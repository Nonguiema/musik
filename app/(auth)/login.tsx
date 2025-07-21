import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Music4 } from 'lucide-react-native';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.logoContainer}>
          <Music4 size={60} color={colors.primary} />
          <Text style={[styles.appName, { color: colors.text }]}>
            Musician's Companion
          </Text>
          <Text style={[styles.tagline, { color: colors.muted }]}>
            Your musical journey, organized
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          
          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
          
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.muted }]}>
              Don't have an account?
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.registerLink, { color: colors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.demoAccountsContainer}>
            <Text style={[styles.demoAccountsTitle, { color: colors.text }]}>
              Demo Accounts
            </Text>
            <View style={[styles.demoAccount, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.demoAccountLabel, { color: colors.text }]}>User:</Text>
              <Text style={[styles.demoAccountValue, { color: colors.muted }]}>
                user@example.com / password
              </Text>
            </View>
            <View style={[styles.demoAccount, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.demoAccountLabel, { color: colors.text }]}>Admin:</Text>
              <Text style={[styles.demoAccountValue, { color: colors.muted }]}>
                admin@example.com / password
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48, },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginTop: 16,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  demoAccountsContainer: {
    marginTop: 24,
  },
  demoAccountsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoAccount: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  demoAccountLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  demoAccountValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});