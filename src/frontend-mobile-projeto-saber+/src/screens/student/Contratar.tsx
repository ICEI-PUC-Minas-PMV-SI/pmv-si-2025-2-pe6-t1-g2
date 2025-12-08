// src/screens/student/Contratar.tsx
import React, { useEffect, useState } from 'react';
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

import { SaberHeader } from '../../components/SaberHeader';

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

type RouteParams = {
  professorId: number;
  professorNome?: string;
};

type DisponibilidadeProfessor = {
  id: number;
  diaDaSemana: number;
  horaInicio: string;
  horaFim: string;
  professorId: number;
  professor?: {
    id: number;
    nome: string;
    email?: string;
    descricao?: string;
    valorHora?: number;
  } | null;
};

export function Contratar() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { professorId, professorNome }: RouteParams = route.params || {};

  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeProfessor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function getDiaSemanaLabel(dia?: number | null): string {
    const dias = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    if (dia === null || dia === undefined) return 'Dia não informado';
    return dias[dia] ?? `Dia ${dia}`;
  }

  function formatHora(hora?: string | null): string {
    if (!hora) return 'Horário não informado';
    if (hora.length >= 5) return hora.substring(0, 5);
    return hora;
  }

  async function loadDisponibilidades(showRefreshSpinner = false) {
    if (!professorId && professorId !== 0) {
      setErrorMessage('Professor não informado. Volte e selecione um professor novamente.');
      setDisponibilidades([]);
      setLoading(false);
      setLoadingRefresh(false);
      return;
    }

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

      const resp = await fetch(`${API_BASE}/api/Disponibilidades`, {
        method: 'GET',
        headers,
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('[Contratar] Erro ao buscar disponibilidades:', text);
        setErrorMessage(
          `Não foi possível carregar as disponibilidades (HTTP ${resp.status}).`,
        );
        setDisponibilidades([]);
        return;
      }

      const json = await resp.json();
      const data: DisponibilidadeProfessor[] = Array.isArray(json) ? json : [];

      const filtradas = data.filter(
        (disp) => disp.professorId === professorId,
      );

      setDisponibilidades(filtradas);
    } catch (err: any) {
      console.error('[Contratar] Erro inesperado:', err);
      setErrorMessage(
        'Ocorreu um erro ao carregar as disponibilidades. Verifique sua conexão e tente novamente.',
      );
      setDisponibilidades([]);
    } finally {
      setLoading(false);
      setLoadingRefresh(false);
    }
  }

  useEffect(() => {
    loadDisponibilidades(false);
  }, [professorId]);

  function handleEscolherHorario(disp: DisponibilidadeProfessor) {
    if (!professorId) {
      Alert.alert(
        'Professor não informado',
        'Volte para a tela de busca e selecione o professor novamente.',
      );
      return;
    }

    // Agora vamos para a tela de confirmação (AgendarProfessor)
    navigation.navigate('AgendarProfessor', {
      professorId,
      professorNome,
      disponibilidadeId: disp.id,
      diaDaSemana: disp.diaDaSemana,
      horaInicio: disp.horaInicio,
      horaFim: disp.horaFim,
    });
  }

  const professorDisplayName = professorNome || 'Professor';
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
        <Text style={styles.title}>
          Opções de aula com {professorDisplayName}
        </Text>

        <Text style={styles.subtitle}>
          Veja abaixo os dias e horários que {professorDisplayName} informou como
          disponível para aulas individuais.
        </Text>

        <View style={styles.headerInfoBox}>
          <Text style={styles.headerInfoTitle}>Passo 1 de 2</Text>
          <Text style={styles.headerInfoText}>
            Primeiro, escolha o melhor dia e horário. Na próxima tela você confirma
            o agendamento.
          </Text>
        </View>

        <View style={styles.refreshRow}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => loadDisponibilidades(true)}
            disabled={loadingRefresh}
          >
            <Text style={styles.refreshButtonText}>
              {loadingRefresh ? 'Atualizando…' : 'Atualizar horários'}
            </Text>
          </TouchableOpacity>
        </View>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {isLoadingInitial ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.loadingText}>
              Carregando disponibilidades…
            </Text>
          </View>
        ) : disponibilidades.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Nenhuma disponibilidade cadastrada para este professor.
            </Text>
            <Text style={styles.emptyHint}>
              Tente voltar mais tarde ou escolher outro professor na tela de
              busca.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {disponibilidades.map((disp) => (
              <View key={disp.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View className="dia">
                    <Text style={styles.dayBadgeText}>
                      {getDiaSemanaLabel(disp.diaDaSemana)}
                    </Text>
                  </View>

                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>
                      {formatHora(disp.horaInicio)} às {formatHora(disp.horaFim)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEscolherHorario(disp)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionButtonText}>
                    Escolher este horário
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
    fontSize: 20,
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
    marginBottom: 16,
  },
  headerInfoBox: {
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  headerInfoTitle: {
    fontSize: 12,
    fontFamily: fonts.text,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  headerInfoText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.text,
  },
  refreshRow: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  refreshButtonText: {
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
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.mutedText,
    textAlign: 'center',
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayBadgeText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.secondary,
    fontWeight: '600',
  },
  timeBox: {
    flex: 1,
    marginLeft: 10,
  },
  timeText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    fontWeight: '600',
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
