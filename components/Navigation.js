import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { connect } from 'react-redux'
import { playMap, pauseMap, stopMap, centerMap, polyline, setSpeed } from '../store'
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    
  },
  select: {
    marginLeft: theme.spacing.unit * 2,
  },
  label: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginLeft: '1rem',
    fontSize: '0.875rem',
    lineHeight: 3.3
  },
  switch: {
    marginLeft: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class Navigation extends React.Component {
  constructor (props) {
    super(props)
  }

  playMap = () => {
    if(this.props.playMap) {
      this.props.dispatch(pauseMap())
    }
    else {
      this.props.dispatch(playMap())
    }    
  }

  stopMap = () => {
    this.props.dispatch(stopMap())
  }

  render() {
    const { classes } = this.props
    return (
      <Paper elevation={1}>
        <FormGroup row>
          <IconButton disabled={this.props.realData.length == 0} onClick={this.playMap} className={classes.button} aria-label="Delete" color="primary">
            {
              this.props.playMap ? <PauseIcon /> : <PlayArrowIcon />
            }          
          </IconButton>
          <IconButton disabled={this.props.realData.length == 0 || this.props.stopMap} onClick={this.stopMap} className={classes.button} aria-label="Delete" color="primary">
            <StopIcon />
          </IconButton>
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch checked={this.props.centerMap} onChange={() => this.props.dispatch(centerMap())} value={true} />
            }
            label="Mobil di tengah map"
          />
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch checked={this.props.polyline} onChange={() => this.props.dispatch(polyline())} value={true} />
            }
            label="Polyline"
          />
          <Select
            className={classes.select}
            value={this.props.speed}
            onChange={(e) => this.props.dispatch(setSpeed(e.target.value))}
            inputProps={{
              name: 'speed',
              id: 'Speed',
            }}
          >
            <MenuItem value={10}>10x</MenuItem>
            <MenuItem value={20}>20x</MenuItem>
            <MenuItem value={30}>30x</MenuItem>
            <MenuItem value={40}>40x</MenuItem>
            <MenuItem value={50}>50x</MenuItem>
            <MenuItem value={60}>60x</MenuItem>
            <MenuItem value={70}>70x</MenuItem>
            <MenuItem value={80}>80x</MenuItem>
            <MenuItem value={90}>90x</MenuItem>
            <MenuItem value={100}>100x</MenuItem>
          </Select>
          <label>
            <Typography className={classes.label} variant="body2">Increase Speed</Typography>
          </label>
        </FormGroup>
      </Paper>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    playMap: state.playMap,
    pauseMap: state.pauseMap,
    stopMap: state.stopMap,
    realData: state.realData,
    centerMap: state.centerMap,
    polyline: state.polyline,
    speed: state.speed
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Navigation));