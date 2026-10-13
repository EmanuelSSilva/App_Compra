import { StyleSheet } from 'react-native';
export const colors = { ink: '#14233B', primary: '#E85B19', background: '#F7F8FC', muted: '#65738A', border: '#E3E7EF', danger: '#BF3044' };
export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 32 },
  title: { fontSize: 27, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 15, color: colors.muted, lineHeight: 22 },
  card: { padding: 18, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, gap: 12 },
  label: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, minHeight: 50, color: colors.ink, backgroundColor: '#FFF' },
  button: { minHeight: 50, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', padding: 12, flexDirection: 'row', gap: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  secondary: { minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  secondaryText: { color: colors.ink, fontWeight: '700', fontSize: 15 },
  disabled: { opacity: 0.5 },
});
