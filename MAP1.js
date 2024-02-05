import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { encode as base64Encode } from 'base-64';

import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function Map() {
    const [region, setRegion] = useState({
        latitude: 48.858053,
        longitude: 2.2944991,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

  return (
    <View style={styles.container}>
        <MapView 
        style={styles.map}
            region={region}
            onRegionChangeComplete={(newRegion) => {setRegion(newRegion), console.log(newRegion)}}
        >


      </MapView>
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
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'top',
    },
    container_top: {
        width: '100%',
        padding: 10,
        backgroundColor: 'whitesmoke',
        alignItems: 'left',
        justifyContent: 'top',
    },
    input: {
        marginTop: 2,
        paddingLeft: 5,
        width: '80%',
        height: 30,
        borderWidth: 1,
        borderColor: 'black'
    }
  });
