import React, { useState, useEffect } from "react";
import LoadingPage from "./src/components/LoadingScreen";
import Show from "./src/core/Show";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/pages/Login";
import SignupScreen from "./src/pages/SignUp";
import CategoriesTestUI from "./src/pages/Home";
import {
  useFonts,
  Cairo_200ExtraLight,
  Cairo_300Light,
  Cairo_400Regular,
  Cairo_600SemiBold,
} from "@expo-google-fonts/cairo";
import {
  useFonts as usePoppins,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import "./i18n";
import AdditionalInfoScreen from "./src/pages/SignUp/AdditionalInfoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResetScreen from "./src/pages/ResetPass";
import ConfirmResetScreen from "./src/pages/ResetPass/ResetOTPConfirm";

const Stack = createNativeStackNavigator();

const App = () => {
  const [cairoFontsLoaded] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
    Cairo_400Regular,
    Cairo_600SemiBold,
  });
  const [poppinsFontsLoaded] = usePoppins({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true)
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token !== null) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setInitialRoute("Login");
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    };
    checkToken();
  }, []);

  return (
    <>
      <Show if={isLoading || !cairoFontsLoaded || !poppinsFontsLoaded}>
        <LoadingPage />
      </Show>
      <Show if={!isLoading && cairoFontsLoaded && poppinsFontsLoaded}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute || "Login"}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reset"
              component={ResetScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetOTPConfirm"
              component={ConfirmResetScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdditionalInfo"
              component={AdditionalInfoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={CategoriesTestUI}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Show>
    </>
  );
};

export default App;
