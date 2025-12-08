// src/components/SaberHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colors = {
  primary: '#F2C016',   // cor-primaria
  secondary: '#1B8EF2', // cor-secundaria
  borderSoft: '#ECEFF1',
  white: '#FFF',
};

const fonts = {
  title: 'Poppins', // fonte-titulo
};

export function SaberHeader() {
  return (
    <View style={styles.topBar}>
      <Text style={styles.logoText}>
        <Text style={styles.logoSaber}>Saber</Text>
        <Text style={styles.logoPlus}>+</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fonts.title,
  },
  logoSaber: {
    color: colors.secondary,
  },
  logoPlus: {
    color: colors.primary,
  },
});
