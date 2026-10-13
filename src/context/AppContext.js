import AsyncStorage from '@react-native-async-storage/async-storage';
import { isRunningInExpoGo } from 'expo';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, Vibration } from 'react-native';

import { api } from '../services/api';
import { createOrder, createUser, findUserByEmail, initDatabase, listOrdersByEmail } from '../services/database';

const STORAGE_SESSION = '@shopnow_session';
const STORAGE_CART = '@shopnow_cart';

// Importing the package registers a push token listener, which throws in Android Expo Go.
const Notifications = Platform.OS === 'android' && isRunningInExpoGo()
  ? null
  : require('expo-notifications');

const AppContext = createContext(undefined);

const getDeviceType = () => {
  const type = Device.deviceType;
  if (type === Device.DeviceType.PHONE) return 'Phone';
  if (type === Device.DeviceType.TABLET) return 'Tablet';
  if (type === Device.DeviceType.DESKTOP) return 'Desktop';
  if (type === Device.DeviceType.TV) return 'TV';
  return 'Unknown';
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const checkoutLock = useRef(false);

  const deviceInfo = useMemo(
    () => ({
      osName: Device.osName ?? Platform.OS,
      osVersion: Device.osVersion ?? 'N/A',
      brand: Device.brand ?? 'N/A',
      modelName: Device.modelName ?? 'N/A',
      deviceType: getDeviceType(),
    }),
    []
  );

  const loadPersistedData = useCallback(async () => {
    try {
      const [savedUser, savedCart] = await Promise.all([
        AsyncStorage.getItem(STORAGE_SESSION),
        AsyncStorage.getItem(STORAGE_CART),
      ]);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setOrders(listOrdersByEmail(parsedUser.email));
      }

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      Alert.alert('Não foi possível entrar', 'Tente abrir o aplicativo novamente.');
    } finally {
      setRestoringSession(false);
    }
  }, []);

  useEffect(() => {
    initDatabase();

    Notifications?.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const configureNotifications = async () => {
      if (!Notifications) return;
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
      await Notifications.requestPermissionsAsync();
    };

    configureNotifications().catch((error) => {
      console.warn('Nao foi possivel configurar notificacoes:', error);
    });
    // Hydration updates state after awaiting AsyncStorage, once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPersistedData();
  }, [loadPersistedData]);

  useEffect(() => {
    if (restoringSession) return;
    AsyncStorage.setItem(STORAGE_CART, JSON.stringify(cart)).catch(() => {
      console.warn('Não foi possível atualizar o carrinho.');
    });
  }, [cart, restoringSession]);

  const signIn = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = findUserByEmail(normalizedEmail);

    if (existingUser) {
      if (existingUser.password !== password) {
        Alert.alert('Senha incorreta', 'A senha informada nao corresponde ao usuario cadastrado.');
        return false;
      }

      const sessionUser = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      };

      setUser(sessionUser);
      setOrders(listOrdersByEmail(sessionUser.email));
      await AsyncStorage.setItem(STORAGE_SESSION, JSON.stringify(sessionUser));
      return true;
    }

    Alert.alert('Conta não encontrada', 'Crie sua conta para continuar.');
    return false;
  };

  const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (findUserByEmail(normalizedEmail)) {
      Alert.alert('E-mail já cadastrado', 'Entre com sua conta para continuar.');
      return false;
    }
    createUser({ name: name.trim(), email: normalizedEmail, password });
    return true;
  };

  const signOut = async () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    setLocation(null);
    await AsyncStorage.multiRemove([STORAGE_SESSION, STORAGE_CART]);
  };

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch {
      Alert.alert('API indisponivel', 'Nao foi possivel carregar os produtos.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });
    Vibration.vibrate(60);
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const refreshLocation = async () => {
    if (loadingLocation) return;
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Localização não autorizada', 'Permita o acesso à localização nas configurações do celular.');
        return;
      }
      if (!(await Location.hasServicesEnabledAsync())) {
        Alert.alert('Ative a localização', 'Ative o GPS do celular e tente novamente.');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nextLocation = { latitude: coords.latitude, longitude: coords.longitude, address: '' };
      setLocation(nextLocation);
      try {
        const [address] = await Location.reverseGeocodeAsync(nextLocation);
        if (address) {
          nextLocation.address = [address.street, address.streetNumber, address.district, address.city || address.subregion, address.region].filter(Boolean).join(', ');
          setLocation({ ...nextLocation });
        }
      } catch {
        // Coordinates remain visible when the address service is unavailable.
      }
    } catch {
      Alert.alert('Localização indisponível', 'Não foi possível obter sua localização. Verifique o GPS e tente novamente.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const checkout = async () => {
    if (checkoutLock.current) return;
    if (!user) {
      Alert.alert('Atencao', 'Voce precisa estar logado para finalizar a compra.');
      return;
    }

    if (!cart.length) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de finalizar.');
      return;
    }

    checkoutLock.current = true;
    setCheckingOut(true);
    try {
      createOrder({
        customerName: user.name,
        customerEmail: user.email,
        total: cartTotal,
        itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      });

      setOrders(listOrdersByEmail(user.email));
      setCart([]);
      Vibration.vibrate([0, 100, 50, 100]);

      if (Notifications) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Pedido confirmado',
              body: `Obrigado, ${user.name}! Seu pedido foi finalizado com sucesso.`,
            },
            trigger: null,
          });
        } catch (error) {
          console.warn('Nao foi possivel enviar a notificacao do pedido:', error);
        }
      }

      Alert.alert('Sucesso', 'Pedido finalizado!');
    } finally {
      checkoutLock.current = false;
      setCheckingOut(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        products,
        cart,
        orders,
        loadingProducts,
        location,
        deviceInfo,
        signIn,
        register,
        restoringSession,
        loadingLocation,
        checkingOut,
        signOut,
        fetchProducts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        refreshLocation,
        checkout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp precisa ser usado dentro de AppProvider.');
  }
  return context;
};
