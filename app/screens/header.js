import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {AuthContext} from '../utils/AuthContext';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

export default function Header() {
  const {logout, userInfo} = useContext(AuthContext);
  const navigation = useNavigation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    logout();
    setDropdownVisible(false);
  };

  const avatarUri = `https://ui-avatars.com/api/?name=${userInfo?.name}&background=BBDEFB&bold=true&rounded=true`;

  return (
    <View style={styles.header}>
      <View style={styles.headerLogo}>
        <Text style={styles.headerText}>App Name</Text>
      </View>
      <TouchableOpacity onPress={toggleDropdown}>
        <Image style={{width: 30, height: 30}} source={{uri: avatarUri}} />
      </TouchableOpacity>
      <Modal
        isVisible={isDropdownVisible}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        backdropOpacity={0}
        onBackdropPress={() => setDropdownVisible(false)}
        style={styles.modalContainer}>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
          {/* Add more menu items as needed */}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Platform.OS === 'ios' || Platform.OS == 'android' ? '100%' : '95vw',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'lightblue',
  },
  headerLogo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 10,
    fontStyle: 'italic',
    fontWeight: '800',
    color: 'darkblue',
  },
  modalContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    margin: 0,
  },
  menuContainer: {
    backgroundColor: 'white',
    width: 180,
  },
  menuItem: {
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
  },
});
