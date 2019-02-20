import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { openDrawer, closeDrawer, openBottombar, closeBottombar } from '../store';

import { connect } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Map from '../components/Map';

import Fab from '@material-ui/core/Fab';
import Bottombar from '../components/Bottombar';

class Index extends React.Component {
  toggleDrawer = () => {
    const { dispatch } = this.props
    this.props.drawerOpen ? dispatch(closeDrawer()) : dispatch(openDrawer())
  }

  toggleBottombar = () => {
    const { dispatch } = this.props
    this.props.bottomBarOpen ? dispatch(closeBottombar()) : dispatch(openBottombar())
  }

  render() {
    const { classes, drawerOpen, bottomBarOpen } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />        
        <Sidebar/>
        <Bottombar/>
        <main className={classes.content}>
          <Map/>
          <Fab 
            onClick={this.toggleDrawer} 
            size="small" 
            color="primary" 
            aria-label="Toggle Drawer" 
            className={classNames(drawerOpen ? classes.fabShift : classes.fab)}>
            {
              drawerOpen ? <ChevronLeftIcon/> : <ChevronRightIcon/>
            }
          </Fab>

          <Fab 
            onClick={this.toggleBottombar} 
            size="small" 
            color="primary" 
            aria-label="Toggle Bottombar" 
            className={classNames(bottomBarOpen ? classes.fabBottomShift : classes.fabBottom)}>
            {
              bottomBarOpen ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>
            }
          </Fab>
          
        </main>
      </div>
    );
  }
}

const drawerWidth = 350;
const drawerHeight = 300

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  fabShift: {
    margin: theme.spacing.unit,
    position: 'absolute',
    top: `45%`,
    zIndex: theme.zIndex.drawer + 1,
    left: `calc(${drawerWidth}px - 30px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  fab: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginLeft: 0,
    position: 'absolute',
    top: `45%`,
    lef: 5,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  fabBottomShift: {
    margin: theme.spacing.unit,
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    bottom: `calc(${drawerHeight}px - 30px)`,
    left: `60%`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  fabBottom: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginBottom: 0,
    position: 'absolute',
    bottom: 5,
    left: `50%`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    drawerOpen: state.drawerOpen,
    bottomBarOpen: state.bottomBarOpen
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Index));