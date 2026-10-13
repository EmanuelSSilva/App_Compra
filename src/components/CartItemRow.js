import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CartItemRow = ({ item, onPlus, onMinus, onRemove }) => {
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.product.image }} style={{ width: 70, height: 70 }} resizeMode="contain" />
      <View style={styles.infoBox}>
        <Text numberOfLines={1} style={styles.title}>
          {item.product.title}
        </Text>
        <Text style={styles.subtitle}>R$ {item.product.price.toFixed(2)} cada</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Diminuir quantidade de ${item.product.title}`} onPress={onMinus} style={styles.qtyButton}>
          <Ionicons name="remove" size={22} color="#14233B" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Aumentar quantidade de ${item.product.title}`} onPress={onPlus} style={styles.qtyButton}>
          <Ionicons name="add" size={22} color="#14233B" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remover ${item.product.title}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, alignSelf: 'flex-end' }} onPress={onRemove}>
        <Ionicons name="trash-outline" size={21} color="#CC2936" /><Text style={styles.remove}>Remover</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D6DFEA',
    gap: 10,
  },
  infoBox: {
    gap: 2,
  },
  title: {
    fontWeight: '700',
    color: '#0D1B2A',
  },
  subtitle: {
    color: '#526581',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B2A',
  },
  quantity: {
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: '#0D1B2A',
  },
  remove: {
    color: '#CC2936',
    fontWeight: '700',
    textAlign: 'right',
  },
});
