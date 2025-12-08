// src/screens/Buscar.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { SaberHeader } from '../components/SaberHeader';

const API_BASE = 'https://chivalrous-maidenish-bertha.ngrok-free.dev';

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

type Professor = {
  id: number;
  nome: string;
  email: string;
  password?: string;
  cpf?: string;
  tipo?: number;
  descricao?: string;
  certificacoes?: string[];
  competencias?: string[];
  valorHora?: number;
};

export function Buscar() {
  const navigation = useNavigation<any>();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  async function loadProfessores(showRefreshSpinner = false) {
    try {
      if (showRefreshSpinner) {
        setLoadingRefresh(true);
      } else {
        setLoading(true);
      }
      setErrorMessage(null);

      const token = await AsyncStorage.getItem('@sabermais_token');

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const resp = await fetch(`${API_BASE}/api/Professores`, {
        method: 'GET',
        headers,
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('[Buscar] Erro ao buscar professores:', text);
        setErrorMessage(
          `Não foi possível carregar a lista de professores (HTTP ${resp.status}).`,
        );
        setProfessores([]);
        return;
      }

      const data: Professor[] = await resp.json();
      setProfessores(data);
    } catch (err: any) {
      console.error('[Buscar] Erro inesperado:', err);
      setErrorMessage(
        'Ocorreu um erro ao carregar os professores. Verifique sua conexão e tente novamente.',
      );
      setProfessores([]);
    } finally {
      setLoading(false);
      setLoadingRefresh(false);
    }
  }

  useEffect(() => {
    loadProfessores(false);
  }, []);

  const filteredProfessores = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return professores;

    return professores.filter((prof) => {
      const nome = prof.nome?.toLowerCase() ?? '';
      const desc = prof.descricao?.toLowerCase() ?? '';
      const comps = (prof.competencias ?? []).join(' ').toLowerCase();
      const certs = (prof.certificacoes ?? []).join(' ').toLowerCase();

      return (
        nome.includes(term) ||
        desc.includes(term) ||
        comps.includes(term) ||
        certs.includes(term)
      );
    });
  }, [professores, search]);

  function handleVerOpcoes(prof: Professor) {
    // IMPORTANTE:
    // "Perfil" é exatamente o name da Tab onde está o PerfilStack
    // em TabNavigator: <Tab.Screen name="Perfil" component={PerfilStack} />
    navigation.navigate('Perfil', {
      screen: 'Contratar',
      params: {
        professorId: prof.id,
        professorNome: prof.nome,
      },
    });
  }

  const isLoadingInitial = loading && !loadingRefresh;

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Buscar professores</Text>

        <Text style={styles.subtitle}>
          Digite o nome, competência ou certificação para encontrar o professor
          ideal.
        </Text>

        {/* Campo de busca */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ex.: Álgebra, Física, Inglês, Geometria…"
            placeholderTextColor="#B0BEC5"
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => loadProfessores(true)}
            disabled={loadingRefresh}
          >
            <Text style={styles.searchButtonText}>
              {loadingRefresh ? 'Atualizando…' : 'Atualizar lista'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mensagem de erro */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Loading inicial */}
        {isLoadingInitial ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.loadingText}>Carregando professores…</Text>
          </View>
        ) : filteredProfessores.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Nenhum professor encontrado para essa busca.
            </Text>
            <Text style={styles.emptyHint}>
              Experimente outro termo, como disciplina, competência ou nome.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredProfessores.map((prof) => (
              <View key={prof.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>👨‍🏫</Text>
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.profName}>{prof.nome}</Text>
                    {prof.valorHora !== undefined && prof.valorHora !== null && (
                      <Text style={styles.valorHora}>
                        R$ {prof.valorHora.toFixed(2).replace('.', ',')} / hora
                      </Text>
                    )}
                  </View>
                </View>

                {prof.descricao ? (
                  <Text style={styles.descricao} numberOfLines={3}>
                    {prof.descricao}
                  </Text>
                ) : (
                  <Text style={styles.descricaoVazia}>
                    Professor ainda não adicionou uma descrição detalhada.
                  </Text>
                )}

                {/* Competências */}
                {prof.competencias && prof.competencias.length > 0 && (
                  <View style={styles.chipsRow}>
                    {prof.competencias.map((comp, idx) => (
                      <View key={`${prof.id}-comp-${idx}`} style={styles.chip}>
                        <Text style={styles.chipText}>{comp}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Certificações */}
                {prof.certificacoes && prof.certificacoes.length > 0 && (
                  <View style={styles.chipsRowSecondary}>
                    {prof.certificacoes.map((cert, idx) => (
                      <View
                        key={`${prof.id}-cert-${idx}`}
                        style={styles.chipSecondary}
                      >
                        <Text style={styles.chipSecondaryText}>{cert}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleVerOpcoes(prof)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionButtonText}>
                    Ver opções de aula
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  title: {
    fontSize: 22,
    fontFamily: fonts.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.mutedText,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBox: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    marginBottom: 8,
  },
  searchButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
  errorBox: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#C62828',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
  emptyBox: {
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    marginBottom: 4,
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  cardHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profName: {
    fontSize: 16,
    fontFamily: fonts.title,
    fontWeight: '600',
    color: colors.text,
  },
  valorHora: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.secondary,
    marginTop: 2,
  },
  descricao: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.text,
    marginTop: 4,
    marginBottom: 6,
  },
  descricaoVazia: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.mutedText,
    marginTop: 4,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E3F2FD',
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.secondary,
  },
  chipsRowSecondary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chipSecondary: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFF8E1',
  },
  chipSecondaryText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.primary,
  },
  actionButton: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: fonts.text,
    fontWeight: '600',
    color: colors.black,
  },
});
