import { Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';
import { LoginScreen } from '../screens/LoginScreen';
export default function Login() { const { user } = useApp(); return user ? <Redirect href="/" /> : <LoginScreen />; }
