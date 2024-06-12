import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Attendance from '../screens/attendance';
import Header from '../screens/header';
const Stack = createStackNavigator();

function AttendanceNavigations() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={{
          headerShown: () => false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AttendanceNavigations;
