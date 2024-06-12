/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {AuthProvider} from './app/utils/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from './app/routes/mainNavigator';
import AttendanceNavigations from './app/routes/stackNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <AuthProvider>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </AuthProvider>
    </>
    // <SafeAreaView style={styles.backgroundStyle}>
    //   <View>
    //     <Text>Hello</Text>
    //   </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
