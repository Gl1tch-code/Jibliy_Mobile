import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import AuthPageesWrapper from "../../components/AuthPagesWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../utils/type";
import Show from "../../core/Show";
import { base_url } from "../../utils/constants";

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleInitialSignup = async () => {
    if (loading === false) {
      setLoading(true);
      setError(null);

      if (!emailRegex.test(email)) {
        setError(t("invalidEmail"));
        setLoading(false);
        return;
      }
      if (!passwordRegex.test(password)) {
        setError(t("invalidPassword"));
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError(t("passwordsDontMatch"));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          base_url + "/auth/initialSignup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || t("signupFailed"));
        }

        const id: string = await response.text();

        const userId = id;
        if (typeof userId === "string") {
          navigation.navigate("AdditionalInfo", { userId: userId });
        } else {
          setError(t("userIdNotProvided"));
          setLoading(false);
          return;
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthPageesWrapper contentStyle={{ paddingTop: 0 }}>
      <ScrollView>
        <View style={styles.bottomView}>
          <View style={styles.contentContainer}>
            <Text
              style={{
                ...styles.topText,
                color: "black",
                fontFamily: "Cairo_600SemiBold",
              }}
            >
              {t("signup")}
            </Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder={t("email")}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder={t("password")}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder={t("confirmPassword")}
                secureTextEntry={!passwordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
              </View>

              <TouchableOpacity
                style={styles.gradientButton}
                onPress={handleInitialSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#3931D2", "#E1A3FF"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                >
                  <Show if={loading}>
                    <ActivityIndicator color="#6A1B9A" />
                  </Show>
                  <Show if={!loading}>
                    <Text style={styles.buttonText}>{t("signup")}</Text>
                  </Show>
                </LinearGradient>
              </TouchableOpacity>
              {error && <Text style={styles.error}>{error}</Text>}
              <View style={styles.signupText}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.signupLink}>
                    {t("haveAccountLogin")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </AuthPageesWrapper>
  );
};

const styles = StyleSheet.create({
  topText: {
    textAlign: "center",
    width: "100%",
    fontSize: 32,
    color: "white",
    fontFamily: "Cairo_600SemiBold",
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
  signupText: {
    marginTop: 20,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    color: "#6A1B9A",
  },
  signupLink: {
    color: "#6A1B9A",
    fontFamily: "Cairo_300Light",
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
    fontFamily: "Cairo_600SemiBold",
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
    fontFamily: "Cairo_400Regular",
  },
});

export default SignupScreen;
