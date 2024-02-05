import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { encode as base64Encode } from 'base-64';

import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

import {
    accelerometer,
    gyroscope,
    setUpdateIntervalForType,
    SensorTypes
  } from "react-native-sensors";
  import { map, filter } from "rxjs/operators";

export default function Sensor() {
    const [speed, setSpeed] = useState()
    setUpdateIntervalForType(SensorTypes.accelerometer, 400); // defaults to 100ms

    const subscription = accelerometer
    .pipe(map(({ x, y, z }) => x + y + z), filter(speed => speed > 20))
    .subscribe(
        speed => {console.log(`You moved your phone with ${speed}`), setSpeed(speed)},
        error => {
        console.log("The sensor is not available");
        }
    );


  return (
    <View style={styles.container_top}>
        <Text>Sensor information :</Text>
        <Text style={styles.display}> Speed {speed} </Text>
        <Text style={styles.display}>  {"des"} </Text>
    </View>
  );
}


const styles = StyleSheet.create({
    map: {
        border: 3, 
        borderColor: 'black', 
        width: '100%', 
        height: '100%'    
    },
    display: {
        fontSize: 12
    },
    container_top: {
        width: '100%',
        padding: 10,
        backgroundColor: 'red',
        alignItems: 'left',
        justifyContent: 'top',
    }
  });
