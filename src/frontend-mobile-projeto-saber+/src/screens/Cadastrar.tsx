// src/screens/Cadastrar.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SaberHeader } from '../components/SaberHeader';
import type { PerfilStackParamList } from '../navigation/PerfilStack';

const colors = {
  primary: '#F2C016',   // cor-primaria
  secondary: '#1B8EF2', // cor-secundaria
  text: '#37474F',
  background: '#F7F9F9',
  white: '#FFF',
  borderSoft: '#ECEFF1',
  black: '#000',
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type PerfilNav = NativeStackNavigationProp<PerfilStackParamList, 'Cadastro'>;

export function Cadastrar() {
  const navigation = useNavigation<PerfilNav>();

  const handleStudentPress = () => {
    // ANTES podia estar 'PerfilCadastroAluno'
    navigation.navigate('CadastroAluno');
  };

  const handleTeacherPress = () => {
    // ANTES podia estar 'PerfilCadastroProfessor'
    navigation.navigate('CadastroProfessor');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Cadastro</Text>

        <Text style={styles.subtitle}>
          Escolha como você deseja usar a plataforma.
        </Text>

        <View style={styles.cardsRow}>
          {/* Card estudante */}
          <View style={styles.card}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>📚</Text>
            </View>

            <TouchableOpacity
              style={styles.cardButton}
              activeOpacity={0.9}
              onPress={handleStudentPress}
            >
              <Text style={styles.cardButtonText}>Cadastro para estudante</Text>
            </TouchableOpacity>
          </View>

          {/* Card instrutor */}
          <View style={styles.card}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👨‍🏫</Text>
            </View>

            <TouchableOpacity
              style={styles.cardButton}
              activeOpacity={0.9}
              onPress={handleTeacherPress}
            >
              <Text style={styles.cardButtonText}>Cadastro para instrutor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: fonts.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  cardButton: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minWidth: 150,
  },
  cardButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.text,
    textAlign: 'center',
  },
});
