import React, { useState } from 'react';
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
import { router } from 'expo-router';
import {
  User,
  Music,
  Mic2,
  Settings,
  FileText,
  RefreshCw,
  Database,
  Shield,
  UserPlus,
} from 'lucide-react-native';
import { mockSongs, mockRecordings, mockChordNotes } from '@/data/mockData';

export default function AdminScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Redirect if not admin
  if (!user?.isAdmin) {
    Alert.alert('Access Denied', 'You do not have permission to access this page');
    router.replace('/(tabs)');
    return null;
  }
  
  const handleRefreshData = () => {
    setLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Database synchronized successfully');
    }, 2000);
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Shield size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Admin Dashboard
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.statsHeader}>
            <User size={20} color={colors.primary} />
            <Text style={[styles.statsTitle, { color: colors.text }]}>Users</Text>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>2</Text>
        </View>
        
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.statsHeader}>
            <Music size={20} color={colors.secondary} />
            <Text style={[styles.statsTitle, { color: colors.text }]}>Songs</Text>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>
            {mockSongs.length}
          </Text>
        </View>
        
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.statsHeader}>
            <Mic2 size={20} color={colors.accent} />
            <Text style={[styles.statsTitle, { color: colors.text }]}>
              Recordings
            </Text>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>
            {mockRecordings.length}
          </Text>
        </View>
        
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.statsHeader}>
            <FileText size={20} color={colors.error} />
            <Text style={[styles.statsTitle, { color: colors.text }]}>
              Chord Notes
            </Text>
          </View>
          <Text style={[styles.statsValue, { color: colors.text }]}>
            {mockChordNotes.length}
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Database Management
        </Text>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRefreshData}
            disabled={loading}
          >
            <View style={styles.actionButtonContent}>
              <RefreshCw
                size={20}
                color={colors.primary}
                style={loading ? styles.rotating : undefined}
              />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                {loading ? 'Synchronizing...' : 'Synchronize Database'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.actionButtonContent}>
              <Database size={20} color={colors.secondary} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Backup Database
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.actionButtonContent}>
              <Database size={20} color={colors.accent} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Restore Database
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          User Management
        </Text>
        <View
          style={[
            styles.sectionContent,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.actionButtonContent}>
              <UserPlus size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Add New User
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.actionButtonContent}>
              <User size={20} color={colors.secondary} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                Manage Users
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Coming Soon', 'This feature is not yet implemented');
            }}
          >
            <View style={styles.actionButtonContent}>
              <Settings size={20} color={colors.accent} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>
                System Settings
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  statsValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
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
  actionButton: {
    padding: 16,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  rotating: {
    // In a real app, we would use Animated to rotate this
  },
});