import React from 'react';
import axios from 'axios';
import ListOfLocations from './components/ListOfLocations';
import Filter from './components/Filter';
import {locations} from './data/mapLocations';
import {styles} from './styles/mapStyles';

// The class boss, the whole application is managed here
class App extends React.Component {
  //Creates the states
  constructor(props) {
    super(props);
    this.state = {
      'locations': locations,
      'filterText': '',
      'filteredLocations': locations,
    }
  
    this.handleFilter = this.handleFilter.bind(this);
  };

  // Filter the locations based on the search and passes hides markers and list items filtered
  handleFilter(filterText, filteredLocations){
    this.setState({
      'filterText': filterText
    });
    var filteredLocations = [];
    this.props.locations.forEach((location) => {
      if (location.name.toLowerCase().indexOf(filterText.toLowerCase()) != -1) {
        location.marker.setVisible(true);
        filteredLocations.push(location);
        return;
      }
      if (location.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
        location.marker.setVisible(false);
        return;
      }
    })
    this.setState({
      'filteredLocations': filteredLocations
    })
  }

  // Renders the map after loads the script from Google Maps API
  componentDidMount() {
    this.renderMap();
  };

  // Loads the script asynchronously inside the application
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCZE_FgPzxQPEBiCP-cT4-92mJgtSfYfVE&callback=initMap")
    window.initMap = this.initMap
  };

  // Initialize the map and locate the markers
  initMap = () => {

    // Create the Map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -29.378678, lng: -50.8756029},
      zoom: 14,
      styles: styles,
    })

    // The infowindow is closed and the animation stopped when the map is clicked
    map.addListener('click', () => {
      this.closeInfoWindowAndStopBounce();
    })

    // Create the InfoWindow variable
    var infowindow = new window.google.maps.InfoWindow();

    // When the infowindow is closed this function set the infowindow state to null and stop the marker's animation
    infowindow.addListener('closeclick', () => {
      this.stopBounceWhenCloseClick();
    })

    // Creates the markers array
    var markers=[];
    // Make a loop through all the locations list
    this.state.locations.map(location => {
      // Create the markers
      var marker = new window.google.maps.Marker({
        position: {lat: location.lat, lng: location.lng},
        map: map,
        name: location.name,
        address: ''
      })
      // Pop-up the infowindow when the marker is clicked
      marker.addListener('click', () => { 
        this.setState({
          'infowindow': infowindow
        });      
        this.openInfoWindowAndBounce(marker);
    })
      markers.push(marker);
      location.marker = marker;
    });
    /*
    Defines a default preloaded marker and infowindow in case of the user clicks on the lists 
    as soon as he open the application
    */
    this.setState({
      'marker': markers[0],
      'infowindow': infowindow,
    })
  }
      /*
      1) When a marker is clicked, first, the infowindow from the previous marker is closed,
      then the marker is animated and get the state of current marker, which will be useful
      to stop the animation when the infowindow is closed.
      2) The new infowindow is open and the function getMarkerInfo is fired to the current marker.
      */
      openInfoWindowAndBounce = (marker) => {
        this.closeInfoWindowAndStopBounce();
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
          'marker': marker,
        })
        this.getMarkerInfo(marker);
        this.state.infowindow.open(this.state.map, marker);
        console.log(marker);
      }

      /*
      Check if the marker is the current state, then set its animation 
      to null and clear the 'marker' state and close its infowindow, this last line
      of code will be useful when we close the infowindow by clicking on the map.
      */
      closeInfoWindowAndStopBounce = () => {
        if (this.state.marker) {
          this.state.marker.setAnimation(null)
          this.setState({
            'marker': '',
          })
          this.state.infowindow.close();
        }
      }
      
      /*
      When the close button of the infowindow is clicked the marker stops bouncing
      and the marker state is set to empty
      */
      stopBounceWhenCloseClick = () => {
        if (this.state.marker) {
          this.state.marker.setAnimation(null)
          this.setState({
            'marker': '',
          })
        }
      }

      /*
      Get the Foursquare data from the locations contained in the locations database.
      This function uses axios to get the name, address and category of the venues
      */
      getMarkerInfo = (marker) => {
        var clientId = "J1O3U502MXU2IE2G5VAHFSGTA4PLWMF5Z3BZ34XBKVRZDS40";
        var clientSecret = "R54OYCW22W0JPWMPOCQRYR3JCGGSVRS0CHLOQB4KBXEYYF1A";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

        axios.get(url)
        .then(
          response => {
            var infowindowName = response.data.response.venues[0].name;
            var infowindowAddress = response.data.response.venues[0].location.address;
            var infowindowCategorie = response.data.response.venues[0].categories[0].name;
            this.state.infowindow.setContent('<span class="info-title">' + infowindowName + '</span><br><span class="info-address">Address: ' + infowindowAddress + '</span><br><span class="info-category">Category: '  + infowindowCategorie + '</span>');
          })
        .catch(
          error => {
          console.log("Error! " + error)
        })
    }

  // Render the Map application
  render() {
    return (
      <main>
        <Filter 
        onFilterTextChange={this.handleFilter}
        filterText={this.state.filterText}
        />
        <ListOfLocations 
        locations={this.props.locations} 
        filteredLocations={this.state.filteredLocations}
        filterText={this.state.filterText} 
        openInfoWindowAndBounce={this.openInfoWindowAndBounce} 
        marker={this.state.marker} 
        infowindow={this.state.infowindow}
        />
        <div id="map"></div>
      </main>
    );
  }
};

// This function reads the script to use the Google Maps API
function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
};

export default App;
