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
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import "./i18n";
import AdditionalInfoScreen from "./src/pages/SignUp/AdditionalInfoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator(); // Correct usage

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
    Poppins_800ExtraBold,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token !== null) {
          setInitialRoute("Categories");
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
              name="AdditionalInfo"
              component={AdditionalInfoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Categories"
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
