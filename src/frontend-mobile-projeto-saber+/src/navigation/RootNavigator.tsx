// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

import { Index } from '../screens/Index';
import { TabNavigator } from './TabNavigator';
import type { RootTabParamList } from './TabNavigator';

export type RootStackParamList = {
  Intro: undefined;
  MainTabs: NavigatorScreenParams<RootTabParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{ headerShown: false }}
    >
      {/* Tela inicial sem abas */}
      <Stack.Screen name="Intro" component={Index} />

      {/* App principal com as tabs (Buscar / Dashboard / Perfil) */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
