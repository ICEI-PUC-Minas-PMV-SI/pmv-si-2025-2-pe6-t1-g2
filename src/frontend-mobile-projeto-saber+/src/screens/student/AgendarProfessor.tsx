// src/screens/student/AgendarProfessor.tsx
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
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SaberHeader } from '../../components/SaberHeader';
import type { PerfilStackParamList } from '../../navigation/PerfilStack';

const API_BASE = 'https://chivalrous-maidenish-bertha.ngrok-free.dev';

const colors = {
  primary: '#F2C016',
  secondary: '#1B8EF2',
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

type AgendarRoute = RouteProp<PerfilStackParamList, 'AgendarProfessor'>;

type Professor = {
  id: number;
  nome: string;
  email: string;
  descricao?: string;
  competencias?: string[];
  valorHora?: number;
};

type Disponibilidade = {
  id: number;
  diaDaSemana: number;
  horaInicio: string;
  horaFim: string;
  professorId: number;
};

const diasSemana = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

function diaLabel(dia: number) {
  return diasSemana[dia] ?? `Dia ${dia}`;
}

export function AgendarProfessor() {
  const route = useRoute<AgendarRoute>();
  const { professorId, professorNome } = route.params;

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agendandoId, setAgendandoId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const token = await AsyncStorage.getItem('@sabermais_token');
      const alunoId = await AsyncStorage.getItem('@sabermais_alunoId');

      if (!token || !alunoId) {
        setErrorMessage(
          'É necessário estar logado como aluno para agendar uma aula.',
        );
        setLoading(false);
        return;
      }

      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // 1) Buscar dados do professor
      const profResp = await fetch(
        `${API_BASE}/api/Professores/${professorId}`,
        {
          method: 'GET',
          headers,
        },
      );

      if (!profResp.ok) {
        const text = await profResp.text();
        console.error('[AgendarProfessor] Erro ao buscar professor:', text);
        setErrorMessage(
          `Não foi possível carregar os dados do professor (HTTP ${profResp.status}).`,
        );
        setLoading(false);
        return;
      }

      const profData: Professor = await profResp.json();
      setProfessor(profData);

      // 2) Buscar disponibilidades e filtrar por professor
      const dispResp = await fetch(`${API_BASE}/api/Disponibilidades`, {
        method: 'GET',
        headers,
      });

      if (!dispResp.ok) {
        const text = await dispResp.text();
        console.error(
          '[AgendarProfessor] Erro ao buscar disponibilidades:',
          text,
        );
        setErrorMessage(
          `Não foi possível carregar disponibilidades (HTTP ${dispResp.status}).`,
        );
        setLoading(false);
        return;
      }

      const allDisps: Disponibilidade[] = await dispResp.json();
      const dispsDoProfessor = allDisps.filter(
        (d) => d.professorId === professorId,
      );

      setDisponibilidades(dispsDoProfessor);
    } catch (err: any) {
      console.error('[AgendarProfessor] Erro inesperado:', err);
      setErrorMessage(
        'Ocorreu um erro ao carregar os dados para agendamento. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAgendar(disp: Disponibilidade) {
    try {
      setAgendandoId(disp.id);
      setErrorMessage(null);

      const token = await AsyncStorage.getItem('@sabermais_token');
      const alunoIdStr = await AsyncStorage.getItem('@sabermais_alunoId');

      if (!token || !alunoIdStr) {
        Alert.alert(
          'Login necessário',
          'Faça login como aluno para agendar uma aula.',
        );
        return;
      }

      const alunoId = Number(alunoIdStr);

      // Montar dataHora aproximada usando hoje + horaInicio
      const now = new Date();
      const [hStr, mStr] = (disp.horaInicio || '00:00').split(':');
      const h = Number(hStr) || 0;
      const m = Number(mStr) || 0;
      now.setHours(h, m, 0, 0);
      const dataHoraISO = now.toISOString();

      // Payload compatível com POST /api/Agendamentos
      const payload = {
        dataHora: dataHoraISO,
        status: 0, // por ex.: 0 = Pendente
        alunoId: alunoId,
        professorId: professorId,
        disciplinaId: 0, // placeholder; depois pode virar disciplina escolhida
      };

      const resp = await fetch(`${API_BASE}/api/Agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('[AgendarProfessor] Erro ao criar agendamento:', text);
        Alert.alert(
          'Erro ao agendar',
          `Não foi possível criar o agendamento (HTTP ${resp.status}).`,
        );
        return;
      }

      Alert.alert(
        'Agendamento criado',
        'Seu pedido de aula foi registrado. Você poderá acompanhar na tela de Dashboard do aluno.',
      );
    } catch (err: any) {
      console.error('[AgendarProfessor] Erro inesperado ao agendar:', err);
      Alert.alert(
        'Erro inesperado',
        'Ocorreu um erro ao tentar agendar. Tente novamente em alguns instantes.',
      );
    } finally {
      setAgendandoId(null);
    }
  }

  const isLoading = loading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Agendar aula</Text>

        {professor ? (
          <Text style={styles.subtitle}>
            Você está agendando com{' '}
            <Text style={styles.profNameHighlight}>
              {professor.nome || professorNome}
            </Text>
            .
          </Text>
        ) : professorNome ? (
          <Text style={styles.subtitle}>
            Você está agendando com{' '}
            <Text style={styles.profNameHighlight}>{professorNome}</Text>.
          </Text>
        ) : (
          <Text style={styles.subtitle}>
            Carregando informações do professor…
          </Text>
        )}

        {/* Erro */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Loading */}
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.loadingText}>
              Carregando professor e disponibilidades…
            </Text>
          </View>
        ) : (
          <>
            {/* Bloco com resumo do professor */}
            {professor && (
              <View style={styles.profCard}>
                <Text style={styles.profCardName}>{professor.nome}</Text>

                {professor.valorHora !== undefined &&
                  professor.valorHora !== null && (
                    <Text style={styles.profCardValor}>
                      R$ {professor.valorHora.toFixed(2).replace('.', ',')} / hora
                    </Text>
                  )}

                {professor.descricao ? (
                  <Text style={styles.profCardDesc} numberOfLines={3}>
                    {professor.descricao}
                  </Text>
                ) : (
                  <Text style={styles.profCardDescMuted}>
                    Professor ainda não adicionou uma descrição detalhada.
                  </Text>
                )}

                {professor.competencias && professor.competencias.length > 0 && (
                  <View style={styles.chipsRow}>
                    {professor.competencias.map((comp, idx) => (
                      <View key={`prof-comp-${idx}`} style={styles.chip}>
                        <Text style={styles.chipText}>{comp}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Lista de disponibilidades */}
            <Text style={styles.sectionTitle}>Disponibilidades</Text>

            {disponibilidades.length === 0 ? (
              <Text style={styles.emptyText}>
                Este professor ainda não cadastrou disponibilidades para aula.
              </Text>
            ) : (
              <View style={styles.dispList}>
                {disponibilidades.map((disp) => (
                  <View key={disp.id} style={styles.dispCard}>
                    <View style={styles.dispInfoRow}>
                      <Text style={styles.dispDia}>
                        {diaLabel(disp.diaDaSemana)}
                      </Text>
                      <Text style={styles.dispHora}>
                        {disp.horaInicio} - {disp.horaFim}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.agendarButton,
                        agendandoId === disp.id && styles.agendarButtonDisabled,
                      ]}
                      onPress={() => handleAgendar(disp)}
                      disabled={agendandoId === disp.id}
                      activeOpacity={0.9}
                    >
                      {agendandoId === disp.id ? (
                        <ActivityIndicator color={colors.black} />
                      ) : (
                        <Text style={styles.agendarButtonText}>
                          Agendar nesse horário
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
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
    marginBottom: 16,
  },
  profNameHighlight: {
    color: colors.secondary,
    fontWeight: '700',
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
    color: colors.danger,
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
    textAlign: 'center',
  },
  profCard: {
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
    marginBottom: 20,
  },
  profCardName: {
    fontSize: 18,
    fontFamily: fonts.title,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profCardValor: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.secondary,
    marginBottom: 6,
  },
  profCardDesc: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.text,
    marginBottom: 8,
  },
  profCardDescMuted: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.mutedText,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.title,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.mutedText,
  },
  dispList: {
    gap: 10,
  },
  dispCard: {
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
  },
  dispInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dispDia: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    fontWeight: '600',
  },
  dispHora: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.secondary,
  },
  agendarButton: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  agendarButtonDisabled: {
    opacity: 0.7,
  },
  agendarButtonText: {
    fontSize: 14,
    fontFamily: fonts.text,
    fontWeight: '600',
    color: colors.black,
  },
});

