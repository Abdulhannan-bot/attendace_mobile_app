import React, {useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/login';
import AttendanceNavigations from './stackNavigator';
import Attendance from '../screens/attendance';
import AttendanceDetails from '../screens/attendanceDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../screens/header';
const Stack = createStackNavigator();
import {AuthContext} from '../utils/AuthContext';

export default function MainStack() {
  const {userInfo} = useContext(AuthContext);
  // console.log(userInfo);
  return userInfo?.token ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Attendance}
        options={{
          headerTitle: () => <Header />,
        }}
      />
      <Stack.Screen
        name="Attendance Details"
        component={AttendanceDetails}
        // options={{
        //   headerTitle: () => <Header />,
        // }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
