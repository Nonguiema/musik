import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Music, Mic2, FileText } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Song } from '@/types';

interface SongCardProps {
  song: Song;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { colors } = useTheme();
  
  return (
    <Link href={`/songs/${song.id}`} asChild>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          {song.coverImage ? (
            <Image source={{ uri: song.coverImage }} style={styles.image} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary + '30' }]}>
              <Music size={32} color={colors.primary} />
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {song.title}
          </Text>
          
          <Text style={[styles.artist, { color: colors.muted }]} numberOfLines={1}>
            {song.artist || 'Unknown Artist'}
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Mic2 size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>
                {song.recordingsCount || 0} recordings
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <FileText size={14} color={colors.muted} />
              <Text style={[styles.statText, { color: colors.muted }]}>
                {song.notesCount || 0} notes
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  artist: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
});