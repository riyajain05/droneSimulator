import React, { Component } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline
} from "@react-google-maps/api";

class App extends Component {
  state = {
    dronePaths: [], // Store multiple drone paths
    currentPath: [], // Store the path of the currently selected drone
    isSimulating: false, // Is the simulation running
    currentTime: 0 // Current simulation time
  };

  // Function to parse input string and update currentPath state
  parseInputString = (input) => {
    const path = input
      .trim()
      .split(",")
      .map((coord) => {
        const [lat, lng] = coord.split(" ");
        return { lat: parseFloat(lat), lng: parseFloat(lng) };
      });
    this.setState({ currentPath: path });
  };

  // Function to simulate drone motion
  simulateDrones = () => {
    const { currentPath } = this.state;
    if (currentPath.length === 0) {
      alert("Please input a drone path before simulating.");
      return;
    }

    let index = 0;
    const intervalId = setInterval(() => {
      if (index < currentPath.length) {
        this.setState({ currentTime: index });
        index++;
      } else {
        clearInterval(intervalId);
        this.setState({ isSimulating: false });
      }
    }, 1000); // Adjust the interval as needed
    this.setState({ isSimulating: true });
  };

  // Function to handle play/pause button click
  handlePlayPause = () => {
    const { isSimulating } = this.state;
    if (isSimulating) {
      // Pause the simulation
      clearInterval(this.intervalId);
      this.setState({ isSimulating: false });
    } else {
      // Resume the simulation
      this.simulateDrones();
    }
  };

  // Function to handle seek functionality
  handleSeek = (time) => {
    this.setState({ currentTime: time });
  };

  // Function to add a new drone path
  addDronePath = () => {
    const { dronePaths, currentPath } = this.state;
    if (currentPath.length === 0) {
      alert("Please input a drone path before adding.");
      return;
    }

    const updatedPaths = [...dronePaths, currentPath];
    this.setState({ dronePaths: updatedPaths, currentPath: [] });
  };

  render() {
    const { currentPath, dronePaths, isSimulating, currentTime } = this.state;

    return (
      <div className="App">
        <div>
          <input
            type="text"
            placeholder="Enter drone path (latitude,longitude)"
            onChange={(e) => this.parseInputString(e.target.value)}
          />
        </div>
        <div>
          <button onClick={this.addDronePath}>Add Drone Path</button>
          <button onClick={this.simulateDrones}>Simulate</button>
          <button onClick={this.handlePlayPause}>
            {isSimulating ? "Pause" : "Play"}
          </button>
        </div>
        <div>
          <input
            type="range"
            min={0}
            max={dronePaths.length - 1}
            value={currentTime}
            onChange={(e) => this.handleSeek(parseInt(e.target.value, 10))}
          />
        </div>
        <LoadScript googleMapsApiKey="YOUR_API_KEY">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: 0, lng: 0 }}
            zoom={2}
          >
            {dronePaths.map((path, index) => (
              <Polyline
                key={index}
                path={path}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 2
                }}
              />
            ))}
            {currentPath.map((position, index) => (
              <Marker key={index} position={position} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    );
  }
}

export default App;
