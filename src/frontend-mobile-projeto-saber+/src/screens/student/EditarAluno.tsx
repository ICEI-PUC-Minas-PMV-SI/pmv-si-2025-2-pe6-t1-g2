// src/screens/student/EditarAluno.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
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
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type Nav = NativeStackNavigationProp<PerfilStackParamList, 'EditarAluno'>;

export function EditarAluno() {
  const navigation = useNavigation<Nav>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [descricao, setDescricao] = useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem('@sabermais_token');
        const alunoId = await AsyncStorage.getItem('@sabermais_alunoId');

        if (!token || !alunoId) {
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

        const response = await fetch(`${API_BASE}/api/Alunos/${alunoId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('[EditarAluno] Erro no GET /Alunos/{id}:', text);
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
        console.error('[EditarAluno] Erro inesperado ao carregar:', err);
        Alert.alert(
          'Erro',
          'Ocorreu um erro inesperado ao carregar os dados. Verifique sua conexão.',
        );
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [navigation]);

  function validarCampos() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome completo.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe o e-mail.');
      return false;
    }
    if (!cpf.trim()) {
      Alert.alert('Atenção', 'Informe o CPF.');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Atenção', 'Informe sua senha para confirmar as alterações.');
      return false;
    }
    return true;
  }

  async function handleSalvar() {
    if (!validarCampos()) return;

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem('@sabermais_token');
      const alunoId = await AsyncStorage.getItem('@sabermais_alunoId');

      if (!token || !alunoId) {
        Alert.alert(
          'Sessão expirada',
          'Não foi possível identificar o aluno logado. Faça login novamente.',
        );
        return;
      }

      const body = {
        id: Number(alunoId),
        nome: nome.trim(),
        email: email.trim(),
        password: password, // obrigatório pro PUT
        cpf: cpf.trim(),
        tipo: 0, // 0 = aluno
        descricao: descricao.trim(),
      };

      const response = await fetch(`${API_BASE}/api/Alunos/${alunoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('[EditarAluno] Erro no PUT /Alunos/{id}:', text);
        Alert.alert(
          'Erro',
          `Não foi possível salvar as alterações (HTTP ${response.status}).`,
        );
        return;
      }

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('[EditarAluno] Erro inesperado ao salvar:', err);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado ao salvar. Verifique sua conexão.',
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancelar() {
    navigation.goBack();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <SaberHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Editar perfil do aluno</Text>

        {/* Nome */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome completo *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
            placeholderTextColor="#B0BEC5"
          />
        </View>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail"
            placeholderTextColor="#B0BEC5"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* CPF */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>CPF *</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={setCpf}
            placeholder="Seu CPF"
            placeholderTextColor="#B0BEC5"
          />
        </View>

        {/* Senha */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha *</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha (para confirmar)"
              placeholderTextColor="#B0BEC5"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Text style={styles.eyeText}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Fale um pouco sobre você, suas matérias de interesse, etc."
            placeholderTextColor="#B0BEC5"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botões */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelar}
            disabled={saving}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              saving && styles.buttonDisabled,
            ]}
            onPress={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Salvar alterações</Text>
            )}
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
  title: {
    fontSize: 20,
    fontFamily: fonts.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
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
  multilineInput: {
    minHeight: 80,
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.secondary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
});

