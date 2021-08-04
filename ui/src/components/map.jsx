import { Card } from "framework7-react";
import { Loader } from "google-maps";
import React, { Component, createRef } from "react";

class Map extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = createRef();
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const loader = new Loader("AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg", {});

    const google = await loader.load();
    const map = new google.maps.Map(this.mapContainer.current, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }

  render() {
    return (
      <Card>
        <div ref={this.mapContainer}></div>
      </Card>
    );
  }
}

export default Map;
