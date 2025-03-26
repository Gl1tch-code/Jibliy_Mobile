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
import Show from "../../core/Show";

type ResetScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Reset"
>;

interface ResetScreenProps {
  navigation: ResetScreenNavigationProp;
}

const ResetScreen: React.FC<ResetScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInitialReset = async () => {
    if (loading === false) {
      setLoading(true);
      setError(null);

      if (!emailRegex.test(email)) {
        setError(t("invalidEmail"));
        setLoading(false);
        return;
      }

      if (!loading) {
        try {
          const response = await fetch(base_url + "/auth/otp-request", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: email.toLowerCase(),
          });

          if (!response.ok) {
            setError(t("somethingWentWrong"));
            setLoading(false);
            return;
          } else {
            navigation.navigate("ResetOTPConfirm", { email: email });
          }
        } catch (err: any) {
          setError(t("emailNotExists"));
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
            {t("resetPassTitle")}
          </Text>
          <View>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              placeholder={t("email")}
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              style={styles.gradientButton}
              disabled={loading}
              onPress={handleInitialReset}
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
    width: "100%",
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
});

export default ResetScreen;
