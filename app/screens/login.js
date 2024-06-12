import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {AuthContext} from '../utils/AuthContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login, isLoading, setIsLoading} = useContext(AuthContext);
  const handleLogin = async () => {
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Please fill all the fields');
    } else {
      login(username, password);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={text => setUsername(text)}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={text => setPassword(text)}
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsLoading(true);
          login(username, password);
        }}>
        <Text style={styles.buttonText}>
          {isLoading ? <ActivityIndicator /> : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
