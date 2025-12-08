// src/screens/teachers/Disponibilidade.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SaberHeader } from '../../components/SaberHeader';

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

const diasSemana = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export function Disponibilidade() {
  const [diaDaSemana, setDiaDaSemana] = useState<number | null>(null);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validateFields() {
    if (diaDaSemana === null) {
      setErrorMessage('Selecione o dia da semana.');
      return false;
    }
    if (!horaInicio.trim() || !horaFim.trim()) {
      setErrorMessage('Informe o horário de início e fim.');
      return false;
    }

    // Validação simples de HH:MM
    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHora.test(horaInicio.trim()) || !regexHora.test(horaFim.trim())) {
      setErrorMessage('Use o formato HH:MM para os horários.');
      return false;
    }

    return true;
  }

  async function handleSalvar() {
    if (!validateFields()) return;

    try {
      setSaving(true);
      setErrorMessage(null);

      const token = await AsyncStorage.getItem('@sabermais_token');
      const professorIdStr = await AsyncStorage.getItem(
        '@sabermais_professorId',
      );

      if (!token || !professorIdStr) {
        Alert.alert(
          'Login necessário',
          'É preciso estar logado como professor para registrar disponibilidades.',
        );
        return;
      }

      const professorId = Number(professorIdStr);

      const payload = {
        diaDaSemana: diaDaSemana!,
        horaInicio: horaInicio.trim(),
        horaFim: horaFim.trim(),
        professorId: professorId,
      };

      const resp = await fetch(`${API_BASE}/api/Disponibilidades`, {
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
        console.error('[Disponibilidade] Erro ao criar disponibilidade:', text);
        Alert.alert(
          'Erro ao salvar',
          `Não foi possível registrar a disponibilidade (HTTP ${resp.status}).`,
        );
        return;
      }

      Alert.alert(
        'Disponibilidade registrada',
        'Sua disponibilidade foi salva e poderá ser vista pelos alunos na busca.',
      );

      // Limpa o formulário
      setHoraInicio('');
      setHoraFim('');
      setDiaDaSemana(null);
    } catch (err: any) {
      console.error('[Disponibilidade] Erro inesperado:', err);
      Alert.alert(
        'Erro inesperado',
        'Ocorreu um erro ao salvar a disponibilidade. Tente novamente em alguns instantes.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Nova disponibilidade</Text>

        <Text style={styles.subtitle}>
          Defina um dia da semana e um intervalo de horário em que você pode
          atender alunos.
        </Text>

        {/* Erro */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Dia da semana */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Dia da semana*</Text>

          <View style={styles.weekRow}>
            {diasSemana.map((dia) => {
              const selected = diaDaSemana === dia.value;
              return (
                <TouchableOpacity
                  key={dia.value}
                  style={[
                    styles.weekChip,
                    selected && styles.weekChipSelected,
                  ]}
                  onPress={() => setDiaDaSemana(dia.value)}
                >
                  <Text
                    style={[
                      styles.weekChipText,
                      selected && styles.weekChipTextSelected,
                    ]}
                  >
                    {dia.label.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Hora início */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Hora de início (HH:MM)*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 14:00"
            placeholderTextColor="#B0BEC5"
            keyboardType="numeric"
            value={horaInicio}
            onChangeText={setHoraInicio}
            maxLength={5}
          />
        </View>

        {/* Hora fim */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Hora de término (HH:MM)*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 15:30"
            placeholderTextColor="#B0BEC5"
            keyboardType="numeric"
            value={horaFim}
            onChangeText={setHoraFim}
            maxLength={5}
          />
        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSalvar}
          disabled={saving}
          activeOpacity={0.9}
        >
          {saving ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.buttonText}>Salvar disponibilidade</Text>
          )}
        </TouchableOpacity>
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
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  weekChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ECEFF1',
  },
  weekChipSelected: {
    backgroundColor: colors.secondary,
  },
  weekChipText: {
    fontSize: 12,
    fontFamily: fonts.text,
    color: colors.text,
  },
  weekChipTextSelected: {
    color: colors.white,
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
    color: colors.danger,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fonts.text,
    fontWeight: '600',
    color: colors.black,
  },
});
