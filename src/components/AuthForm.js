import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brand } from './Brand';
import { useApp } from '../context/AppContext';
import { colors, ui } from '../theme';
export const AuthForm = ({ registering = false }) => {
  const { signIn, register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (busy) return;
    if (!email.trim() || !password || (registering && !name.trim())) { Alert.alert('Preencha os campos', 'Informe os dados para continuar.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { Alert.alert('E-mail inválido', 'Confira o endereço de e-mail.'); return; }
    if (registering && (password.length < 6 || password !== confirmation)) { Alert.alert('Confira a senha', 'Use pelo menos 6 caracteres e repita a mesma senha.'); return; }
    setBusy(true);
    try {
      if (registering) {
        if (await register({ name, email, password })) { setPassword(''); setConfirmation(''); Alert.alert('Usuário cadastrado'); router.replace('/login'); }
      } else if (await signIn({ email, password })) { router.replace('/'); }
    } catch { Alert.alert('Não foi possível continuar', 'Tente novamente.'); } finally { setBusy(false); }
  };
  return (
    <SafeAreaView style={ui.screen}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[ui.content, { flexGrow: 1, justifyContent: 'center' }]} keyboardShouldPersistTaps="handled">
          <Brand />
          <Text style={ui.title}>{registering ? 'Crie sua conta' : 'Boas compras começam aqui'}</Text>
          <Text style={ui.subtitle}>{registering ? 'Cadastre-se e encontre seus favoritos.' : 'Entre para continuar comprando.'}</Text>
          {registering && <><Text style={ui.label}>Nome</Text><TextInput accessibilityLabel="Nome" placeholder="Como podemos chamar você?" style={ui.input} value={name} onChangeText={setName} autoComplete="name" /></>}
          <Text style={ui.label}>E-mail</Text>
          <TextInput accessibilityLabel="E-mail" placeholder="voce@email.com" style={ui.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          <Text style={ui.label}>Senha</Text>
          <TextInput accessibilityLabel="Senha" placeholder={registering ? 'Pelo menos 6 caracteres' : 'Sua senha'} style={ui.input} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoComplete={registering ? 'new-password' : 'current-password'} />
          {registering && <><Text style={ui.label}>Confirme sua senha</Text><TextInput accessibilityLabel="Confirme sua senha" placeholder="Repita sua senha" style={ui.input} value={confirmation} onChangeText={setConfirmation} secureTextEntry autoCapitalize="none" /></>}
          <TouchableOpacity accessibilityRole="button" disabled={busy} style={[ui.button, busy && ui.disabled]} onPress={submit}>{busy ? <ActivityIndicator color="#FFF" /> : <Text style={ui.buttonText}>{registering ? 'Cadastrar' : 'Entrar'}</Text>}</TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" disabled={busy} style={ui.secondary} onPress={() => router.replace(registering ? '/login' : '/register')}><Text style={[ui.secondaryText, { color: colors.primary }]}>{registering ? 'Já tenho conta · Entrar' : 'Não tenho conta · Criar cadastro'}</Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
