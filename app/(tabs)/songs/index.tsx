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
import { SongCard } from '@/components/song/SongCard';
import { Link } from 'expo-router';
import { PlusCircle, Search } from 'lucide-react-native';
import { mockSongs } from '@/data/mockData';

export default function SongsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter songs based on search query
  const filteredSongs = mockSongs.filter(
    song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist &&
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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
            placeholder="Search songs by title or artist"
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Link href="/songs/create" asChild>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <PlusCircle size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Link>
      </View>
      
      <ScrollView
        style={styles.songsContainer}
        contentContainerStyle={styles.songsContent}
      >
        {filteredSongs.length > 0 ? (
          filteredSongs.map(song => <SongCard key={song.id} song={song} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {searchQuery
                ? 'No songs match your search'
                : 'No songs found. Add your first song!'}
            </Text>
            <Link href="/songs/create" asChild>
              <TouchableOpacity
                style={[
                  styles.emptyButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.emptyButtonText}>Add New Song</Text>
              </TouchableOpacity>
            </Link>
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
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songsContainer: {
    flex: 1,
  },
  songsContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});