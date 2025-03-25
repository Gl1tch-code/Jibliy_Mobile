import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Alert, Button, View } from 'react-native';

type RootParamList = {
  Login: undefined;
  Signup: undefined;
  Categories: undefined;
  AdditionalInfo: { userId: string };
};

const useLogout = () => {
  const navigation = useNavigation<NavigationProp<RootParamList>>();

  const logout = useCallback(async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');

              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });

            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Failed', 'An error occurred during logout.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, [navigation]);

  return logout;
};

const Logout = () => {
  const logout = useLogout();

  return (
    <View>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Logout;