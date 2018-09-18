import React from 'react';
import ReactMapboxGL, { Marker } from 'react-mapbox-gl';

const MapGL = ReactMapboxGL({
    accessToken: 'pk.eyJ1IjoiZWRnYXJqZXJlbXkiLCJhIjoiY2psM25nenhmMjMwYzN2cWs1NDdpeXZyMCJ9.T-PUQmpNdO3cMRGeMtfzQQ'
});

export default class Map extends React.Component {

    state = {
        markers: [],
        center: [124.85221914419435, 1.494208940690413],
        zoom: [12]
    }

    updateMarker(markers = []) {
        this.setState({ markers });
    }

    render() {
        const { markers, center, zoom } = this.state;

        return (
            <MapGL center={center} zoom={zoom} {...this.props} style="mapbox://styles/edgarjeremy/cjl437z2s57vh2ql8zpw6r2vw" containerStyle={{
                height: '500px'
            }}>
                {markers.map((marker, i) => (
                    <Marker key={i} coordinates={marker.coordinates} anchor={marker.anchor}>
                        {/* {marker.childrens} */}
                        <div className="marker-container">
                            <span>username</span>
                            <img alt="" src={require('../assets/stand-person.png')} />
                        </div>
                    </Marker>
                ))}
            </MapGL>
        );
    }

}