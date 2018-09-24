import React from 'react';

// Handles the filter component
class Filter extends React.Component {
    constructor(props) {
      super(props);
      this.handleFilter = this.handleFilter.bind(this);
    }
  
    handleFilter(e) {
      this.props.onFilterTextChange(e.target.value);
    }
  
    render() {
      return (
        <form>
          <input 
          type="text" 
          placeholder="Search:" 
          value={this.props.filterText} 
          onChange={this.handleFilter}></input>
        </form>
      );
    }
  
  }

export default Filter;