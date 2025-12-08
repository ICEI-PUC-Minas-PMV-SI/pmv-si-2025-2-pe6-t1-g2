// src/screens/teachers/CadastrarProfessor.tsx
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

export function CadastrarProfessor() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [descricao, setDescricao] = useState('');
  const [certificacoes, setCertificacoes] = useState('');
  const [competencias, setCompetencias] = useState('');
  const [valorHora, setValorHora] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState({
    nome: false,
    email: false,
    cpf: false,
    senha: false,
    confirmarSenha: false,
    descricao: false,
    valorHora: false,
  });

  function irParaLogin() {
    navigation.navigate('Login');
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
      descricao: false,
      valorHora: false,
    });
  }

  function validarCampos(): boolean {
    resetFieldErrors();
    setErro(null);

    if (!nome.trim()) {
      setErro('Informe o nome completo.');
      setFieldErrors(prev => ({ ...prev, nome: true }));
      return false;
    }

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

    if (senha !== confirmarSenha) {
      setErro('A confirmação de senha não confere.');
      setFieldErrors(prev => ({ ...prev, confirmarSenha: true }));
      return false;
    }

    if (!descricao.trim()) {
      setErro('Faça uma breve descrição sobre você como instrutor.');
      setFieldErrors(prev => ({ ...prev, descricao: true }));
      return false;
    }

    if (!valorHora.trim()) {
      setErro('Informe o valor da hora de aula.');
      setFieldErrors(prev => ({ ...prev, valorHora: true }));
      return false;
    }
    const valorNumber = Number(valorHora.replace(',', '.'));
    if (isNaN(valorNumber) || valorNumber <= 0) {
      setErro('Informe um valor de hora válido (ex: 80).');
      setFieldErrors(prev => ({ ...prev, valorHora: true }));
      return false;
    }

    return true;
  }

  async function handleCadastrar() {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);
    setErro(null);

    const cpfLimpo = limparCpf(cpf);
    const valorNumber = Number(valorHora.replace(',', '.'));

    try {
      const response = await fetch(
        'https://chivalrous-maidenish-bertha.ngrok-free.dev/api/Professores',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Quando estiver usando auth:
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: 0,
            nome: nome.trim(),
            email: email.trim(),
            password: senha,
            cpf: cpfLimpo,
            tipo: 0,
            descricao: descricao.trim(),
            certificacoes: certificacoes
              ? certificacoes.split(',').map(c => c.trim()).filter(Boolean)
              : [],
            competencias: competencias
              ? competencias.split(',').map(c => c.trim()).filter(Boolean)
              : [],
            valorHora: valorNumber,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msgApi =
          data && (data.message || data.erro || data.error || data.title);
        setErro(msgApi || 'Erro ao cadastrar professor. Tente novamente.');
        return;
      }

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

      setNome('');
      setEmail('');
      setCpf('');
      setSenha('');
      setConfirmarSenha('');
      setDescricao('');
      setCertificacoes('');
      setCompetencias('');
      setValorHora('');
      resetFieldErrors();
    } catch (e) {
      console.error('Erro ao cadastrar professor:', e);
      setErro('Não foi possível conectar ao servidor. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cadastro de Professor</Text>

      {/* Já possui conta? Entrar */}
      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Já possui uma conta? </Text>
        <TouchableOpacity onPress={irParaLogin}>
          <Text style={styles.loginLink}>Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* Etapa / barra de progresso (visual) */}
      <View style={styles.progressContainer}>
        <Text style={styles.stepText}>Etapa 1 de 2</Text>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
      </View>

      {/* Nome */}
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

      {/* E-mail */}
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

      {/* CPF */}
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

      {/* Senha */}
      <Text style={styles.label}>Senha *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.senha && { borderColor: colors.danger },
        ]}
        placeholder="Crie uma senha"
        placeholderTextColor="#90A4AE"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Confirmar senha */}
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

      {/* Descrição */}
      <Text style={styles.label}>Breve descrição *</Text>
      <TextInput
        style={[
          styles.inputMultiline,
          fieldErrors.descricao && { borderColor: colors.danger },
        ]}
        placeholder="Conte um pouco sobre sua experiência como professor(a)."
        placeholderTextColor="#90A4AE"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Certificações */}
      <Text style={styles.label}>Certificações (opcional)</Text>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Ex: Licenciatura em Matemática, Pós em Educação..."
        placeholderTextColor="#90A4AE"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        value={certificacoes}
        onChangeText={setCertificacoes}
      />

      {/* Competências */}
      <Text style={styles.label}>Competências (opcional)</Text>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Ex: Reforço escolar, ENEM, concursos públicos..."
        placeholderTextColor="#90A4AE"
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        value={competencias}
        onChangeText={setCompetencias}
      />

      {/* Valor hora */}
      <Text style={styles.label}>Valor da hora de aula (R$/h) *</Text>
      <TextInput
        style={[
          styles.input,
          fieldErrors.valorHora && { borderColor: colors.danger },
        ]}
        placeholder="Ex: 80"
        placeholderTextColor="#90A4AE"
        keyboardType="decimal-pad"
        value={valorHora}
        onChangeText={setValorHora}
      />

      {erro && <Text style={styles.errorText}>{erro}</Text>}

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.7 }]}
        onPress={handleCadastrar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.submitText}>Concluir cadastro</Text>
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
  inputMultiline: {
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
