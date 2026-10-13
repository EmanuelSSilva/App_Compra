import { Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';
import { RegisterScreen } from '../screens/RegisterScreen';
export default function Register() { const { user } = useApp(); return user ? <Redirect href="/" /> : <RegisterScreen />; }
