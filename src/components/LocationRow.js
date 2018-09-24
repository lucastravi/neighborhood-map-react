import React from 'react';

// This component returns all the rows filtered by the Map component
class LocationRow extends React.Component {
    render() {
      const location = this.props.location;
      return (
        <li className="list-item" onClick={this.props.openInfoWindowAndBounce.bind(this, this.props.location.marker)}>
          <a>{location.name}</a>
        </li>
      );
    }
  }

export default LocationRow;