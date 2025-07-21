import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { SongCard } from '@/components/song/SongCard';
import { Link } from 'expo-router';
import { PlusCircle, Music, Mic2, FileText } from 'lucide-react-native';
import { mockSongs } from '@/data/mockData';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  // Get the most recent songs (limit to 3)
  const recentSongs = mockSongs.slice(0, 3);
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back,
        </Text>
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.name || 'Musician'}
        </Text>
      </View>
      
      <View style={styles.actionsSection}>
        <Link href="/songs/create" asChild>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <PlusCircle size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Song</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/recordings" asChild>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          >
            <Mic2 size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Recordings</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.statsSection}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Music size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{mockSongs.length}</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Songs</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Mic2 size={24} color={colors.secondary} />
          <Text style={[styles.statValue, { color: colors.text }]}>15</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Recordings</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FileText size={24} color={colors.accent} />
          <Text style={[styles.statValue, { color: colors.text }]}>9</Text>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Chord Notes</Text>
        </View>
      </View>
      
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Songs
          </Text>
          <Link href="/songs" asChild>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {recentSongs.map(song => (
          <SongCard key={song.id} song={song} />
        ))}
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
  welcomeSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  actionsSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '30%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});