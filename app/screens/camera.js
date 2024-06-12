import React, {useState, useRef, useContext, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  TouchableOpacity,
  Alert,
  StyleSheet,
  View,
  Text,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {AuthContext} from '../utils/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {dispatchCommand} from 'react-native-reanimated';

const Camera = ({onPicture, locations}) => {
  const companyLocations = locations;
  const {userInfo, isLoading, setIsLoading, getCompanyLocation} =
    useContext(AuthContext);
  const [takingPic, setTakingPic] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [img, setImg] = useState({});
  const cameraRef = useRef(null);
  const [auth, setAuth] = useState('');

  useEffect(() => {
    console.log('clicked');
    const requestPermissions = async () => {
      let cameraPermission, locationPermission;

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
        locationPermission = await Geolocation.requestAuthorization(
          'whenInUse',
        );
      }

      setHasCameraPermission(cameraPermission === 'granted');

      setHasLocationPermission(locationPermission === 'granted');
      getLocation();
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    let distance;
    let location;
    if (hasLocationPermission) {
      for (const i of companyLocations) {
        distance = calculateSphericalDistance(
          longitude,
          i.geocodes.lng,
          latitude,
          i.geocodes.lat,
        );
        if (distance <= 50) {
          location = i;
          break;
        }
      }

      if (distance > 50) {
        onPicture({success: false, msg: 'You are not in office premises.'});
        setIsLoading(false);
        return;
      }
    }
  }, [hasLocationPermission]);

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

  function getLocation() {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCoordinates([latitude, longitude]);
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

  const takePicture = async () => {
    setIsLoading(true);
    const latitude = coordinates[0];
    const longitude = coordinates[1];
    // console.log(latitude, longitude);
    let distance;
    let location;
    // console.log(companyLocations[0]);

    for (const i of companyLocations) {
      distance = calculateSphericalDistance(
        longitude,
        i.geocodes.lng,
        latitude,
        i.geocodes.lat,
      );
      if (distance <= 50) {
        location = i;
        break;
      }
    }

    if (distance > 50) {
      onPicture({success: false, msg: 'You are not in office premises.'});
      setIsLoading(false);
      return;
    }

    if (cameraRef.current && !takingPic) {
      let options = {
        quality: 1,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      setTakingPic(true);

      try {
        const data = await cameraRef.current.takePictureAsync(options);
        const imageData = JSON.stringify(data);
        const currentDate = new Date();
        const isoString = currentDate.toISOString();
        const returnedData = {
          success: true,
          location: location,
          image: {
            uri: data.uri,
            name: `${userInfo.name}_${isoString}.jpg`,
            type: 'image/jpg',
          },
          timestamp: isoString,
        };

        onPicture(returnedData);
        return;
      } catch (err) {
        onPicture({success: false, msg: 'Failed to take picture', err: err});
        setIsLoading(false);
        return;
      } finally {
        setTakingPic(false);
      }
    }
  };

  const handlePermissionLinkPress = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 20, marginTop: 100}}>
      {hasCameraPermission && hasLocationPermission ? (
        <>
          <RNCamera
            ref={cameraRef}
            captureAudio={false}
            style={{
              // flex: 1,
              height: '70%',
              width: '100%',
              borderRadius: 20,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: 'blue',
            }}
            type={RNCamera.Constants.Type.front}
            ratio="4:3"
          />
          {/* <TouchableOpacity
            activeOpacity={0.5}
            style={styles.markutton}
            onPress={takePicture}
            disabled={isLoading}>
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
          </TouchableOpacity> */}
        </>
      ) : (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          Camera and Location permissions are required.{' '}
          <Text style={{color: 'blue'}} onPress={handlePermissionLinkPress}>
            Grant permissions
          </Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btnAlignment: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  markutton: {
    flexDirection: 'row',
    marginHorizontal: 80,
    marginTop: 140,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Camera;
