import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Search, Mic2, Clock, Music, ChevronRight } from 'lucide-react-native';
import { mockRecordings, mockSongs } from '@/data/mockData';
import { router } from 'expo-router';

export default function RecordingsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'session' | 'intro' | 'break'>('all');
  
  // Map recordings to include song info
  const recordingsWithSongInfo = mockRecordings.map(recording => {
    const song = mockSongs.find(s => s.id === recording.songId);
    return {
      ...recording,
      songTitle: song?.title || 'Unknown Song',
    };
  });
  
  // Filter recordings based on search query and type filter
  const filteredRecordings = recordingsWithSongInfo.filter(recording => {
    const matchesSearch =
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.songTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || recording.type === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'session':
        return colors.primary;
      case 'intro':
        return colors.accent;
      case 'break':
        return colors.secondary;
      default:
        return colors.muted;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <Mic2 size={20} color={getTypeColor(type)} />;
      case 'intro':
        return <Music size={20} color={getTypeColor(type)} />;
      case 'break':
        return <Clock size={20} color={getTypeColor(type)} />;
      default:
        return <Mic2 size={20} color={getTypeColor(type)} />;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search size={20} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search recordings"
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'all' ? '#FFFFFF' : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'session' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('session')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'session' ? '#FFFFFF' : colors.text },
            ]}
          >
            Sessions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'intro' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('intro')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'intro' ? '#FFFFFF' : colors.text },
            ]}
          >
            Intros
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'break' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('break')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'break' ? '#FFFFFF' : colors.text },
            ]}
          >
            Breaks
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.recordingsContainer}
        contentContainerStyle={styles.recordingsContent}
      >
        {filteredRecordings.length > 0 ? (
          filteredRecordings.map(recording => (
            <TouchableOpacity
              key={recording.id}
              style={[
                styles.recordingItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => {
                // In a real app, navigate to recording details
                // For now, just show the song details
                router.push(`/songs/${recording.songId}`);
              }}
            >
              <View style={styles.recordingInfo}>
                <View
                  style={[
                    styles.recordingTypeIconContainer,
                    { backgroundColor: getTypeColor(recording.type) + '20' },
                  ]}
                >
                  {getTypeIcon(recording.type)}
                </View>
                <View style={styles.recordingTextContainer}>
                  <Text
                    style={[styles.recordingTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {recording.title}
                  </Text>
                  <Text
                    style={[styles.recordingSongTitle, { color: colors.muted }]}
                    numberOfLines={1}
                  >
                    {recording.songTitle}
                  </Text>
                  <Text
                    style={[styles.recordingDate, { color: colors.muted }]}
                  >
                    {new Date(recording.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {searchQuery
                ? 'No recordings match your search'
                : 'No recordings found'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  recordingsContainer: {
    flex: 1,
  },
  recordingsContent: {
    padding: 16,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordingTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  recordingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  recordingSongTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  recordingDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});