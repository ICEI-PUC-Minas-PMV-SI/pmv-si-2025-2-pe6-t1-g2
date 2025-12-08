// src/screens/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SaberHeader } from '../components/SaberHeader';
import type { RootTabParamList } from '../navigation/TabNavigator';
import { DashboardProfessor } from './teachers/DashboardProfessor';
import { DashboardAluno } from './student/DashboardAluno';

const colors = {
  primary: '#F2C016',   // cor-primaria
  secondary: '#1B8EF2', // cor-secundaria
  text: '#37474F',
  background: '#F7F9F9',
  card: '#FFFFFF',
  borderSoft: '#ECEFF1',
  mutedText: '#607D8B',
  white: '#FFFFFF',
  black: '#000000',
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type DashboardTabNav = BottomTabNavigationProp<RootTabParamList, 'Dashboard'>;

export function Dashboard() {
  const navigation = useNavigation<DashboardTabNav>();

  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<number | null>(null);

  useEffect(() => {
    async function loadUserType() {
      try {
        const stored = await AsyncStorage.getItem('@sabermais_userType');
        if (stored != null && stored !== '') {
          setUserType(Number(stored));
        } else {
          setUserType(null);
        }
      } catch (err) {
        console.error('[Dashboard] Erro ao ler userType:', err);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserType();
  }, []);

  function handleEntrar() {
    // Vai para a aba Perfil, que abre o Login
    navigation.navigate('Perfil');
  }

  function handleCadastrar() {
    // Vai para a aba Perfil já indo para a tela de Cadastro (escolher aluno/professor)
    navigation.navigate('Perfil' as never, { screen: 'Cadastro' } as never);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SaberHeader />
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={colors.secondary} />
          <Text style={styles.loadingText}>
            Carregando seu dashboard…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Professor logado
  if (userType === 1) {
    return <DashboardProfessor />;
  }

  // Aluno logado
  if (userType === 0) {
    return <DashboardAluno />;
  }

  // Não logado / tipo desconhecido
  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Dashboard para Aluno/Professor</Text>

        <Text style={styles.subtitle}>
          Entre com sua conta de aluno ou professor para acompanhar aulas,
          agendamentos e sua rotina de estudos.
        </Text>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={handleEntrar}
          >
            <Text style={styles.primaryButtonText}>Faça login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.9}
            onPress={handleCadastrar}
          >
            <Text style={styles.secondaryButtonText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Como funciona?</Text>
          <Text style={styles.infoText}>
            • Alunos conseguem ver próximos agendamentos e histórico de aulas.
            {'\n'}
            • Professores conseguem acompanhar sua disponibilidade, agendamentos
            e atividades recentes.
          </Text>
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
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.mutedText,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsWrapper: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  secondaryButtonText: {
    color: colors.secondary,
    fontSize: 15,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  infoTitle: {
    fontSize: 15,
    fontFamily: fonts.title,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
});
