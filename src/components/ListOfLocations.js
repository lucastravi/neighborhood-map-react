import React from 'react';
import LocationRow from './LocationRow'

// Grabs all the filtered locations and push them the rows array
class ListOfLocations extends React.Component {
    closeList = () => {
      const close = document.getElementsByClassName("close");
      console.log(close);
    }

    render() {
      const rows = [];
      this.props.filteredLocations.forEach((location) => {
        rows.push(
          <LocationRow 
          location={location} 
          key={location.id} 
          openInfoWindowAndBounce={this.props.openInfoWindowAndBounce.bind(this)} 
          marker={this.props.marker} 
          infowindow={this.props.infowindow}
          />
        );
  
      })
      // Return all filtered locations
      return (
        <ul className="locations-list">
          {rows}
        </ul>
      );
    }
  }

  export default ListOfLocations;