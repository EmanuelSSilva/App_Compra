import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';
export const SettingsScreen = () => {
  const { deviceInfo } = useApp();
  return <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
    <TouchableOpacity accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/profile')} style={[ui.secondary, { alignSelf: 'flex-start' }]}><Ionicons name="arrow-back" size={20} color={colors.ink} /><Text style={ui.secondaryText}>Voltar</Text></TouchableOpacity>
    <Text style={ui.title}>Configurações</Text>
    <View style={ui.card}><Ionicons name="phone-portrait-outline" size={32} color={colors.primary} /><Text style={ui.label}>Informações do dispositivo</Text>
      {Object.entries({ 'Sistema operacional': deviceInfo.osName, 'Versão': deviceInfo.osVersion, 'Marca': deviceInfo.brand, 'Modelo': deviceInfo.modelName, 'Tipo': deviceInfo.deviceType }).map(([label, value]) => <View key={label} style={{ gap: 3 }}><Text style={ui.subtitle}>{label}</Text><Text style={ui.label}>{value}</Text></View>)}
    </View>
    <Text style={ui.subtitle}>Compre Agora · Versão 1.0.0</Text>
  </ScrollView></SafeAreaView>;
};
