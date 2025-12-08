// src/screens/Login.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SaberHeader } from '../components/SaberHeader';
import type { PerfilStackParamList } from '../navigation/PerfilStack';

const API_BASE = 'https://chivalrous-maidenish-bertha.ngrok-free.dev';

const colors = {
  primary: '#F2C016', // cor-primaria
  secondary: '#1B8EF2', // cor-secundaria
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

type LoginNav = NativeStackNavigationProp<PerfilStackParamList, 'Login'>;

export function Login() {
  const navigation = useNavigation<LoginNav>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validateFields() {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Preencha e-mail e senha para continuar.');
      return false;
    }
    if (!email.includes('@')) {
      setErrorMessage('Digite um e-mail válido.');
      return false;
    }
    return true;
  }

  async function handleLogin() {
    if (!validateFields()) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      // 1) Autenticar e pegar o token
      const authResponse = await fetch(`${API_BASE}/api/Usuarios/Authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      if (!authResponse.ok) {
        const text = await authResponse.text();
        console.error('[Login] Erro no Authenticate:', text);
        if (authResponse.status === 401) {
          setErrorMessage('E-mail ou senha inválidos.');
        } else {
          setErrorMessage(
            `Não foi possível autenticar agora (HTTP ${authResponse.status}). Tente novamente.`,
          );
        }
        return;
      }

      const authData: { jwtToken: string } = await authResponse.json();
      const jwtToken = authData.jwtToken;

      // 2) Descobrir quem é o usuário logado
      const meResponse = await fetch(`${API_BASE}/api/Usuarios/me`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!meResponse.ok) {
        const text = await meResponse.text();
        console.error('[Login] Erro no /me:', text);
        setErrorMessage(
          `Não consegui identificar o usuário logado (HTTP ${meResponse.status}).`,
        );
        return;
      }

      const meData: { id: number; nome: string; email: string } =
        await meResponse.json();

      // 3) Buscar detalhes do usuário (tipo = professor/aluno)
      const userDetailsResponse = await fetch(
        `${API_BASE}/api/Usuarios/${meData.id}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );

      if (!userDetailsResponse.ok) {
        const text = await userDetailsResponse.text();
        console.error('[Login] Erro no /Usuarios/{id}:', text);
        setErrorMessage(
          `Não foi possível carregar os detalhes do usuário (HTTP ${userDetailsResponse.status}).`,
        );
        return;
      }

      const userDetails: {
        id: number;
        nome: string;
        email: string;
        tipo: number;
      } = await userDetailsResponse.json();

      const tipo = userDetails.tipo;

      // 4) Guardar sessão no AsyncStorage
      await AsyncStorage.multiSet([
        ['@sabermais_token', jwtToken],
        ['@sabermais_userId', String(userDetails.id)],
        ['@sabermais_userType', String(tipo)],
      ]);

      // Se o id do usuário for o mesmo id de Professor/Aluno,
      // já deixamos salvo para as telas de perfil usarem:
      if (tipo === 1) {
        await AsyncStorage.setItem(
          '@sabermais_professorId',
          String(userDetails.id),
        );
      } else if (tipo === 0) {
        await AsyncStorage.setItem(
          '@sabermais_alunoId',
          String(userDetails.id),
        );
      }

      // 5) Redirecionar de acordo com o tipo
      if (tipo === 1) {
        // Professor
        navigation.replace('PerfilProfessor');
      } else if (tipo === 0) {
        // Aluno
        navigation.replace('PerfilAluno');
      } else {
        console.warn('[Login] Tipo de usuário desconhecido:', tipo);
        setErrorMessage(
          'Seu tipo de usuário não foi reconhecido. Verifique com o administrador.',
        );
      }
    } catch (err: any) {
      console.error('[Login] Erro inesperado:', err);
      setErrorMessage(
        'Ocorreu um erro inesperado ao tentar fazer login. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoToCadastro() {
    navigation.navigate('Cadastro');
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
        <Text style={styles.title}>Entrar no perfil</Text>

        <View style={styles.inlineTextRow}>
          <Text style={styles.inlineText}>Não possui uma conta? </Text>
          <Text style={styles.linkText} onPress={handleGoToCadastro}>
            Criar cadastro
          </Text>
        </View>

        {/* E-mail */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#B0BEC5"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Senha */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha *</Text>

          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Sua senha"
              placeholderTextColor="#B0BEC5"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mensagem de erro */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Botão Entrar */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
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
    marginBottom: 12,
  },
  inlineTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  inlineText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
  },
  linkText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.secondary,
    fontWeight: '600',
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
    borderColor: colors.black,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.text,
    color: colors.text,
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
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: colors.danger,
  },
  button: {
    backgroundColor: colors.black,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.text,
    fontWeight: '600',
  },
});
