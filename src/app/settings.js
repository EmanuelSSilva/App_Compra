import { Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';
import { SettingsScreen } from '../screens/SettingsScreen';
export default function Settings() { const { user } = useApp(); return user ? <SettingsScreen /> : <Redirect href="/login" />; }
