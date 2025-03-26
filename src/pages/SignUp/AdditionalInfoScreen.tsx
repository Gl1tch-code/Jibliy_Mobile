import React, { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthPageesWrapper from "../../components/AuthPagesWrapper";
import { RootStackParamList } from "../../utils/type";
import { base_url } from "../../utils/constants";
import Show from "../../core/Show";

type AdditionalInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AdditionalInfo"
>;

interface AdditionalInfoScreenProps {
  navigation: AdditionalInfoScreenNavigationProp;
}

const AdditionalInfoScreen: React.FC<AdditionalInfoScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [location, setLocation] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const route = useRoute<any>();
  const { userId } = route.params;

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const phoneNumberRegex = /^(\+2126|06)\d{8}$/;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(
        `${locationData.coords.latitude},${locationData.coords.longitude}`
      );
    })();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);

    if (!usernameRegex.test(username)) {
      setError(t("invalidUsername"));
      setLoading(false);
      return;
    }
    if (!phoneNumberRegex.test(phoneNumber)) {
      setError(t("invalidPhoneNumber"));
      setLoading(false);
      return;
    }
    if (!selectedCity) {
      setError(t("selectCity"));
      setLoading(false);
      return;
    }
    if (!location) {
      setError(t("locationError"));
      setLoading(false);
      return;
    }

    if (!loading) {
      try {
        const response = await fetch(base_url + "/auth/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            username,
            city: selectedCity,
            phoneNumber,
            location,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || t("updateProfileFailed"));
        }

        const token: string = await response.text();
        await AsyncStorage.setItem("authToken", token);

        navigation.navigate("Home");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
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
            {t("additionalInfos")}
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
              placeholder={t("phoneNumber")}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCity}
                onValueChange={(itemValue: string) =>
                  setSelectedCity(itemValue)
                }
              >
                <Picker.Item label={t("selectCity")} value="" enabled={false} />
                <Picker.Item label="Fes" value="FES" />
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.gradientButton}
              onPress={handleUpdateProfile}
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
                  <Text style={styles.buttonText}>{t("updateProfile")}</Text>
                </Show>
              </LinearGradient>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
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
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    overflow: "hidden",
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
  error: {
    color: "#B00020",
    marginTop: 10,
    textAlign: "center",
  },
});

export default AdditionalInfoScreen;
