import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { router, useLocalSearchParams } from 'expo-router';
import { mockSongs } from '@/data/mockData';
import { Audio } from 'expo-av';
import { Mic2, Stop, Play, Pause, Trash2 } from 'lucide-react-native';

export default function CreateRecordingScreen() {
  const { colors } = useTheme();
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'session' | 'intro' | 'break'>('session');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  
  // Find the song
  const song = mockSongs.find(s => s.id === songId);
  
  async function startRecording() {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'You need to grant microphone permissions to record audio.');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Create recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setRecordingStatus('recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  }
  
  async function stopRecording() {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      if (uri) {
        setRecordingUri(uri);
      }
      
      setRecording(null);
      setRecordingStatus('recorded');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  }
  
  async function playRecording() {
    if (recordingUri) {
      try {
        if (sound) {
          await sound.unloadAsync();
        }
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordingUri }
        );
        
        setSound(newSound);
        setIsPlaying(true);
        
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error('Failed to play recording:', error);
        Alert.alert('Error', 'Failed to play recording');
      }
    }
  }
  
  async function pausePlayback() {
    if (sound) {
      try {
        await sound.pauseAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('Failed to pause playback:', error);
      }
    }
  }
  
  async function deleteRecording() {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    
    setRecordingUri(null);
    setRecordingStatus('idle');
    setIsPlaying(false);
  }
  
  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title for your recording');
      return;
    }
    
    if (!recordingUri) {
      Alert.alert('Error', 'Please make a recording first');
      return;
    }
    
    try {
      setLoading(true);
      
      // Mock creating recording in a real database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to song details with a success message
      router.back();
      Alert.alert('Success', 'Recording added successfully');
    } catch (error) {
      console.error('Error creating recording:', error);
      Alert.alert('Error', 'Failed to add recording');
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
          <Input
            label="Recording Title"
            placeholder="Enter a title for your recording"
            value={title}
            onChangeText={setTitle}
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Recording Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'session' && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setType('session')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: type === 'session' ? '#FFFFFF' : colors.text },
                ]}
              >
                Practice Session
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'intro' && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setType('intro')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: type === 'intro' ? '#FFFFFF' : colors.text },
                ]}
              >
                Intro
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'break' && { backgroundColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => setType('break')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  { color: type === 'break' ? '#FFFFFF' : colors.text },
                ]}
              >
                Break
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.label, { color: colors.text }]}>Recording</Text>
          <View
            style={[
              styles.recordingContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {recordingStatus === 'idle' && (
              <View style={styles.recordingControls}>
                <TouchableOpacity
                  style={[styles.recordButton, { backgroundColor: colors.error }]}
                  onPress={startRecording}
                >
                  <Mic2 size={24} color="#FFFFFF" />
                  <Text style={styles.recordButtonText}>Start Recording</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {recordingStatus === 'recording' && (
              <View style={styles.recordingControls}>
                <Text style={[styles.recordingText, { color: colors.error }]}>
                  Recording in progress...
                </Text>
                <TouchableOpacity
                  style={[styles.stopButton, { backgroundColor: colors.error }]}
                  onPress={stopRecording}
                >
                  <Stop size={24} color="#FFFFFF" />
                  <Text style={styles.stopButtonText}>Stop Recording</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {recordingStatus === 'recorded' && (
              <View style={styles.recordingControls}>
                <Text style={[styles.recordedText, { color: colors.text }]}>
                  Recording complete!
                </Text>
                <View style={styles.playbackControls}>
                  {isPlaying ? (
                    <TouchableOpacity
                      style={[
                        styles.playbackButton,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={pausePlayback}
                    >
                      <Pause size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.playbackButton,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={playRecording}
                    >
                      <Play size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[
                      styles.playbackButton,
                      { backgroundColor: colors.error },
                    ]}
                    onPress={deleteRecording}
                  >
                    <Trash2 size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          
          <Input
            label="Notes"
            placeholder="Add any notes about this recording"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save Recording"
              onPress={handleSubmit}
              loading={loading}
              disabled={recordingStatus !== 'recorded'}
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
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  typeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  recordingContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  recordingControls: {
    alignItems: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  recordingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  recordedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playbackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
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