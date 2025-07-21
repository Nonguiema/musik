export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  coverImage?: string;
  originalAudioUrl?: string;
  createdAt: string;
  userId: string;
  recordingsCount?: number;
  notesCount?: number;
}

export interface Recording {
  id: string;
  songId: string;
  title: string;
  type: 'session' | 'intro' | 'break';
  audioUrl: string;
  notes?: string;
  createdAt: string;
  userId: string;
}

export interface ChordNote {
  id: string;
  songId: string;
  chordProgression: string;
  position?: number; // timestamp in song
  notes?: string;
  createdAt: string;
  userId: string;
}