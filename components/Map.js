import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {connect} from 'react-redux';
import { setGpsIndex, pushChartData, setChartData, setMapFullyLoaded } from '../store'

const defaultLat = -6.187539
const defaultLng = 106.734737

class Map extends Component {
  constructor (props) {
    super(props)    
    let lat = props.realData[0] ? props.realData[0].lat : defaultLat
    let lng = props.realData[0] ? props.realData[0].lng : defaultLng
    this.state = {
      center: [parseFloat(lat), parseFloat(lng)],
      lat: defaultLat,
      lng: defaultLng,
      zoom: 17,
      apiReady: false,
      map: null,
      googlemaps: null,
      marker: null,
      finish_marker: null,
      polyline: null,
      currentIndexPosition: 0,
      speed: 0,
      delay: 100,
      icon: {
        path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
        scale: 0.6,
        fillColor: "#bf360c", //<-- Car Color, you can change it 
        fillOpacity: 1,
        strokeWeight: 1,
        anchor: null,
        rotation: 0
      },
      target: 0,
      keepCenterMap: props.centerMap,
      speedIncrease: props.speed
    }; 
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if((prevProps.playMap != this.props.playMap) && this.props.playMap === true) {
      this.playHistory()
    }
    else if((prevProps.pauseMap != this.props.pauseMap) && this.props.pauseMap === true) {
      this.pauseHistory()
    }
    else if((prevProps.stopMap != this.props.stopMap) && this.props.stopMap === true) {      
      this.stopHistory()
    }
    if (prevProps.realData !== this.props.realData) {
      this.setCenterMap()
    }
    if (prevProps.centerMap !== this.props.centerMap) {
      this.setState({keepCenterMap: this.props.centerMap})
    }
    if (prevProps.polyline !== this.props.polyline) {
      this.drawPolyline(this.state.map, this.state.googlemaps)
    }
    if (prevProps.speed !== this.props.speed) {
      this.setState({speedIncrease: this.props.speed})
    }
  }

  playHistory = () => {
    let dataPlans = this.props.realData
    let plans = []

    dataPlans.map((item, index) => {
      let Curspeed = item.speed == 0 ? 1 : item.speed
      plans.push([parseFloat(item.lat), parseFloat(item.lng), Curspeed, item.speed, item.date])
    })

    this.animateMarker(this.state.marker, plans, this.state.speed)
  }

  animateMarker = (marker, coords) => {
    const { map, googlemaps } = this.state
    
    coords.push([parseFloat(this.props.realData[0].lat), parseFloat(this.props.realData[0].lng), 0]);
    
    const goToPoint = () => {
      let lat = marker.position.lat();
      let lng = marker.position.lng();
      
      let step = (coords[this.state.target][2] * 1000 * this.state.delay) / ((60*60*1000) / this.state.speedIncrease) // in meters 
      // let step = (this.state.delay) / 100

      let dest = new googlemaps.LatLng(
      coords[this.state.target][0], coords[this.state.target][1]);

      let distance = googlemaps.geometry.spherical.computeDistanceBetween(dest, marker.position); // in meters

      let heading = googlemaps.geometry.spherical.computeHeading(marker.position, dest);

      let icon = marker.getIcon();
      icon.rotation = heading;
      marker.setIcon(icon);
      
      let numStep = distance / step;
      let i = 0;
      let deltaLat = (coords[this.state.target][0] - lat) / numStep;
      let deltaLng = (coords[this.state.target][1] - lng) / numStep;
      
      const moveMarker = () =>
      {
        lat += deltaLat;
        lng += deltaLng;
        i += step;
        
        if (i < distance) {
          marker.setPosition(new googlemaps.LatLng(lat, lng));
          this.state.keepCenterMap && this.state.map.setCenter({lat: parseFloat(lat), lng: parseFloat(lng)})
          this.moveMarker = setTimeout(moveMarker, this.state.delay);
        }
        else {
          marker.setPosition(dest);
          this.props.dispatch(setGpsIndex((this.state.target+1)))

          this.setState({
            target: this.state.target + 1
          })

          let chartPush = {date: coords[this.state.target][4], speed: coords[this.state.target][3]}
          this.props.dispatch(pushChartData(chartPush))

          if (this.state.target == coords.length){ 
            this.setState({
              target: 0
            })
            clearTimeout(this.moveMarker)
            clearTimeout(this.goToPoint)
            this.props.dispatch(setGpsIndex(0))
          }            
          this.goToPoint = setTimeout(goToPoint, this.state.delay);
        }
      }
      moveMarker();
    }
    goToPoint();
  }

