import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brand } from '../components/Brand';
import { LocationCard } from '../components/LocationCard';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';

export const ProfileScreen = () => {
  const { user, signOut } = useApp();
  const openSupport = async () => {
    try { await Linking.openURL('https://wa.me/5511999999999'); }
    catch { Alert.alert('Suporte indisponível', 'Não foi possível abrir o suporte.'); }
  };
  return <SafeAreaView edges={['top']} style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
    <Brand compact />
    <Text style={ui.title}>Meu perfil</Text>
    <View style={ui.card}>
      <Ionicons name="person-circle-outline" size={48} color={colors.primary} />
      <Text style={ui.title}>{user?.name}</Text><Text style={ui.subtitle}>{user?.email}</Text>
    </View>
    <LocationCard />
    <TouchableOpacity accessibilityRole="button" style={ui.secondary} onPress={() => router.push('/settings')}><Ionicons name="settings-outline" size={23} color={colors.ink} /><Text style={ui.secondaryText}>Configurações</Text><Ionicons name="chevron-forward" size={20} color={colors.muted} /></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" style={ui.secondary} onPress={openSupport}><Ionicons name="chatbubble-ellipses-outline" size={23} color={colors.ink} /><Text style={ui.secondaryText}>Falar com o suporte</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" style={ui.secondary} onPress={signOut}><Ionicons name="log-out-outline" size={23} color={colors.danger} /><Text style={[ui.secondaryText, { color: colors.danger }]}>Sair da conta</Text></TouchableOpacity>
  </ScrollView></SafeAreaView>;
};
