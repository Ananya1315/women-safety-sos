import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Report from './screens/Report';
import Heatmap from './screens/Heatmap';
import SafeRoute from './screens/SafeRoute';
import TrustedCircle from './screens/TrustedCircle';
import OfficialAuth from './screens/OfficialAuth';

const Stack = createNativeStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) return null;

  return (
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>

    {!isLoggedIn ? (
      <>
        <Stack.Screen name="Login">
          {props => <Login {...props} refreshAuth={checkLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={Register} />
      </>
    ) : (
      <>
        <Stack.Screen name="Home">
          {props => <Home {...props} refreshAuth={checkLogin} />}
        </Stack.Screen>

        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="Heatmap" component={Heatmap} />
        <Stack.Screen name="SafeRoute" component={SafeRoute} />
        <Stack.Screen name="OfficialAuth" component={OfficialAuth} />
<Stack.Screen name="TrustedCircle" component={TrustedCircle} />
  
      </>
    )}

  </Stack.Navigator>
</NavigationContainer>
  );
}