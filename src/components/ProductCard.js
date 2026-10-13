import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

export const ProductCard = ({ item, onAdd }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>

      <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => onAdd(item)}>
        <Ionicons name="cart-outline" size={21} color="#FFF" />
        <Text style={styles.buttonText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E3EAF5',
  },
  image: {
    width: '100%',
    height: 130,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  category: {
    fontSize: 12,
    color: '#4F6D8A',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
