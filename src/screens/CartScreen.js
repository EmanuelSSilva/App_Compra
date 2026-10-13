import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartItemRow } from '../components/CartItemRow';
import { LocationCard } from '../components/LocationCard';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';

export const CartScreen = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, checkout, checkingOut, location } = useApp();
  const [reviewing, setReviewing] = useState(false);
  const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const cancel = () => Alert.alert('Cancelar pedido?', 'Os produtos serão removidos do carrinho.', [
    { text: 'Continuar comprando', style: 'cancel' },
    { text: 'Cancelar pedido', style: 'destructive', onPress: () => { clearCart(); setReviewing(false); } },
  ]);
  const confirm = async () => {
    if (checkingOut) return;
    try { await checkout(); setReviewing(false); } catch { Alert.alert('Não foi possível finalizar', 'Tente novamente.'); }
  };
  return <SafeAreaView edges={['top']} style={ui.screen}>
    <FlatList data={cart} keyExtractor={(item) => String(item.product.id)} contentContainerStyle={ui.content}
      ListHeaderComponent={<View style={{ gap: 16, marginBottom: 16 }}><Text style={ui.title}>Seu carrinho</Text><Text style={ui.subtitle}>Ajuste as quantidades ou remova itens antes de confirmar.</Text><LocationCard /></View>}
      renderItem={({ item }) => <CartItemRow item={item} onMinus={() => updateQuantity(item.product.id, item.quantity - 1)} onPlus={() => updateQuantity(item.product.id, item.quantity + 1)} onRemove={() => removeFromCart(item.product.id)} />}
      ListEmptyComponent={<View style={[ui.card, { alignItems: 'center' }]}><Ionicons name="cart-outline" size={54} color={colors.muted} /><Text style={ui.label}>Seu carrinho está vazio</Text><Text style={ui.subtitle}>Escolha seus favoritos na loja.</Text></View>}
    />
    <View style={[ui.card, { borderRadius: 0, gap: 10 }]}>
      <Text style={ui.title}>Total {money(cartTotal)}</Text>
      <TouchableOpacity accessibilityRole="button" disabled={!cart.length || checkingOut} style={[ui.button, !cart.length && ui.disabled]} onPress={() => setReviewing(true)}><Ionicons name="bag-check-outline" size={23} color="#FFF" /><Text style={ui.buttonText}>Revisar pedido</Text></TouchableOpacity>
      {!!cart.length && <TouchableOpacity accessibilityRole="button" style={ui.secondary} onPress={cancel}><Text style={[ui.secondaryText, { color: colors.danger }]}>Cancelar pedido</Text></TouchableOpacity>}
    </View>
    <Modal visible={reviewing} animationType="slide" onRequestClose={() => !checkingOut && setReviewing(false)}>
      <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
        <Text style={ui.title}>Revise sua compra</Text><Text style={ui.subtitle}>Confira os produtos antes de finalizar.</Text>
        {cart.map(({ product, quantity }) => <View style={ui.card} key={product.id}><Text style={ui.label}>{product.title}</Text><Text style={ui.subtitle}>{quantity} × {money(product.price)}</Text><Text style={ui.label}>{money(product.price * quantity)}</Text></View>)}
        {location && <Text style={ui.subtitle}>Localização: {location.address || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}</Text>}
        <Text style={ui.title}>Total {money(cartTotal)}</Text>
        <TouchableOpacity accessibilityRole="button" disabled={checkingOut || !cart.length} style={ui.button} onPress={confirm}>{checkingOut ? <ActivityIndicator color="#FFF" /> : <Text style={ui.buttonText}>Confirmar compra</Text>}</TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" disabled={checkingOut} style={ui.secondary} onPress={() => setReviewing(false)}><Ionicons name="create-outline" size={22} color={colors.ink} /><Text style={ui.secondaryText}>Editar pedido</Text></TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" disabled={checkingOut} style={ui.secondary} onPress={cancel}><Text style={[ui.secondaryText, { color: colors.danger }]}>Cancelar pedido</Text></TouchableOpacity>
      </ScrollView></SafeAreaView>
    </Modal>
  </SafeAreaView>;
};
