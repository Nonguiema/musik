import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function SongsLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'My Songs',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Song Details',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerTitle: 'Create Song',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerTitle: 'Edit Song',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="chord/create"
        options={{
          headerTitle: 'Add Chord Notes',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="recordings/create"
        options={{
          headerTitle: 'Add Recording',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}