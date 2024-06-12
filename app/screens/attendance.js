import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {useFocusEffect} from '@react-navigation/native';

import {RNCamera} from 'react-native-camera';
import Camera from './camera';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  // SafeAreaView,
  TouchableHighlight,
  Image,
  View,
  Text,
  Modal,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {AuthContext} from '../utils/AuthContext';
import RBSheet from 'react-native-raw-bottom-sheet';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import BottomSheet from './bottomSheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ColorProperties} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const Attendance = ({navigation}) => {
  const cameraRef = useRef();
  const {
    userInfo,
    attended,
    getCompanyLocation,
    companyLocation,
    setCompanyLocation,
    markAttendance,
    setAttended,
    isLoading,
    setIsLoading,
    checkLocations,
  } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [checkCoords, setCheckCoords] = useState('');
  const [startCamera, setStartCamera] = useState(false);
  const [takingPic, setTakingPic] = useState(false);
  // const refRBSheet = useRef();

  // useFocusEffect(
  //   useCallback(() => {
  //     getCompanyLocation();
  //     // getLocation();
  //   }, []),
  // );

  useEffect(() => {
    // requestPermissions();
    // getLocation();
    // getCompanyLocation();
    init();
    // const fetchLocationAndCompany = async () => {
    //   Orientation.lockToPortrait();
    //   const orientationDidChange = () => {};
    //   Orientation.addOrientationListener(orientationDidChange);

    //   Orientation.removeOrientationListener(orientationDidChange);
    // };

    // fetchLocationAndCompany();
  }, []);

  // useEffect(() => {
  //   Orientation.lockToPortrait();
  //   const orientationDidChange = () => {};
  //   Orientation.addOrientationListener(orientationDidChange);

  //   requestPermissions();
  //   getCompanyLocation();
  //   if (companyLocation && companyLocation.length > 0) {
  //     for (const i in companyLocation) {
  //       let {geocodes} = companyLocation[i];
  //       let distance = calculateSphericalDistance(
  //         geocodes?.lat,
  //         coordinates[0],
  //         geocodes?.lng,
  //         coordinates[1],
  //       );
  //       if (distance <= 50) {
  //         console.log('yes');
  //         setCurrentLocation(companyLocation[i]);
  //         console.log(currentLocation);
  //         break;
  //       }
  //     }
  //   }
  //   return () => {
  //     Orientation.removeOrientationListener(orientationDidChange);
  //   };
  // }, []);

  function init() {
    // setStartCamera(false);
    // setIsLoading(true);
    setCompanyLocation('');
    setCoordinates('');
    requestPermissions();
    getLocation();
    getCompanyLocation();
  }

  async function requestPermissions() {
    let cameraPermission, locationPermission;
    // getCompanyLocation();
    if (Platform.OS === 'android') {
      cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      locationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    if (Platform.OS === 'ios') {
      cameraPermission = 'granted'; // iOS doesn't require explicit camera permission
      locationPermission = await Geolocation.requestAuthorization('whenInUse');
    }

    setHasCameraPermission(cameraPermission === 'granted');

    setHasLocationPermission(locationPermission === 'granted');
    // getLocation();
  }

  useEffect(() => {
    let distance;
    if (companyLocation && coordinates) {
      console.log(companyLocation);
      // console.log(coordinates);
      for (const i in companyLocation) {
        let {geocodes} = companyLocation[i];
        distance = calculateSphericalDistance(
          geocodes?.lat,
          coordinates[0],
          geocodes?.lng,
          coordinates[1],
        );

        if (distance <= 50) {
          if (startCamera) {
            console.log('pic taken');
            captureImage();
          }
          setCurrentLocation({success: true, data: companyLocation[i]});
          // console.log(currentLocation);

          break;
        }
      }
      if (distance > 50) {
        setStartCamera(false);
        setCurrentLocation({
          success: false,
          msg: 'Unknown Location. You cannot mark attendance from here.',
        });
      }
    }
  }, [companyLocation, coordinates, startCamera]);

  // useEffect(() => {
  //   if (currentLocation.success && startCamera) {
  //     captureImage();
  //     setStartCamera(false);
  //   }
  //   if (!currentLocation.success && startCamera) {
  //     console.log('returned');
  //   }
  // }, [startCamera, currentLocation]);

  function getLocation() {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCoordinates([latitude, longitude]);
        // console.log('from getlocation', companyLocation);
        let distance;
        // if (companyLocation) {
        //   console.log('yes');
        //   for (const i in companyLocation) {
        //     let {geocodes} = companyLocation[i];
        //     distance = calculateSphericalDistance(
        //       geocodes?.lat,
        //       latitude,
        //       geocodes?.lng,
        //       longitude,
        //     );
        //     console.log(distance);
        //     if (distance <= 50) {
        //       console.log('yes');
        //       setCurrentLocation({success: true, data: companyLocation[i]});
        //       console.log(currentLocation);
        //       break;
        //     }
        //   }
        //   if (distance > 50) {
        //     setCurrentLocation({
        //       success: false,
        //       msg: 'Unknown Location. You cannot mark attendnace from here.',
        //     });
        //   }
        // }
      },
      error => {
        console.error(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true, // Use GPS for more accurate results
        timeout: 20000, // Timeout for the location request (in milliseconds)
        maximumAge: 1000, // Maximum age of cached location (in milliseconds)
      },
    );
  }

  function calculateSphericalDistance(y1, y2, x1, x2) {
    const R = 6321;
    const dLat = ((x2 - x1) * Math.PI) / 180;
    const dLon = ((y2 - y1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((x1 * Math.PI) / 180) *
        Math.cos((x2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
    return distance;
  }

  function onPicture(returnedData) {
    // console.log(attended);
    // console.log(returnedData);
    if (returnedData.success) {
      const formData = new FormData();
      formData.append('imgData', returnedData.image);
      formData.append('location', JSON.stringify(returnedData.location));
      setImg(returnedData);
      markAttendance(formData);
    } else {
      setImg(returnedData);
      setErrorMsg(true);
    }
  }

  useEffect(() => {
    if ((attended, img)) {
      navigation.navigate('Attendance Details', {
        description: img.location.description,
        timestamp: img.timestamp,
        imageData: img.image,
      });
    }
  }, [attended, img]);

  async function captureImage() {
    // init();

    if (cameraRef.current && !takingPic) {
      let options = {
        quality: 1,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      setTakingPic(true);
      // console.log('mnbv');

      try {
        const data = await cameraRef.current.takePictureAsync(options);
        // const imageData = JSON.stringify(data);
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        const formData = new FormData();
        const imgData = {
          uri: data.uri,
          name: `${userInfo?.name}_${isoString}.jpg`,
          type: 'image/jpg',
        };
        // console.log(imgData, currentLocation);
        formData.append('location', JSON.stringify(currentLocation?.data));
        formData.append('imgData', imgData);
        setImg({
          timestamp: isoString,
          location: currentLocation?.data,
          image: imgData,
        });
        markAttendance(formData);
        return;
      } catch (err) {
        setIsLoading(false);
        // console.log('errrror');
        return;
      } finally {
        setTakingPic(false);
        setStartCamera(false);
      }
      // setTakingPic(false);
      // setStartCamera(false);
    }
  }

  function onBackToCamera() {
    // refRBSheet.current.close();
    setImg(null);
    setAttended(false);

    // console.log(img, attended);
  }

  const handlePermissionLinkPress = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  const onRefresh = () => {
    // console.log('refreshing');
  };

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    });
  }

  const handleCameraClick = async () => {
    setIsLoading(true);
    setStartCamera(true);
    init();
    // let distance;

    // setIsLoading(true);
    // // setTakingPic(true);
    // const position = await getCurrentPosition();
    // const {latitude, longitude} = position.coords;
    // setCheckCoords([latitude, longitude]);
    // await getCompanyLocation();
  };

  useEffect(() => {
    if (checkLocations) {
      // console.log(checkLocations);
    }
  }, [checkLocations, checkCoords]);

  return (
    <>
      <SafeAreaView style={{flex: 1, paddingHorizontal: 20}}>
        {hasCameraPermission && hasLocationPermission ? (
          <>
            <RNCamera
              ref={cameraRef}
              captureAudio={false}
              style={{
                height: '70%',
                width: '100%',
                borderRadius: 20,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: 'blue',
                marginTop: 30,
              }}
              type={RNCamera.Constants.Type.front}
              ratio="4:3"
            />
            {currentLocation ? (
              currentLocation.success ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.markButton}
                    disabled={isLoading}
                    onPress={handleCameraClick}>
                    {!isLoading ? (
                      <>
                        <Icon name="my-location" size={20} color="white" />
                        <Text style={{color: 'white', marginLeft: 10}}>
                          Mark Attendance
                        </Text>
                      </>
                    ) : (
                      <ActivityIndicator />
                    )}
                  </TouchableOpacity>
                  <View style={styles.currentInfo}>
                    <View style={styles.timeStamp}>
                      <Icon name="map" size={15} color="white" />
                      <View>
                        <Text style={styles.locationName}>
                          {currentLocation?.data?.name}
                        </Text>
                        <Text style={styles.info}>
                          {currentLocation?.data?.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.errorView}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'red',
                      fontWeight: 'bold',
                    }}>
                    {currentLocation?.msg}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.refreshButton}
                    disabled={isLoading}
                    onPress={() => {
                      setIsLoading(true);
                      init();
                    }}>
                    {!isLoading ? (
                      <>
                        <Icon name="refresh" size={20} color="blue" />
                        <Text style={{color: 'blue', marginLeft: 5}}>
                          Refresh
                        </Text>
                      </>
                    ) : (
                      <ActivityIndicator />
                    )}
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <ActivityIndicator style={{marginTop: 40}} />
            )}
          </>
        ) : (
          <ScrollView refreshControl={<RefreshControl onRefresh={onRefresh} />}>
            <Text style={{textAlign: 'center', marginTop: 20}}>
              Camera and Location permissions are required.{' '}
              <Text style={{color: 'blue'}} onPress={handlePermissionLinkPress}>
                Grant permissions
              </Text>
            </Text>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  markButton: {
    flexDirection: 'row',
    marginHorizontal: 80,
    marginBottom: 30,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  refreshButton: {
    flexDirection: 'row',
    width: 100,
    // marginBottom: 30,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'blue',
    // color: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  currentInfo: {
    backgroundColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  currentText: {
    fontSize: 10,
  },
  timeStamp: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  info: {
    fontSize: 12,
    color: 'white',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  errorView: {
    marginTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
