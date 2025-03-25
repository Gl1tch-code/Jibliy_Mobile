import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import AuthPageesWrapper from "../../components/AuthPagesWrapper";

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Categories: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://192.168.1.110:8080/auth/login?username=${username}&password=${password}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const token: string = await response.text();

      await AsyncStorage.setItem("authToken", token);
      navigation.navigate("Categories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageesWrapper>
      <View style={styles.bottomView}>
        <View style={styles.contentContainer}>
          <Text
            style={{
              ...styles.topText,
              color: "black",
              fontFamily: "Cairo_600SemiBold",
            }}
          >
            {t("login")}
          </Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder={t("username")}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder={t("password")}
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                flexDirection: "row-reverse",
              }}
            >
              <TouchableOpacity
                style={styles.showPasswordToggle}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <View style={styles.checkbox}>
                  {passwordVisible && <View style={styles.checkboxChecked} />}
                </View>
                <Text style={styles.showPasswordText}>{t("showPass")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.showPasswordToggle}
                onPress={() => navigation.navigate("Signup")}
              >
                <Text style={styles.showPasswordText}>{t("resetPass")}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.gradientButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={["#3931D2", "#E1A3FF"]}
                style={styles.gradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <Text style={styles.buttonText}>{t("login")}</Text>
              </LinearGradient>
            </TouchableOpacity>
            {loading && <ActivityIndicator color="#6A1B9A" />}
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.signupText}>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>{t("dontHaveAccountSignUp")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </AuthPageesWrapper>
  );
};

const styles = StyleSheet.create({

  topText: {
    textAlign: "center",
    width: "100%",
    fontSize: 36,
    color: "white",
    fontFamily: "Poppins_600SemiBold",
  },
  bottomView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    gap: 50,
    paddingBottom: 40,
    paddingHorizontal: 10,
    flex: 1,
  },
  input: {
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  error: {
    color: "#B00020",
    marginTop: 10,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    marginTop: 20,
    flexDirection: 'row-reverse',
    justifyContent: "flex-start",
    color: "#6A1B9A",
  },
  signupLink: {
    color: "#6A1B9A",
    fontFamily: 'Cairo_300Light'
  },
  gradientButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  gradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold'
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  showPasswordToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
    width: "auto",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#6A1B9A",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: "#6A1B9A",
  },
  showPasswordText: {
    color: "#6A1B9A",
    fontFamily: 'Cairo_400Regular'
  }
});

export default LoginScreen;
