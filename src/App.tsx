import React, { Component, useState } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const url = 'http://localhost:7000;

function AddMarkerToClick({saveMarkers}) {  
  const map = useMapEvents ({
    click(event) {
      const { lat, lng } = event.latlng;
      saveMarkers(lat, lng);
    },
  });
  return null;
}

interface IComponentProps {
}

interface IComponentState {
  latitude? : number;
  longitude? : number;
  locations? : {};
}

class App extends React.Component  < IComponentProps, IComponentState > {
  constructor(props) {
    super(props);
      
    this.state = {
        latitude: 1,
        longitude: 1,
        locations: {}
    };
  }

  saveMarkers = (lat, lng) => {
    this.setState({latitude: lat, longitude: lng});
    console.log(this.state.latitude, this.state.longitude, "inside class state")
  };
  
  getLocation(url) {
    axios.get(url)
    .then(response => {
      const location = response.data.slice(0, 50);
      console.log(location);
      this.setState({ locations: location});

    })
    .catch(error => {
      console.log(error)
    })
  }

  saveLocation= (lat, lng) =>{
    console.log(this.state.latitude, this.state.longitude, "button clicked!");
    axios.post(url, {
      latitude: this.state.latitude.toString(),
      longitude: this.state.longitude.toString(),
      radius_meters : 3
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  } 

  componentDidMount() {
    this.getLocation(url);
}

  render() {
      return (
        <div>
          {this.state.latitude && this.state.longitude &&
        <MapContainer center = {[34.0224, -118.2851]} zoom={14} >
          <TileLayer 
              url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
          <AddMarkerToClick saveMarkers={this.saveMarkers}/>
          <Marker position={[this.state.latitude, this.state.longitude]}> 
            <Popup className="popup">
              Current location: <pre className="popup">{JSON.stringify([this.state.latitude, this.state.longitude], null, 2)}</pre>
              <Button variant="primary" size ="sm" onClick = {() => this.saveLocation(this.state.latitude, this.state.longitude)}>Save Location</Button>{' '}
            </Popup>
          </Marker>
          {Object.keys(this.state.locations).map((key) => (
            <Marker
              key={key}
              position={[this.state.locations[key].latitude, this.state.locations[key].longitude]}>
              <Popup className="popup">
                Saved location: <pre className="popup">{JSON.stringify([this.state.locations[key].latitude, this.state.locations[key].longitude], null, 2)}</pre>
              </Popup>
            </Marker>
            
          ))}
        </MapContainer>}
      </div>

      );
   }
}
export default App;
