import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme';
/** @type {Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]>} */
const icons = { index: ['storefront', 'storefront-outline'], cart: ['cart', 'cart-outline'], orders: ['receipt', 'receipt-outline'], profile: ['person-circle', 'person-circle-outline'] };
export default function ShopLayout() {
  const { user, restoringSession, cart } = useApp();
  if (restoringSession) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (!user) return <Redirect href="/login" />;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontWeight: '700' }, tabBarStyle: { backgroundColor: '#FFF', borderTopColor: colors.border }, tabBarIcon: ({ color, size, focused }) => <Ionicons name={icons[route.name][focused ? 0 : 1]} size={size} color={color} /> })}>
    <Tabs.Screen name="index" options={{ title: 'Loja' }} /><Tabs.Screen name="cart" options={{ title: 'Carrinho', tabBarBadge: count || undefined, tabBarBadgeStyle: { backgroundColor: colors.primary } }} /><Tabs.Screen name="orders" options={{ title: 'Pedidos' }} /><Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
  </Tabs>;
}
