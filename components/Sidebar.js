import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import classNames from 'classnames';
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles';
import FilterHistory from './FilterHistory';
import FilterTable from './FilterTable';

class Sidebar extends Component {
  render () {
    const { classes, drawerOpen } = this.props;
    return (
      <Drawer
        variant="persistent"
        classes={{
          paper: classNames(classes.drawerPaper),
        }}
        open={drawerOpen}
      >
        {/* <div className={classes.toolbarIcon}></div> */}
        <Divider />
        <FilterHistory/>
        <FilterTable/>
      </Drawer>
    )   
  }
}

const drawerWidth = 350;

const styles = theme => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }  
});

const mapStateToProps = state => {
  return {
    drawerOpen: state.drawerOpen
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Sidebar));