import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenProps {
    children: React.ReactElement | React.ReactElement[];
    contentStyle?: StyleProp<ViewStyle>
  }
  
const AuthPageesWrapper: React.FC<ScreenProps> = ({ children, contentStyle }) => {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#3931D2", "#706BDF", "#AAA6FA"]}
      style={styles.container}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 0.3 }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.topText}>{t("jibliy")}</Text>
        <Text style={styles.subText}>{t("sub")}</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContainer, contentStyle]}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  textContainer: {
    flex: 0.3,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  topText: {
    textAlign: "center",
    width: "100%",
    fontSize: 32,
    color: "white",
    fontFamily: "Poppins_600SemiBold",
  },
  subText: {
    width: "70%",
    textAlign: "center",
    flexWrap: "wrap",
    fontSize: 16,
    color: "white",
    fontFamily: "Cairo_200ExtraLight",
  },
  scroll: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContainer: {
    minHeight: 450,
    flex: 0.7,
    flexGrow: 1,
    justifyContent: "flex-start",
  },
});

export default AuthPageesWrapper;
