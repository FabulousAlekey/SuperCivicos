import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { render } from 'react-dom';

const Home = () => {
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
    if (this.camera) {
      const options = { quality: '720p', maxDuration: 30 };
      const data = await this.camera.recordAsync(options);
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
          this.camera = ref;
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
              this.camera.setState({ flashMode: 2 });

              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? this.camera.setFlash(2)
                  : (this.camera.flashMode = 0)
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
};

async function checkMultiPermissions() {
  const { status, expires, permissions } = await Permissions.getAsync(
    Permissions.CAMERA,
    Permissions.AUDIO_RECORDING
  );
  if (status !== 'granted') {
    alert('Hey! You have not enabled selected permissions');
  }
}

export default Home;
