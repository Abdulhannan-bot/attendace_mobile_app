import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, CHATSOCKET, NOTIFYSOCKET} from './config';
import {Alert, Platform} from 'react-native';
import {checkIfConfigIsValid} from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [companyLocation, setCompanyLocation] = useState('');
  const [userData, setUserData] = useState([]);
  const [checkLocations, setCheckLocations] = useState('');
  const [attended, setAttended] = useState(false);

  const login = (username, password) => {
    setIsLoading(true);

    console.log(`${BASE_URL}/api/login/`);
    axios
      .post(`${BASE_URL}/api/login/`, {
        username,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

        setIsLoading(false);
        // console.log(JSON.stringify(userInfo.token));
      })
      .catch(err => {
        setIsLoading(false);
        console.warn(`login error: ${err}`);
      });
  };

  // const getCompanyLocation = () => {
  //   setIsLoading(true);
  //   axios
  //     .get(`${BASE_URL}/api/get-company-locations/`, {
  //       headers: {
  //         Authorization: `Token ${userInfo.token}`,
  //       },
  //     })
  //     .then(res => {
  //       // console.log('company');

  //       if (res.data.success) {
  //         setCompanyLocation(res.data.locations.locations);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //     });
  // };
  const getCompanyLocation = async (check = false) => {
    console.log(check);
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/get-company-locations/`,
        {
          headers: {
            Authorization: `Token ${userInfo.token}`,
          },
        },
      );

      if (response.data.success) {
        if (check) {
          setCheckLocations(response.data.locations.locations);
        } else {
          setCompanyLocation(response.data.locations.locations);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching company locations:', error);
    }
  };

  const logout = () => {
    setIsLoading(false);
    setUserInfo({});
    AsyncStorage.removeItem('userInfo');
    if (Platform.OS === 'web') {
      AsyncStorage.removeItem('contact');
    }
    // AsyncStorage.removeItem('screen');
  };

  const isLoggedIn = async () => {
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const markAttendance = formData => {
    console.log(formData);
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/api/mark-attendance/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${userInfo.token}`,
        },
      })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          setAttended(true);
        } else {
          Alert.alert('An error occured');
        }
        setIsLoading(false);
        // console.log(JSON.stringify(userInfo.token));
      })
      .catch(err => {
        setIsLoading(false);
        console.warn(` error: ${err}`);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        userData,
        attended,
        companyLocation,
        isLoading,
        attended,
        checkLocations,
        setCompanyLocation,
        setIsLoading,
        setAttended,
        getCompanyLocation,
        markAttendance,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
