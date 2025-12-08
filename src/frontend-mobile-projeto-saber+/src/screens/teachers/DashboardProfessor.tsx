// src/screens/teachers/DashboardProfessor.tsx
import React, { useEffect, useState, useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SaberHeader } from '../../components/SaberHeader';
import type { RootTabParamList } from '../../navigation/TabNavigator';

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
  danger: '#E53935',
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type DashboardTabNav = BottomTabNavigationProp<RootTabParamList, 'Dashboard'>;

type Disponibilidade = {
  id: number;
  diaDaSemana: number;
  horaInicio: string;
  horaFim: string;
  professorId: number;
};

type Agendamento = {
  id: number;
  dataHora: string;
  status: number;
  alunoId: number;
  aluno?: {
    id: number;
    nome: string;
    email: string;
    cpf?: string;
    tipo?: number;
    descricao?: string;
  } | null;
  professorId: number;
  professor?: string | null;
  disciplinaId: number;
};

const diasSemanaLabels = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

function formatDataHora(iso: string | undefined | null): string {
  if (!iso) return 'Data/hora não informada';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Data/hora não informada';

  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0');
  const ano = d.getFullYear();
  const hora = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} às ${hora}:${min}`;
}

// Rótulo genérico de status (pro professor ver)
function getStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return 'Pendente';
    case 1:
      return 'Confirmado';
    case 2:
      return 'Concluído';
    case 3:
      return 'Cancelado';
    default:
      return `Status ${status}`;
  }
}

function getStatusColor(status: number): string {
  switch (status) {
    case 0:
      return colors.primary;
    case 1:
      return colors.secondary;
    case 2:
      return colors.mutedText;
    case 3:
      return colors.danger;
    default:
      return colors.mutedText;
  }
}

export function DashboardProfessor() {
  const navigation = useNavigation<DashboardTabNav>();

  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadDashboard(showRefreshSpinner = false) {
    try {
      if (showRefreshSpinner) {
        setLoadingRefresh(true);
      } else {
        setLoading(true);
      }
      setErrorMessage(null);

      const token = await AsyncStorage.getItem('@sabermais_token');
      const professorIdStr = await AsyncStorage.getItem('@sabermais_professorId');

      if (!token || !professorIdStr) {
        setErrorMessage(
          'Não encontrei sua sessão de professor. Faça login novamente.',
        );
        setDisponibilidades([]);
        setAgendamentos([]);
        return;
      }

      const professorId = Number(professorIdStr);

      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Busca disponibilidades e agendamentos em paralelo
      const [respDisp, respAg] = await Promise.all([
        fetch(`${API_BASE}/api/Disponibilidades`, {
          method: 'GET',
          headers,
        }),
        fetch(`${API_BASE}/api/Agendamentos`, {
          method: 'GET',
          headers,
        }),
      ]);

      // --- Disponibilidades ---
      if (!respDisp.ok) {
        const text = await respDisp.text();
        console.error(
          '[DashboardProfessor] Erro ao buscar disponibilidades:',
          text,
        );
        setErrorMessage(
          `Não foi possível carregar suas disponibilidades (HTTP ${respDisp.status}).`,
        );
        setDisponibilidades([]);
      } else {
        const dataDispJson = await respDisp.json();
        const dataDisp: Disponibilidade[] = Array.isArray(dataDispJson)
          ? dataDispJson
          : [];
        const minhas = dataDisp.filter((d) => d.professorId === professorId);
        setDisponibilidades(minhas);
      }

      // --- Agendamentos ---
      if (!respAg.ok) {
        const text = await respAg.text();
        console.error(
          '[DashboardProfessor] Erro ao buscar agendamentos:',
          text,
        );
        setErrorMessage((prev) =>
          prev
            ? prev +
              ` Também não foi possível carregar seus agendamentos (HTTP ${respAg.status}).`
            : `Não foi possível carregar seus agendamentos (HTTP ${respAg.status}).`,
        );
        setAgendamentos([]);
      } else {
        const dataAgJson = await respAg.json();

        const dataAg: Agendamento[] = Array.isArray(dataAgJson)
          ? dataAgJson
          : [];

        const meusAgendamentos = dataAg.filter(
          (ag) => ag.professorId === professorId,
        );

        setAgendamentos(meusAgendamentos);
      }
    } catch (err: any) {
      console.error('[DashboardProfessor] Erro inesperado:', err);
      setErrorMessage(
        'Ocorreu um erro ao carregar sua agenda. Verifique sua conexão e tente novamente.',
      );
      setDisponibilidades([]);
      setAgendamentos([]);
    } finally {
      setLoading(false);
      setLoadingRefresh(false);
    }
  }

  useEffect(() => {
    loadDashboard(false);
  }, []);

  async function handleAtualizarStatus(agendamento: Agendamento, novoStatus: number) {
    try {
      setUpdatingId(agendamento.id);

      const token = await AsyncStorage.getItem('@sabermais_token');
      if (!token) {
        Alert.alert(
          'Sessão expirada',
          'Faça login novamente para atualizar o agendamento.',
        );
        return;
      }

      // Payload mínimo, compatível com o POST /api/Agendamentos
      const payload = {
        id: agendamento.id,
        dataHora: agendamento.dataHora,
        status: novoStatus,
        alunoId: agendamento.alunoId,
        professorId: agendamento.professorId,
        disciplinaId: agendamento.disciplinaId,
      };

      const resp = await fetch(
        `${API_BASE}/api/Agendamentos/${agendamento.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!resp.ok) {
        const text = await resp.text();
        console.error(
          '[DashboardProfessor] Erro ao atualizar status de agendamento:',
          text,
        );
        Alert.alert(
          'Erro ao atualizar',
          `Não foi possível atualizar o agendamento (HTTP ${resp.status}).`,
        );
        return;
      }

      // Atualiza em memória
      setAgendamentos((prev) =>
        prev.map((ag) =>
          ag.id === agendamento.id ? { ...ag, status: novoStatus } : ag,
        ),
      );
    } catch (err: any) {
      console.error('[DashboardProfessor] Erro inesperado ao atualizar status:', err);
      Alert.alert(
        'Erro inesperado',
        'Ocorreu um erro ao atualizar o agendamento. Tente novamente em instantes.',
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleAdicionarDisponibilidade() {
    navigation.navigate('Perfil', { screen: 'Disponibilidade' } as any);
  }

  function handleIrParaLogin() {
    navigation.navigate('Perfil');
  }

  const isLoadingInitial = loading && !loadingRefresh;

  const agendamentosOrdenados = useMemo(() => {
    if (!agendamentos || agendamentos.length === 0) return [];
    return [...agendamentos].sort(
      (a, b) =>
        new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
    );
  }, [agendamentos]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Dashboard do Professor</Text>

        <Text style={styles.subtitle}>
          Acompanhe seus horários disponíveis e organize sua agenda de aulas.
        </Text>

        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={handleIrParaLogin}
            >
              <Text style={styles.errorButtonText}>Fazer login novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Disponibilidades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Disponibilidades</Text>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => loadDashboard(true)}
              disabled={loadingRefresh}
            >
              <Text style={styles.refreshText}>
                {loadingRefresh ? 'Atualizando…' : 'Atualizar'}
              </Text>
            </TouchableOpacity>
          </View>

          {isLoadingInitial ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={colors.secondary} />
              <Text style={styles.loadingText}>
                Carregando suas disponibilidades…
              </Text>
            </View>
          ) : disponibilidades.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Você ainda não cadastrou nenhum horário disponível.
              </Text>
              <Text style={styles.emptyHint}>
                Use o botão abaixo para adicionar seus primeiros horários.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {disponibilidades.map((disp) => {
                const labelDia =
                  diasSemanaLabels[disp.diaDaSemana] ??
                  `Dia ${disp.diaDaSemana}`;
                return (
                  <View key={disp.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{labelDia}</Text>
                    <Text style={styles.cardTime}>
                      {disp.horaInicio} - {disp.horaFim}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Os alunos conseguem ver esses horários na busca.
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdicionarDisponibilidade}
            activeOpacity={0.9}
          >
            <Text style={styles.addButtonText}>Adicionar disponibilidade</Text>
          </TouchableOpacity>
        </View>

        {/* Agendamentos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agendamentos</Text>
          </View>

          {isLoadingInitial ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={colors.secondary} />
              <Text style={styles.loadingText}>
                Carregando seus agendamentos…
              </Text>
            </View>
          ) : agendamentosOrdenados.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Você ainda não possui aulas agendadas.
              </Text>
              <Text style={styles.emptyHint}>
                Quando os alunos pedirem aulas pelo app, elas aparecerão aqui.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {agendamentosOrdenados.map((ag) => {
                const nomeAluno = ag.aluno?.nome || `Aluno #${ag.alunoId}`;
                const dataHoraFormatada = formatDataHora(ag.dataHora);
                const statusLabel = getStatusLabel(ag.status);
                const statusColor = getStatusColor(ag.status);
                const isUpdating = updatingId === ag.id;

                return (
                  <View key={ag.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{nomeAluno}</Text>
                    <Text style={styles.cardTime}>{dataHoraFormatada}</Text>
                    <Text style={[styles.cardStatus, { color: statusColor }]}>
                      {statusLabel}
                    </Text>

                    {/* Ações apenas quando está pendente */}
                    {ag.status === 0 && (
                      <View style={styles.actionsRow}>
                        <TouchableOpacity
                          style={[
                            styles.smallButton,
                            styles.acceptButton,
                            isUpdating && styles.smallButtonDisabled,
                          ]}
                          disabled={isUpdating}
                          onPress={() =>
                            handleAtualizarStatus(ag, 1) // 1 = Confirmado
                          }
                        >
                          {isUpdating ? (
                            <ActivityIndicator size="small" color={colors.white} />
                          ) : (
                            <Text style={styles.smallButtonText}>Aceitar</Text>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.smallButton,
                            styles.rejectButton,
                            isUpdating && styles.smallButtonDisabled,
                          ]}
                          disabled={isUpdating}
                          onPress={() =>
                            handleAtualizarStatus(ag, 3) // 3 = Cancelado
                          }
                        >
                          {isUpdating ? (
                            <ActivityIndicator size="small" color={colors.white} />
                          ) : (
                            <Text style={styles.smallButtonText}>Recusar</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    fontWeight: '600',
    color: colors.text,
  },
  refreshButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  refreshText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.secondary,
    fontWeight: '600',
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
  list: {
    marginTop: 4,
    gap: 8,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 10,
    backgroundColor: colors.white,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: fonts.title,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.secondary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
  cardStatus: {
    fontSize: 12,
    fontFamily: fonts.text,
    marginTop: 4,
  },
  emptyBox: {
    paddingVertical: 8,
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
  addButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
  errorBox: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.danger,
    marginBottom: 8,
  },
  errorButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  errorButtonText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.secondary,
  },
  rejectButton: {
    backgroundColor: colors.danger,
  },
  smallButtonDisabled: {
    opacity: 0.7,
  },
  smallButtonText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
});
