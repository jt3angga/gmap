import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer';
import classNames from 'classnames';
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles';
import Navigation from './Navigation';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HistoryGps from '../components/HistoryGps';
import Chart from './Chart';

/* import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./Chart'), {
  ssr: false
}) */

class Bottombar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'chart'
    }
  }
  render () {
    const { classes, drawerOpen, bottomBarOpen } = this.props;
    return (
      <Drawer
        variant="persistent"
        anchor="bottom"
        classes={{
          paper: classNames(drawerOpen ? classes.drawerPaper : classes.drawerPaperFull),
        }}
        open={bottomBarOpen}
      >
        <Navigation/>
        <Tabs
          value={this.state.value}
          onChange={(e, v) => this.setState({value: v})}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            value="chart"
            label="Grafik"
          />
          <Tab
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            value="history"
            label="History GPS"
          />
        </Tabs>
        {this.state.value === 'chart' && <Chart/>}
        {this.state.value === 'history' && <HistoryGps />}
      </Drawer>
    )   
  }
}

const drawerHeight = 300;

const styles = theme => ({
  drawerPaper: {
    marginLeft: 350,
    marginRight: 5,
    height: drawerHeight
  },
  drawerPaperFull: {
    marginLeft: 0,
    marginRight: 0,
    height: drawerHeight
  },

  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

const mapStateToProps = state => {
  return {
    bottomBarOpen: state.bottomBarOpen,
    drawerOpen: state.drawerOpen
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Bottombar));