  pauseHistory = () => {
    clearTimeout(this.moveMarker)
    clearTimeout(this.goToPoint)
  }

  stopHistory = () => {
    clearTimeout(this.moveMarker)
    clearTimeout(this.goToPoint)
    this.setState({target: 0})
    this.props.dispatch(setGpsIndex(0))
    this.renderMarker({lat: this.props.realData[0].lat, lng: this.props.realData[0].lng}, this.state.map, this.state.googlemaps)
    let chartData = {date: this.props.realData[0].date, speed: this.props.realData[0].speed}
    this.props.dispatch(setChartData(chartData))
  }

  setCenterMap = () => {
    const {map, googlemaps} = this.state
    let plansData = this.props.realData
    let lat = plansData[this.state.currentIndexPosition].lat
    let lng = plansData[this.state.currentIndexPosition].lng

    this.state.map.setCenter({lat: parseFloat(lat), lng: parseFloat(lng)})
    this.state.map.setZoom(18)

    let StartLatLng = {lat: parseFloat(plansData[0].lat), lng: parseFloat(plansData[0].lng)}
    this.renderMarker(StartLatLng, map, googlemaps)

    let LatLng = {lat: parseFloat(plansData[(plansData.length - 1)].lat), lng: parseFloat(plansData[(plansData.length - 1)].lng)}
    this.setFinishMarker(LatLng, map, googlemaps)

    this.setState({lat: lat, lng: lng}, this.drawPolyline(this.state.map, this.state.googlemaps))
  }

  apiHasLoaded(map, googlemaps) {
    if (map && googlemaps) {
     this.setState({
       apiReady: true,
       map: map,
       googlemaps: googlemaps
     });
     this.props.dispatch(setMapFullyLoaded())
    }
  }

  drawPolyline = (map, googlemaps) => {
    let plansData = this.props.realData

    if(this.props.polyline) {      
      let plans = []
      plansData.map((item, index) => {      
        plans.push({lat: parseFloat(item.lat), lng: parseFloat(item.lng)})
      })
      if(this.state.polyline) {
        this.state.polyline.setMap(null);
      }    
      
      this.state.polyline = new googlemaps.Polyline({
        path: plans,
        geodesic: true,
        strokeColor: '#ef6c00',
        strokeOpacity: 0.7,
        geodesic: true,
        strokeWeight: 2
      })

      this.state.polyline.setMap(map);
    }
    else {
      if(this.state.polyline) {
        this.state.polyline.setMap(null);
      }    
    }
  }

  renderMarker = (LatLng, map, googlemaps) => {
    if(this.state.marker) {
      this.state.marker.setMap(null);
    }
    this.setState({
      icon: {...this.state.icon, anchor: new googlemaps.Point(25, 25)}
    }, () => {
      this.setState({
        marker: new googlemaps.Marker({
          position: LatLng,
          icon: this.state.icon,
          map: map
        })
      })
    })   
  }

  setFinishMarker = (LatLng, map, googlemaps) => {
    if(this.state.finish_marker) {
      this.state.finish_marker.setMap(null);
    }    
    let image = {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      size: new googlemaps.Size(20, 32),
      origin: new googlemaps.Point(0, 0),
      anchor: new googlemaps.Point(0, 32)
    };
    let shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    
    this.setState({
      finish_marker: new googlemaps.Marker({
        position: LatLng,
        map: map,
        icon: image,
        shape: shape,
        title: 'Finish Point',
      })
    })      
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyCH1triM4hiocALh_cNE86FEVvZmf9h_-0',
            libraries: ['places', 'drawing', 'geometry'],
            region: 'ID'
          }}
          yesIWantToUseGoogleMapApiInternals
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
        >
        </GoogleMapReact>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    realData: state.realData,
    playMap: state.playMap,
    pauseMap: state.pauseMap,
    stopMap: state.stopMap,
    centerMap: state.centerMap,
    speed: state.speed,
    polyline: state.polyline
  };
}

export default connect(mapStateToProps)(Map);