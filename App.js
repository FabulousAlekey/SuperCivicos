//import * as React from 'react';
//import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Permissions from 'expo-permissions';

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { render } from 'react-dom';
import Settings from './screens/settings';



function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil de usuario y seguimiento de videoreportes</Text>
    </View>
  );
}

async function checkMultiPermissions() {
  const { status, expires, permissions } = await Permissions.getAsync(
    Permissions.CAMERA,
    Permissions.AUDIO_RECORDING
  );
  if (status !== 'granted') {
    alert('Hey! You have not enabled selected permissions');
  }
}

function cam() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    //console.log(location.coords.latitude+','+location.coords.longitude)
    text = location.coords.latitude + ',' + location.coords.longitude;
  }

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      );
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }

    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    (async () => {
      const { status } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cam.camera) {
      const options = { quality: '720p', maxDuration: 30 };
      const data = await cam.camera.recordAsync(options);
      console.log(data.uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 0.7 }}
        flashMode={0}
        type={type}
        ref={(ref) => {
          cam.camera = ref;
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.2,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 10,
                marginLeft: 10,
                color: 'white',
              }}
            >
              {' '}
              Flip{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.2,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onLongPress={() => {
              takePicture();
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 10,
                marginRight: 10,
                color: 'white',
              }}
            >
              {' '}
              Grabar{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 0.2,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              cam.camera.setState({ flashMode: 2 });

              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? cam.camera.setFlash(2)
                  : (cam.camera.flashMode = 0)
              );

              //console.log('flash '+flash)
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 10,
                marginRight: 10,
                color: 'white',
              }}
            >
              {' '}
              Flash{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <View
        style={{
          flex: 0.3,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 10,
        }}
      >
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home';
            } else if (route.name === 'Explorar') {
              iconName = focused ? 'ios-map' : 'ios-map';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Explorar' component={Settings} />
        <Tab.Screen name='Perfil' component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
