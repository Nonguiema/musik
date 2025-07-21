import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { router, useLocalSearchParams } from 'expo-router';
import { mockSongs } from '@/data/mockData';

const commonChords = [
  'C', 'Cm', 'Cmaj7', 'C7', 
  'D', 'Dm', 'Dmaj7', 'D7',
  'E', 'Em', 'Emaj7', 'E7',
  'F', 'Fm', 'Fmaj7', 'F7',
  'G', 'Gm', 'Gmaj7', 'G7',
  'A', 'Am', 'Amaj7', 'A7',
  'B', 'Bm', 'Bmaj7', 'B7',
  '|', 'sus4', 'dim', 'aug'
];

export default function CreateChordScreen() {
  const { colors } = useTheme();
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const [chordProgression, setChordProgression] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Find the song
  const song = mockSongs.find(s => s.id === songId);
  
  const addChord = (chord: string) => {
    setChordProgression(prev => {
      if (chord === '|') {
        return prev + ' | ';
      }
      return prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + chord;
    });
  };
  
  const handleSubmit = async () => {
    if (!chordProgression) {
      Alert.alert('Error', 'Please enter a chord progression');
      return;
    }
    
    try {
      setLoading(true);
      
      // Mock creating chord notes in a real database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to song details with a success message
      router.back();
      Alert.alert('Success', 'Chord notes added successfully');
    } catch (error) {
      console.error('Error creating chord notes:', error);
      Alert.alert('Error', 'Failed to add chord notes');
    } finally {
      setLoading(false);
    }
  };
  
  if (!song) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Song not found
        </Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: colors.text }]}>
            {song.title}
          </Text>
          {song.artist && (
            <Text style={[styles.songArtist, { color: colors.muted }]}>
              by {song.artist}
            </Text>
          )}
        </View>
        
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>
            Chord Progression
          </Text>
          <View
            style={[
              styles.chordTextareaContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[
                styles.chordTextarea,
                { color: colors.text },
              ]}
              value={chordProgression}
              onChangeText={setChordProgression}
              placeholder="Add chords using the keyboard below or type manually"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.chordKeyboardContainer}>
            <Text style={[styles.keyboardTitle, { color: colors.text }]}>
              Chord Keyboard
            </Text>
            <View style={styles.chordKeyboard}>
              {commonChords.map(chord => (
                <TouchableOpacity
                  key={chord}
                  style={[
                    styles.chordButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => addChord(chord)}
                >
                  <Text style={[styles.chordButtonText, { color: colors.text }]}>
                    {chord}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Input
            label="Notes"
            placeholder="Add any notes about this chord progression"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save Chord Notes"
              onPress={handleSubmit}
              loading={loading}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  songInfo: {
    marginBottom: 24,
  },
  songTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  songArtist: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    marginTop: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  chordTextareaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  chordTextarea: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chordKeyboardContainer: {
    marginBottom: 16,
  },
  keyboardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  chordKeyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chordButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    margin: 4,
  },
  chordButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});