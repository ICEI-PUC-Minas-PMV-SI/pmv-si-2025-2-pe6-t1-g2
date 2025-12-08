// src/screens/student/PerfilAluno.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SaberHeader } from '../../components/SaberHeader';
import type { PerfilStackParamList } from '../../navigation/PerfilStack';

const API_BASE = 'https://chivalrous-maidenish-bertha.ngrok-free.dev';

const colors = {
  primary: '#F2C016',
  secondary: '#1B8EF2',
  text: '#37474F',
  background: '#F7F9F9',
  borderSoft: '#ECEFF1',
  white: '#FFFFFF',
  black: '#000000',
  mutedText: '#607D8B',
  danger: '#E53935',
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type Nav = NativeStackNavigationProp<PerfilStackParamList, 'PerfilAluno'>;

export function PerfilAluno() {
  const navigation = useNavigation<Nav>();

  const [loading, setLoading] = useState(true);
  const [alunoId, setAlunoId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setLoading(true);

        const storedToken = await AsyncStorage.getItem('@sabermais_token');
        const storedAlunoId = await AsyncStorage.getItem('@sabermais_alunoId');

        if (!storedToken || !storedAlunoId) {
          Alert.alert(
            'Sessão expirada',
            'Não foi possível identificar o aluno logado. Faça login novamente.',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  }),
              },
            ],
          );
          return;
        }

        setToken(storedToken);
        setAlunoId(storedAlunoId);

        const response = await fetch(
          `${API_BASE}/api/Alunos/${storedAlunoId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );

        if (!response.ok) {
          const text = await response.text();
          console.error('[PerfilAluno] Erro no GET /Alunos/{id}:', text);
          Alert.alert(
            'Erro',
            `Não foi possível carregar os dados do aluno (HTTP ${response.status}).`,
          );
          return;
        }

        const data = await response.json();
        setNome(data.nome ?? '');
        setEmail(data.email ?? '');
        setCpf(data.cpf ?? '');
        setDescricao(data.descricao ?? '');
      } catch (err) {
        console.error('[PerfilAluno] Erro inesperado:', err);
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao carregar o perfil. Verifique sua conexão.',
        );
      } finally {
        setLoading(false);
      }
    }

    carregarPerfil();
  }, [navigation]);

  async function handleLogout() {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/Usuarios/Logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          // se der erro no logout do servidor, só seguimos
        });
      }

      await AsyncStorage.multiRemove([
        '@sabermais_token',
        '@sabermais_userId',
        '@sabermais_userType',
        '@sabermais_professorId',
        '@sabermais_alunoId',
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      console.error('[PerfilAluno] Erro ao sair:', err);
      Alert.alert(
        'Erro',
        'Não foi possível encerrar a sessão. Tente novamente.',
      );
    }
  }

  function handleEditar() {
    navigation.navigate('EditarAluno');
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SaberHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Carregando seu perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho de boas-vindas */}
        <Text style={styles.greeting}>Olá, {nome || 'aluno(a)'} 👋</Text>
        <Text style={styles.subtitle}>
          Aqui você acompanha seus dados principais do Saber+.
        </Text>

        {/* Card principal */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados da conta</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{nome || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{email || '-'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CPF</Text>
            <Text style={styles.infoValue}>{cpf || '-'}</Text>
          </View>

          <View style={[styles.infoRow, styles.infoRowColumn]}>
            <Text style={styles.infoLabel}>Sobre você</Text>
            <Text style={styles.infoValueMultiline}>
              {descricao || 'Você ainda não escreveu uma descrição.'}
            </Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEditar}
          >
            <Text style={[styles.buttonText, styles.editButtonText]}>
              Editar perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.mutedText,
    fontFamily: fonts.text,
  },
  greeting: {
    fontSize: 22,
    fontFamily: fonts.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.mutedText,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoRowColumn: {
    marginTop: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.mutedText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: fonts.text,
    color: colors.text,
  },
  infoValueMultiline: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  editButtonText: {
    color: colors.secondary,
  },
  logoutButton: {
    backgroundColor: colors.black,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.text,
    fontWeight: '600',
    color: colors.white,
  },
});
