// src/screens/student/CadastrarAluno.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const colors = {
  primary: '#F2C016', // cor-primaria
  secondary: '#1B8EF2',
  text: '#37474F',
  subtitle: '#607D8B',
  borderSoft: '#ECEFF1',
  background: '#F7F9F9',
  inputBorder: '#B0BEC5',
  danger: '#E53935',
  white: '#FFFFFF',
};

export function CadastrarAluno() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // quais campos estão com erro (para borda vermelha)
  const [fieldErrors, setFieldErrors] = useState({
    nome: false,
    email: false,
    cpf: false,
    senha: false,
    confirmarSenha: false,
  });

  function irParaLogin() {
    navigation.navigate('Login'); // mesma tela de Login.tsx
  }

  function limparCpf(value: string) {
    return value.replace(/\D/g, '');
  }

  function resetFieldErrors() {
    setFieldErrors({
      nome: false,
      email: false,
      cpf: false,
      senha: false,
      confirmarSenha: false,
    });
  }

  function validarCampos(): boolean {
    resetFieldErrors();
    setErro(null);

    // Nome
    if (!nome.trim()) {
      setErro('Informe o nome completo.');
      setFieldErrors(prev => ({ ...prev, nome: true }));
      return false;
    }

    // E-mail
    if (!email.trim()) {
      setErro('Informe o e-mail.');
      setFieldErrors(prev => ({ ...prev, email: true }));
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErro('Informe um e-mail válido.');
      setFieldErrors(prev => ({ ...prev, email: true }));
      return false;
    }

    // CPF
    const cpfLimpo = limparCpf(cpf);
    if (!cpfLimpo) {
      setErro('Informe o CPF.');
      setFieldErrors(prev => ({ ...prev, cpf: true }));
      return false;
    }
    if (cpfLimpo.length !== 11) {
      setErro('CPF deve ter 11 dígitos numéricos.');
      setFieldErrors(prev => ({ ...prev, cpf: true }));
      return false;
    }

    // Senha
    if (!senha.trim()) {
      setErro('Informe a senha.');
      setFieldErrors(prev => ({ ...prev, senha: true }));
      return false;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      setFieldErrors(prev => ({ ...prev, senha: true }));
      return false;
    }

    // Confirmar senha
    if (senha !== confirmarSenha) {
      setErro('A confirmação de senha não confere.');
      setFieldErrors(prev => ({ ...prev, confirmarSenha: true }));
      return false;
    }

    return true;
  }

  async function handleProximo() {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);
    setErro(null);

    const cpfLimpo = limparCpf(cpf);

    try {
      const response = await fetch(
        'https://chivalrous-maidenish-bertha.ngrok-free.dev/api/Alunos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Se no futuro a API exigir auth:
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: 0,
            nome: nome.trim(),
            email: email.trim(),
            password: senha,
            cpf: cpfLimpo,
            tipo: 0,
            descricao: 'Aluno cadastrado pelo app Saber+.',
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msgApi =
          data && (data.message || data.erro || data.error || data.title);
        setErro(msgApi || 'Erro ao cadastrar aluno. Tente novamente.');
        return;
      }

      // SUCESSO → mensagem + navegação para Login
      Alert.alert(
        'Cadastro feito!',
        'Cadastro feito! Faça login agora.',
        [
          {
            text: 'Ir para Login',
            onPress: () => navigation.navigate('Login'),
          },
          { text: 'OK' },
        ],
      );

      // limpa campos
      setNome('');
      setEmail('');
      setCpf('');
      setSenha('');
      setConfirmarSenha('');
      resetFieldErrors();
    } catch (e) {
      console.error('Erro ao cadastrar aluno:', e);
      setErro('Não foi possível conectar ao servidor. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cadastro de Aluno</Text>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Já possui uma conta? </Text>
        <TouchableOpacity onPress={irParaLogin}>
          <Text style={styles.loginLink}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.stepText}>Etapa 1 de 2</Text>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      <Text style={styles.label}>Nome completo *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.nome && { borderColor: colors.danger },
        ]}
        placeholder="Seu nome completo"
        placeholderTextColor="#90A4AE"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>E-mail *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.email && { borderColor: colors.danger },
        ]}
        placeholder="Seu e-mail"
        placeholderTextColor="#90A4AE"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>CPF *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.cpf && { borderColor: colors.danger },
        ]}
        placeholder="Somente números"
        placeholderTextColor="#90A4AE"
        keyboardType="numeric"
        maxLength={14}
        value={cpf}
        onChangeText={setCpf}
      />

      <Text style={styles.label}>Senha *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.senha && { borderColor: colors.danger },
        ]}
        placeholder="Sua senha"
        placeholderTextColor="#90A4AE"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text style={styles.label}>Confirmar senha *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.confirmarSenha && { borderColor: colors.danger },
        ]}
        placeholder="Repita a senha"
        placeholderTextColor="#90A4AE"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

      {erro && <Text style={styles.errorText}>{erro}</Text>}

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.7 }]}
        onPress={handleProximo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.submitText}>Próximo</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.subtitle,
  },
  loginLink: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepText: {
    fontSize: 12,
    color: colors.subtitle,
    marginBottom: 4,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.borderSoft,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    width: '50%',
    backgroundColor: colors.secondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    fontSize: 14,
    marginBottom: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
