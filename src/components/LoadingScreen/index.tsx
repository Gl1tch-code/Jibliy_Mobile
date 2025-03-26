import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";

const LoadingPage = () => {
  return (
    <LinearGradient
      colors={["#3931D2", "#3931D2"]}
      style={styles.container}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}
    >
      <View style={styles.loaderContainer}>
        <Text style={styles.topText}>Jibliy</Text>
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
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FF5722",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  topText: {
    textAlign: "center",
    width: "100%",
    fontSize: 42,
    color: "white",
    fontFamily: "Poppins_700Bold",
  },
});

export default LoadingPage;
