import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Image as ImageIcon, Music, X } from 'lucide-react-native';

export default function CreateSongScreen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setCoverImage(asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setAudioFile(asset.uri);
        setAudioFileName(asset.name);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
      Alert.alert('Error', 'Failed to select audio file');
    }
  };
  
  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a song title');
      return;
    }
    
    try {
      setLoading(true);
      
      // Mock creating a song in a real database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to songs list with a success message
      router.push('/songs');
      Alert.alert('Success', 'Song created successfully');
    } catch (error) {
      console.error('Error creating song:', error);
      Alert.alert('Error', 'Failed to create song');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <Input
            label="Song Title"
            placeholder="Enter song title"
            value={title}
            onChangeText={setTitle}
          />
          
          <Input
            label="Artist"
            placeholder="Enter artist name"
            value={artist}
            onChangeText={setArtist}
          />
          
          <Text style={[styles.label, { color: colors.text }]}>Cover Image</Text>
          <View style={styles.imageSection}>
            {coverImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: coverImage }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: colors.error }]}
                  onPress={() => setCoverImage(null)}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.imagePicker,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
                onPress={pickImage}
              >
                <ImageIcon size={24} color={colors.muted} />
                <Text style={[styles.imagePickerText, { color: colors.muted }]}>
                  Tap to select cover image
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[styles.label, { color: colors.text }]}>Original Audio</Text>
          <View style={styles.audioSection}>
            {audioFile ? (
              <View
                style={[
                  styles.audioFileContainer,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.audioFileInfo}>
                  <Music size={20} color={colors.primary} />
                  <Text
                    style={[styles.audioFileName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {audioFileName || 'Audio file'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setAudioFile(null);
                  setAudioFileName(null);
                }}>
                  <X size={20} color={colors.muted} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.audioPicker,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
                onPress={pickAudio}
              >
                <Music size={24} color={colors.muted} />
                <Text style={[styles.audioPickerText, { color: colors.muted }]}>
                  Tap to select original audio file
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Create Song"
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
  form: {
    marginTop: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  imageSection: {
    marginBottom: 16,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
  },
  audioSection: {
    marginBottom: 24,
  },
  audioPicker: {
    width: '100%',
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioPickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
  },
  audioFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  audioFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioFileName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
});