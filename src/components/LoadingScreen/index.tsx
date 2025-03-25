import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  StyleSheet,
  Image,
} from "react-native";

const LoadingPage = () => {
  return (
    <LinearGradient
      colors={["#000", "#000"]}
      style={styles.container}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={styles.loaderContainer}>
        <Image source={require('../../../assets/Logo.png')} style={styles.logo} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loadingText: {
    color: "#FF5722",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
});

export default LoadingPage;
