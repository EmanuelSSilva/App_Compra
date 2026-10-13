import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
export const Brand = ({ compact = false }) => (
  <View style={[styles.brand, compact && styles.compact]}>
    <Image source={require('../../assets/compre-agora-icon.png')} style={[styles.logo, compact && styles.small]} accessibilityLabel="Logo Compre Agora" />
    <View><Text style={[styles.name, compact && { fontSize: 21 }]}>Compre Agora</Text><Text style={styles.tagline}>Seu próximo favorito está aqui.</Text></View>
  </View>
);
const styles = StyleSheet.create({
  brand: { alignItems: 'center', gap: 16, marginBottom: 12 }, compact: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  logo: { height: 92, width: 92, borderRadius: 24 }, small: { height: 54, width: 54, borderRadius: 16 },
  name: { color: colors.ink, fontSize: 32, fontWeight: '800' }, tagline: { color: colors.muted, fontSize: 13, marginTop: 5 },
});
