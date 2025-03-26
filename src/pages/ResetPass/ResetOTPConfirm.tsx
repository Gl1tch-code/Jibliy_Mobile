import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import AuthPageesWrapper from "../../components/AuthPagesWrapper";
import { RootStackParamList } from "../../utils/type";
import { base_url } from "../../utils/constants";
import { useRoute } from "@react-navigation/core";
import Show from "../../core/Show";

type ConfirmResetScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Reset"
>;

interface ConfirmResetScreenProps {
  navigation: ConfirmResetScreenNavigationProp;
}

const ConfirmResetScreen: React.FC<ConfirmResetScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<any>();
  const { email } = route.params;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleResetPasswordReset = async () => {
    if (loading === false) {
      setLoading(true);
      setError(null);

      if (!passwordRegex.test(password)) {
        setError(t("invalidPassword"));
        setLoading(false);
        return;
      }
      if (!loading) {
        try {
          const response = await fetch(
            base_url + `/auth/otp-verify?email=${email}&otp=${otp}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: password,
            }
          );

          if (!response.ok) {
            setError(t("wrongOTP"));
            setLoading(false);
            return;
          } else {
            navigation.navigate("Login");
          }
        } catch (err: any) {
          setError(t("somethingWentWrong"));
        } finally {
          setLoading(false);
        }
      }
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
            {t("confirmResetPassTitle")}
          </Text>
          <View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "black",
                  fontFamily: "Cairo_300Light",
                }}
              >
                {t("otp")}
              </Text>
              <TextInput
                style={{ ...styles.input, flex: 1 }}
                keyboardType="number-pad"
                placeholder={t("otpInput")}
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

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
            </View>
            <TouchableOpacity
              style={styles.gradientButton}
              disabled={loading}
              onPress={handleResetPasswordReset}
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
                  <Text style={styles.buttonText}>{t("login")}</Text>
                </Show>
              </LinearGradient>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.signupText}>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signupLink}>{t("haveAccountLogin")}</Text>
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
    fontSize: 32,
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
  showPasswordToggle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
    marginBottom: 15,
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

export default ConfirmResetScreen;
