import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';
export const OrdersScreen = () => {
  const { orders } = useApp();
  return <SafeAreaView edges={['top']} style={ui.screen}>
    <FlatList data={orders} keyExtractor={(item) => String(item.id)} contentContainerStyle={ui.content}
      ListHeaderComponent={<View style={{ gap: 8, marginBottom: 20 }}><Text style={ui.title}>Meus pedidos</Text><Text style={ui.subtitle}>Acompanhe suas compras por aqui.</Text></View>}
      renderItem={({ item }) => <View style={[ui.card, { marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={ui.label}>Pedido #{item.id}</Text><Ionicons name="checkmark-circle" size={25} color="#22835C" /></View>
        <Text style={{ color: '#22835C', fontWeight: '700' }}>Confirmado</Text>
        <Text style={ui.subtitle}>{item.items_count} {item.items_count === 1 ? 'item' : 'itens'} · {new Date(item.created_at).toLocaleString('pt-BR')}</Text>
        <Text style={ui.title}>{item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
        {item.latitude != null && item.longitude != null && <Text style={ui.subtitle}>Localização: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</Text>}
      </View>}
      ListEmptyComponent={<View style={[ui.card, { alignItems: 'center' }]}><Ionicons name="receipt-outline" size={48} color={colors.muted} /><Text style={ui.label}>Suas compras aparecerão aqui</Text><Text style={ui.subtitle}>Encontre seu primeiro favorito na loja.</Text></View>}
    />
  </SafeAreaView>;
};
