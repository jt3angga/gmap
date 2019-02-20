import React from 'react';
import {Style, StyleHover} from './MarkerStyle';


class Marker extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    anchorEl: null,
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };


  render () {
    let style = this.props.$hover ? StyleHover : Style

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    if(this.props.$hover) {
      this.handlePopoverOpen
    }

    return (
      <span style={style}><img width="30" src={`/static/truck.png`}/></span>

    )
  }
}

export default Marker;
