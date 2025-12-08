// src/screens/teachers/PerfilProfessor.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { SaberHeader } from '../../components/SaberHeader';
import type { PerfilStackParamList } from '../../navigation/PerfilStack';

const API_BASE_URL = 'https://chivalrous-maidenish-bertha.ngrok-free.dev';

const colors = {
  primary: '#F2C016',
  secondary: '#1B8EF2',
  text: '#37474F',
  background: '#F7F9F9',
  white: '#FFF',
  borderSoft: '#ECEFF1',
  grayText: '#607D8B',
  danger: '#E53935',
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type PerfilNav = NativeStackNavigationProp<
  PerfilStackParamList,
  'PerfilProfessor'
>;

type PerfilRoute = RouteProp<PerfilStackParamList, 'PerfilProfessor'>;

type Professor = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  descricao: string;
  certificacoes: string[];
  competencias: string[];
  valorHora: number;
};

export function PerfilProfessor() {
  const navigation = useNavigation<PerfilNav>();
  const route = useRoute<PerfilRoute>();

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // id do professor vindo pela navegação (Login -> PerfilProfessor)
  const professorIdFromParams = route.params?.professorId;

  const carregarPerfil = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('@sabermais_token');
      const professorId =
        professorIdFromParams ??
        Number(await AsyncStorage.getItem('@sabermais_professorId'));

      if (!token || !professorId || Number.isNaN(professorId)) {
        setError(
          'Não foi possível carregar o perfil. Faça login novamente.'
        );
        return;
      }

      // guarda o id do professor para uso futuro (editar, etc.)
      await AsyncStorage.setItem(
        '@sabermais_professorId',
        String(professorId)
      );

      const resp = await fetch(
        `${API_BASE_URL}/api/Professores/${professorId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resp.ok) {
        const body = await resp.text();
        console.log('Erro ao buscar professor:', resp.status, body);
        setError('Não foi possível carregar os dados do professor.');
        return;
      }

      const data: Professor = await resp.json();
      setProfessor(data);
    } catch (e) {
      console.log('Erro inesperado ao carregar professor:', e);
      setError('Erro inesperado ao carregar o perfil.');
    } finally {
      setLoading(false);
    }
  }, [professorIdFromParams]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const token = await AsyncStorage.getItem('@sabermais_token');

      if (token) {
        await fetch(`${API_BASE_URL}/api/Usuarios/Logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await AsyncStorage.multiRemove([
        '@sabermais_token',
        '@sabermais_userId',
        '@sabermais_userType',
        '@sabermais_professorId',
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.log('Erro ao fazer logout:', e);
      Alert.alert(
        'Erro',
        'Não foi possível sair da conta. Tente novamente.'
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleEditPress = () => {
    // vai para a tela de edição (que criaremos em seguida)
    navigation.navigate('EditarProfessor');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SaberHeader />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !professor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SaberHeader />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? 'Perfil não encontrado.'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={carregarPerfil}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
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
        <View style={styles.headerCard}>
          <Text style={styles.welcomeText}>
            Olá, <Text style={styles.welcomeName}>{professor.nome}</Text> 👋
          </Text>
          <Text style={styles.welcomeSub}>
            Este é o seu painel como professor. Aqui você acompanha sua
            descrição, competências e valor por hora.
          </Text>
        </View>

        {/* Card de informações principais */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações gerais</Text>

          <InfoRow label="E-mail" value={professor.email} />
          <InfoRow label="CPF" value={professor.cpf} />
          <InfoRow
            label="Valor por hora"
            value={`R$ ${professor.valorHora.toFixed(2)}`}
          />
        </View>

        {/* Descrição */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Sobre suas aulas</Text>
          <Text style={styles.descriptionText}>
            {professor.descricao || 'Sem descrição cadastrada.'}
          </Text>
        </View>

        {/* Certificações */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Certificações</Text>
          {professor.certificacoes && professor.certificacoes.length > 0 ? (
            professor.certificacoes.map((c, idx) => (
              <View key={idx} style={styles.badgeItem}>
                <Text style={styles.badgeText}>{c}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.mutedText}>
              Nenhuma certificação cadastrada.
            </Text>
          )}
        </View>

        {/* Competências */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Competências</Text>
          {professor.competencias && professor.competencias.length > 0 ? (
            <View style={styles.badgeRow}>
              {professor.competencias.map((comp, idx) => (
                <View key={idx} style={styles.pill}>
                  <Text style={styles.pillText}>{comp}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.mutedText}>
              Nenhuma competência cadastrada.
            </Text>
          )}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
          >
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            <Text style={styles.logoutButtonText}>
              {logoutLoading ? 'Saindo...' : 'Sair'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    color: colors.grayText,
    fontFamily: fonts.text,
  },
  errorText: {
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: fonts.text,
  },
  retryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontFamily: fonts.text,
  },
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.text,
    marginBottom: 4,
  },
  welcomeName: {
    color: colors.secondary,
  },
  welcomeSub: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.grayText,
    lineHeight: 19,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.title,
    color: colors.text,
    marginBottom: 10,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.grayText,
    marginBottom: 2,
    fontFamily: fonts.text,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  mutedText: {
    fontSize: 13,
    color: colors.grayText,
    fontFamily: fonts.text,
  },
  badgeItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F1F7FF',
    borderWidth: 1,
    borderColor: '#D0E3FF',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 13,
    color: colors.secondary,
    fontFamily: fonts.text,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  } as any,
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 12,
    color: colors.secondary,
    fontFamily: fonts.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  } as any,
  editButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontFamily: fonts.text,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: colors.danger,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontFamily: fonts.text,
  },
});
