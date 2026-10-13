import { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brand } from '../components/Brand';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';
export const HomeScreen = () => {
  const { products, fetchProducts, addToCart, loadingProducts, user } = useApp();
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return <SafeAreaView edges={['top']} style={ui.screen}>
    <FlatList data={products} keyExtractor={(item) => String(item.id)} contentContainerStyle={ui.content}
      ListHeaderComponent={<View style={{ gap: 18, marginBottom: 20 }}><Brand compact /><View style={[ui.card, { backgroundColor: colors.ink, borderColor: colors.ink }]}><Text style={{ color: '#FFB58A', fontWeight: '700' }}>Olá, {user?.name?.split(' ')[0]}!</Text><Text style={[ui.title, { color: '#FFF' }]}>Encontre algo que você vai adorar.</Text><Text style={{ color: '#D5DDEB', lineHeight: 22 }}>Explore a seleção e escolha seus próximos favoritos.</Text></View><Text style={ui.title}>Produtos em destaque</Text></View>}
      renderItem={({ item }) => <ProductCard item={item} onAdd={addToCart} />}
      refreshControl={<RefreshControl refreshing={loadingProducts} onRefresh={fetchProducts} tintColor={colors.primary} />}
      ListEmptyComponent={loadingProducts ? <ActivityIndicator size="large" color={colors.primary} /> : <Text style={ui.subtitle}>Nenhum produto disponível. Puxe para atualizar.</Text>}
    />
  </SafeAreaView>;
};
