// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import { Buscar } from '../screens/Buscar';
import { Dashboard } from '../screens/Dashboard';
import { PerfilStack } from './PerfilStack';

export type RootTabParamList = {
  Buscar: undefined;
  Dashboard: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1B8EF2', // cor-secundaria
        tabBarInactiveTintColor: '#607D8B',
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color }) => {
          let icon = '●';

          if (route.name === 'Buscar') icon = '🔍';
          if (route.name === 'Dashboard') icon = '📊';
          if (route.name === 'Perfil') icon = '👤';

          return <Text style={[styles.tabIcon, { color }]}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Buscar"
        component={Buscar}
        options={{ title: 'Buscar' }}
      />
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    paddingBottom: 6,
    paddingTop: 4,
    borderTopColor: '#ECEFF1', // cor-borda-suave
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    textAlign: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
