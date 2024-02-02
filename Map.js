import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { encode as base64Encode } from 'base-64';

import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function Map() {
    const [region, setRegion] = useState();
    const [departure, setDeparture] = useState();
    const [destination, setDestination] = useState();
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [dep, setDep] = useState("")
    const [des, setDes] = useState("")

    const findRoad = async () => {
        try {
          const username = "followme";
          const password = "followme";
          const credentials = base64Encode(`${username}:${password}`);
          const authHeader = `Basic ${credentials}`;
          const config = {
            headers: {
              Authorization: authHeader,
            },
          };

          const response = await axios.get(
            `http://apifm.grisel.eu/route/v1/driving/${departure.longitude},${departure.latitude};${destination.longitude},${destination.latitude}?steps=true&geometries=geojson&exclude=motorway&overview=full&alternatives=true&annotations=nodes`,
            config
          );
  
          const coordinates = response.data.routes[0].geometry.coordinates.map(x => {return {latitude: x[1], longitude: x[0]}});
          
          setRouteCoordinates(coordinates);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
    };

    const searchAddressDeparture = async (text) => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
          );
    
          if (response.data && response.data.length > 0) {
            const firstResult = response.data[0].display_name;
            coord = {latitude: response.data[0].lat, longitude: response.data[0].lon}

            setDep(firstResult);
            setDeparture(coord)
          }
        } catch (error) {
          console.error('Error searching departure address:', error);
        }
    }

    const searchAddressDestination = async (text) => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
          );
    
          if (response.data && response.data.length > 0) {
            const firstResult = response.data[0].display_name;
            coord = {latitude: response.data[0].lat, longitude: response.data[0].lon}

            setDes(firstResult);
            setDestination(coord)
          }
        } catch (error) {
          console.error('Error searching desti address:', error);
        }
    }

  return (
    <View style={styles.container}>
        <View style={styles.container_top}>
            <Text>Travel information :</Text>
            <TextInput style={styles.input} placeholder='From' onChangeText={(text) => searchAddressDeparture(text)}/>
            <Text style={styles.display}>  {dep} </Text>
            <TextInput style={styles.input} placeholder='To' onChangeText={(text) => searchAddressDestination(text)}/>
            <Text style={styles.display}>  {des} </Text>
            <Button
                onPress={findRoad}
                title="Find Road"
                color="#841584"
            />
        </View>
        <MapView style={styles.map}
            region={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        >

        <Marker coordinate={departure} pinColor="green"  title="Departure" />
        <Marker coordinate={destination} pinColor="blue" title="Destination" />

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={3}
            strokeColor="black"
          />
        )}
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
      marginTop: 40,
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
