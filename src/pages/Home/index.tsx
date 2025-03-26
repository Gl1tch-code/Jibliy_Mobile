import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { useTranslation } from "react-i18next";
import Logout from "../../core/Logout";
import { base_url } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingPage from "../../components/LoadingScreen";
import Show from "../../core/Show";

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
}

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await AsyncStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await fetch(base_url + "/categories", {
          headers: headers,
        });

        if (response.ok) {
          const apiCategories = await response.json();
          setCategories(apiCategories);
        } else {
          setError(t("somethingWentWrong"));
        }
      } catch (error) {
        setError(t("somethingWentWrong"));
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Show if={loading}>
        <LoadingPage />
      </Show>
      <Show if={!loading && (error === null || error === undefined)}>
        <View style={styles.container}>
          <Text style={styles.title}>Home</Text>
          {error && <Text>Error: {error}</Text>}

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
                {item.imageUrl && (
                  <Text style={styles.itemText}>
                    Image URL: {item.imageUrl}
                  </Text>
                )}
              </View>
            )}
          />
          <Logout />
        </View>
      </Show>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default HomeScreen;
