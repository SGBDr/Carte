import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { encode as base64Encode } from 'base-64';

import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import Sensor from './Sensor.js'

export default function Map() {
    const [region, setRegion] = useState({
      latitude: 48.858053,
      longitude: 2.2944991,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });
    const [departure, setDeparture] = useState({});
    const [destination, setDestination] = useState({});
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
          
          // original api
          /*const response = await axios.get(
            `http://router.project-osrm.org/route/v1/driving/${departure.longitude},${departure.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
          );*/

          // capgemini server api
          const response = await axios.get(
            `http://apifm.grisel.eu/route/v1/driving/${departure.longitude},${departure.latitude};${destination.longitude},${destination.latitude}?steps=true&geometries=geojson&exclude=motorway&overview=full&alternatives=true&annotations=nodes`,
            config
          );

          roads = []
          for(let r of response.data.routes) {
            const coordinates = r.geometry.coordinates.map(x => {return {latitude: x[1], longitude: x[0]}});
            roads.push(coordinates)
          }
          console.log(roads.length)
          
          setRouteCoordinates(roads);
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
            coord = {latitude: parseFloat(response.data[0].lat), longitude: parseFloat(response.data[0].lon)}
            coordd = {latitude: parseFloat(response.data[0].lat), longitude: parseFloat(response.data[0].lon), latitudeDelta: 0.05, longitudeDelta: 0.05,}
            
            setDep(firstResult);
            setDeparture(coord)
            setRegion(coordd)
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
            coord = {latitude: parseFloat(response.data[0].lat), longitude: parseFloat(response.data[0].lon)}

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

        { departure.latitude && departure.longitude && ( 
          <Marker coordinate={departure} pinColor="green"  title="Departure" />
        )}
        { destination.latitude && destination.longitude && (
          <Marker coordinate={destination} pinColor="blue" title="Destination" />
        )}

        {routeCoordinates.length > 0 && (
          routeCoordinates.map(
            road => (
              <Polyline
              coordinates={road}
              strokeWidth={3}
              strokeColor="red"
            />
            )
          )
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
