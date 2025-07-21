import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import {
  User,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
        },
      ]
    );
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: colors.primary + '30' },
          ]}
        >
          <User size={40} color={colors.primary} />
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.userEmail, { color: colors.muted }]}>
          {user?.email || 'user@example.com'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.optionButton,
              theme === 'light' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setTheme('light')}
          >
            <Sun
              size={20}
              color={theme === 'light' ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: theme === 'light' ? colors.primary : colors.text,
                  fontFamily:
                    theme === 'light' ? 'Inter-Medium' : 'Inter-Regular',
                },
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              theme === 'dark' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setTheme('dark')}
          >
            <Moon
              size={20}
              color={theme === 'dark' ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: theme === 'dark' ? colors.primary : colors.text,
                  fontFamily:
                    theme === 'dark' ? 'Inter-Medium' : 'Inter-Regular',
                },
              ]}
            >
              Dark
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              theme === 'system' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setTheme('system')}
          >
            <Monitor
              size={20}
              color={theme === 'system' ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: theme === 'system' ? colors.primary : colors.text,
                  fontFamily:
                    theme === 'system' ? 'Inter-Medium' : 'Inter-Regular',
                },
              ]}
            >
              System
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Settings
        </Text>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // Navigate to settings in a real app
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.settingItemLeft}>
              <Settings size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Account Settings
              </Text>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </TouchableOpacity>
          
          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // Navigate to notifications in a real app
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.settingItemLeft}>
              <Bell size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Notifications
              </Text>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </TouchableOpacity>
          
          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              // Navigate to help in a real app
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.settingItemLeft}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                Help & Support
              </Text>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        leftIcon={<LogOut size={16} color={colors.text} />}
        style={[styles.logoutButton, { borderColor: colors.border }]}
      />
      
      <Text style={[styles.versionText, { color: colors.muted }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

// Need to import ChevronRight locally since we're using it directly in a component
import { ChevronRight } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  logoutButton: {
    marginTop: 8,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});