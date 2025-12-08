// src/screens/Index.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SaberHeader } from '../components/SaberHeader';
import type { RootStackParamList } from '../navigation/RootNavigator';

const colors = {
  primary: '#F2C016',   // cor-primaria
  secondary: '#1B8EF2', // cor-secundaria
  c1: '#1BA0F2',
  c2: '#38BDF2',
  c3: '#38D0F2',
  c4: '#F2A516',
  text: '#37474F',
  background: '#F7F9F9',
  borderSoft: '#ECEFF1',
  white: '#FFF',
};

const fonts = {
  title: 'Poppins',
  text: 'Lato',
};

type RootNav = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

export function Index() {
  const navigation = useNavigation<RootNav>();

  // Entrar/Cadastrar → abre MainTabs na aba Perfil (Login/Cadastro)
  const goToPerfil = () => {
    navigation.navigate('MainTabs', {
      screen: 'Perfil',
    });
    // Se quiser que não volte mais pra Index:
    // navigation.replace('MainTabs', { screen: 'Perfil' });
  };

  // Encontrar Professor → abre MainTabs na aba Buscar
  const goToBuscar = () => {
    navigation.navigate('MainTabs', {
      screen: 'Buscar',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SaberHeader />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero principal */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Encontre o Professor Perfeito
          </Text>

          <Text style={styles.heroText}>
            Explore milhares de especialistas em diversas áreas, prontos para
            oferecer aulas personalizadas e ajudar você a alcançar seus
            objetivos. Encontre o professor particular ideal de forma simples,
            rápida e segura.
          </Text>

          <TouchableOpacity
            style={[styles.primaryButton, styles.shadow]}
            activeOpacity={0.9}
            onPress={goToBuscar} // Encontrar Professor → Buscar
          >
            <Text style={styles.primaryButtonText}>
              Encontrar Professor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, styles.shadow]}
            activeOpacity={0.9}
            onPress={goToPerfil} // Entrar/Cadastrar → Perfil/Login
          >
            <Text style={styles.secondaryButtonText}>Entrar/Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Seção "Como funciona" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Funciona?</Text>
          <Text style={styles.sectionSubtitle}>
            Em apenas 3 passos simples, você encontra e agenda sua aula ideal
          </Text>
        </View>

        {/* Passo 1 */}
        <View style={[styles.stepCard, styles.shadow]}>
          <View style={styles.stepBubble}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Busque e Descubra</Text>
          <Text style={styles.stepText}>
            Utilize nossa busca para encontrar especialistas na área que você
            deseja. Filtre por preço, modalidade (online ou presencial),
            avaliações e disponibilidade para achar o perfil perfeito.
          </Text>
        </View>

        {/* Passo 2 */}
        <View style={[styles.stepCard, styles.shadow]}>
          <View style={styles.stepBubble}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Agende com Facilidade</Text>
          <Text style={styles.stepText}>
            Encontrou o professor ideal? Verifique a agenda de horários
            disponíveis e envie uma solicitação de aula com apenas alguns
            cliques. A comunicação é direta e segura dentro da plataforma.
          </Text>
        </View>

        {/* Passo 3 */}
        <View style={[styles.stepCard, styles.shadow]}>
          <View style={styles.stepBubble}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepTitle}>Aprenda e Evolua</Text>
          <Text style={styles.stepText}>
            Realize sua aula e dê o próximo passo na sua jornada de
            conhecimento. Ao final, não se esqueça de avaliar a experiência para
            fortalecer nossa comunidade e ajudar outros alunos!
          </Text>
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
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },

  hero: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: fonts.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroText: {
    fontSize: 14,
    fontFamily: fonts.text,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: fonts.text,
  },

  secondaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 4,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.text,
  },

  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fonts.title,
    color: colors.text,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#607D8B',
    textAlign: 'center',
    marginTop: 4,
  },

  stepCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 16,
  },
  stepBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 13,
    fontFamily: fonts.text,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 20,
  },

  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});
