import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';
export const LocationCard = () => {
  const { location, refreshLocation, loadingLocation } = useApp();
  return <View style={ui.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Ionicons name="location-outline" size={24} color={colors.primary} /><Text style={ui.label}>Sua localização</Text></View>
    <Text style={ui.subtitle}>{location?.address || (location ? 'Localização encontrada' : 'Use sua localização para conferir onde você está.')}</Text>
    {location && <Text selectable style={ui.subtitle}>Latitude: {location.latitude.toFixed(5)}{ '\n' }Longitude: {location.longitude.toFixed(5)}</Text>}
    <TouchableOpacity accessibilityRole="button" style={ui.secondary} onPress={refreshLocation} disabled={loadingLocation}>
      {loadingLocation ? <ActivityIndicator color={colors.primary} /> : <Ionicons name="navigate-outline" color={colors.primary} size={20} />}
      <Text style={ui.secondaryText}>{loadingLocation ? 'Buscando localização…' : location ? 'Atualizar localização' : 'Usar minha localização'}</Text>
    </TouchableOpacity>
  </View>;
};
