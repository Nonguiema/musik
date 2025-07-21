import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLocalSearchParams, Link, router } from 'expo-router';
import {
  Clock,
  Edit,
  FileText,
  Mic2,
  MoreVertical,
  Music,
  PlusCircle,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import { mockSongs, mockRecordings, mockChordNotes } from '@/data/mockData';

export default function SongDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showOptions, setShowOptions] = useState(false);
  
  // Find the song details
  const song = mockSongs.find(s => s.id === id);
  
  // Get recordings for this song
  const recordings = mockRecordings.filter(r => r.songId === id);
  
  // Get chord notes for this song
  const chordNotes = mockChordNotes.filter(c => c.songId === id);
  
  if (!song) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Song not found
        </Text>
      </View>
    );
  }
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Song',
      'Are you sure you want to delete this song? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, delete from database
            router.replace('/songs');
          },
        },
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          {song.coverImage ? (
            <Image source={{ uri: song.coverImage }} style={styles.coverImage} />
          ) : (
            <View
              style={[
                styles.coverImagePlaceholder,
                { backgroundColor: colors.primary + '30' },
              ]}
            >
              <Music size={48} color={colors.primary} />
            </View>
          )}
          
          <View style={styles.overlay}>
            <Text style={[styles.title, { color: '#FFFFFF' }]}>{song.title}</Text>
            {song.artist && (
              <Text style={[styles.artist, { color: '#FFFFFF' }]}>
                {song.artist}
              </Text>
            )}
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                onPress={() => router.push(`/songs/edit/${song.id}`)}
                style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              >
                <Edit size={18} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowOptions(!showOptions)}
                style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              >
                <MoreVertical size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {showOptions && (
              <View
                style={[
                  styles.optionsMenu,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={handleDelete}
                >
                  <Trash2 size={16} color={colors.error} />
                  <Text style={[styles.optionText, { color: colors.error }]}>
                    Delete Song
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Mic2 size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Recordings
                </Text>
              </View>
              
              <Link href={`/songs/recordings/create?songId=${id}`} asChild>
                <TouchableOpacity>
                  <PlusCircle size={20} color={colors.primary} />
                </TouchableOpacity>
              </Link>
            </View>
            
            {recordings.length > 0 ? (
              <View>
                {recordings.map(recording => (
                  <TouchableOpacity
                    key={recording.id}
                    style={[
                      styles.recordingItem,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <View style={styles.recordingInfo}>
                      <View style={styles.recordingTypeContainer}>
                        {recording.type === 'session' ? (
                          <Mic2 size={16} color={colors.primary} />
                        ) : recording.type === 'intro' ? (
                          <Music size={16} color={colors.accent} />
                        ) : (
                          <Clock size={16} color={colors.secondary} />
                        )}
                      </View>
                      
                      <View style={styles.recordingTextContainer}>
                        <Text
                          style={[styles.recordingTitle, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {recording.title}
                        </Text>
                        
                        <Text
                          style={[styles.recordingDate, { color: colors.muted }]}
                        >
                          {new Date(recording.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    
                    <ChevronRight size={18} color={colors.muted} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View
                style={[
                  styles.emptyContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  No recordings yet
                </Text>
                <Link href={`/songs/recordings/create?songId=${id}`} asChild>
                  <TouchableOpacity
                    style={[
                      styles.emptyButton,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.emptyButtonText}>Add Recording</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <FileText size={20} color={colors.secondary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Chord Notes
                </Text>
              </View>
              
              <Link href={`/songs/chord/create?songId=${id}`} asChild>
                <TouchableOpacity>
                  <PlusCircle size={20} color={colors.secondary} />
                </TouchableOpacity>
              </Link>
            </View>
            
            {chordNotes.length > 0 ? (
              <View>
                {chordNotes.map(chordNote => (
                  <TouchableOpacity
                    key={chordNote.id}
                    style={[
                      styles.chordItem,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <View style={styles.chordInfo}>
                      <View style={styles.chordTextContainer}>
                        <Text
                          style={[styles.chordProgression, { color: colors.text }]}
                          numberOfLines={2}
                        >
                          {chordNote.chordProgression}
                        </Text>
                        
                        {chordNote.notes && (
                          <Text
                            style={[styles.chordNotes, { color: colors.muted }]}
                            numberOfLines={1}
                          >
                            {chordNote.notes}
                          </Text>
                        )}
                        
                        <Text style={[styles.chordDate, { color: colors.muted }]}>
                          {new Date(chordNote.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    
                    <ChevronRight size={18} color={colors.muted} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View
                style={[
                  styles.emptyContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  No chord notes yet
                </Text>
                <Link href={`/songs/chord/create?songId=${id}`} asChild>
                  <TouchableOpacity
                    style={[
                      styles.emptyButton,
                      { backgroundColor: colors.secondary },
                    ]}
                  >
                    <Text style={styles.emptyButtonText}>Add Chord Notes</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: 250,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  artist: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 4,
  },
  optionsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginLeft: 8,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordingTypeContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  recordingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  recordingDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  chordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  chordInfo: {
    flex: 1,
  },
  chordTextContainer: {
    flex: 1,
  },
  chordProgression: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  chordNotes: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  chordDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  emptyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});