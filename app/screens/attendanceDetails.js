import React, {useContext} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../utils/AuthContext';

const AttendanceDetails = ({route}) => {
  const {description, timestamp, imageData} = route.params;
  console.log(description, timestamp, imageData);

  const {userInfo} = useContext(AuthContext);
  // const imageData = image;
  // console.log(imageData);
  const formatIsoDate = isoDateString => {
    const date = new Date(isoDateString);
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    return date.toLocaleString('en-US', options);
  };
  const capitalizeLetters = string => {
    return string.toUpperCase();
  };

  const handleClick = () => {
    onBackToCamera();
  };
  return (
    <View style={styles.baseView}>
      <Text style={styles.text}>Marked Succesfully</Text>
      <Image source={{uri: imageData?.uri}} style={styles.imageView} />
      <Text style={styles.name}>{capitalizeLetters(userInfo?.name)}</Text>
      <View style={styles.timeStamp}>
        <Icon name="watch" size={15} color="steelblue" />
        <Text style={styles.info}>{formatIsoDate(timestamp)}</Text>
      </View>
      <View style={styles.timeStamp}>
        <Icon name="map" size={15} color="steelblue" />
        <Text style={styles.info}>{description}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.button}
        onPress={handleClick}>
        <Icon name="camera" size={20} color="white" />
        <Text style={{color: 'white', marginLeft: 10, fontWeight: 'bold'}}>
          Take Another Photo
        </Text>
      </TouchableOpacity>
    </View>
  );

  // : (
  //   <View>
  //     <Text style={styles.text}>{imageData?.msg}</Text>
  //     <TouchableOpacity
  //       activeOpacity={0.5}
  //       style={styles.closeButton}
  //       onPress={handleClick}>
  //       <Text
  //         style={{
  //           color: 'white',
  //           marginLeft: 10,
  //           fontWeight: 'bold',
  //           fontSize: 15,
  //         }}>
  //         Close
  //       </Text>
  //     </TouchableOpacity>
  //   </View>
  // );
};

const styles = StyleSheet.create({
  baseView: {
    // flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  text: {
    alignSelf: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  imageView: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  name: {
    alignSelf: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  info: {
    fontSize: 15,
    color: 'black',
  },
  button: {
    flexDirection: 'row',
    // marginHorizontal: 30,
    height: 40,
    // marginVertical: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 130,
    height: 40,
    // marginVertical: 20,

    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeStamp: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 20,
    // marginHorizontal: 30,
  },
});

export default AttendanceDetails;
