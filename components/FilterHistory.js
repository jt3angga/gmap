import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import { connect } from 'react-redux'
import { setFilteredData, setChartData, setRealData, setGroupedData, stopMap } from '../store'
import moment from 'moment'
import MySnackbarContentWrapper from './MySnackbarContentWrapper';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  form: {
    paddingBottom: theme.spacing.unit * 2,
  }
});

class FilterHistory extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      from: '2018-12-21 07:50:00',
      to: '2018-12-21 10:00:00',
      formatedData: [],
      loading: false,
      fromValid: true,
      toValid: true,
      snackbarOpen: false,
      message: ''
    }
  }

  isDateTimeValid = (datetime) => {
    return moment(datetime, 'YYYY-MM-DD HH:mm:ss', true).isValid()
  }

  showHistories = () => {
    const { from, to } = this.state

    if(from > to) {
      this.setState({snackbarOpen: true, message: 'Tanggal dari harus lebih kecil dari tanggal sampai!'})
      return
    }

    this.setState({loading: true})
    axios.get('/data', {
      params: {
        start_date: from,
        end_date: to
      }
    })
    .then((rows) => {
      if(rows.data.data.length > 0) {
        this.reformatData(rows.data.data)
        this.setState({loading: false})
        this.props.dispatch(stopMap())
      }
      else {
        this.setState({snackbarOpen: true, message: 'Tidak ada data pada periode ini', loading: false})
      }
    })    
  }

  reformatData = (data) => {
    const { dispatch } = this.props
    
    let newData = []
    let realData = []
    let chartData = []
    let groupedData = []
    let row = 0;
    let rowG = 0;

    let lastIndex = data.length - 1

    data.map((item, i) => {
      if(data.hasOwnProperty((i-1)) && (data[i].event == data[(i-1)].event)) {
        if (newData.hasOwnProperty(row)) {
          newData[row].to = item.date

          let s = moment(newData[row].from);
          let e = moment(item.date);
          let durations = moment.duration(e.diff(s));
          let d = durations._data

          let hari = d.days > 0 ? d.days+' hari ' : ''
          let jam = d.hours > 0 ? d.hours+' jam ' : ''
          let menit = d.minutes > 0 ? d.minutes+' menit ' : ''
          let detik = d.seconds > 0 ? d.seconds+' detik ' : ''
          let duration = hari+jam+menit+detik
          newData[row].duration = duration
        }
        else {
          newData[row] = {
            id: row, 
            from: item.date, 
            to: item.date, 
            speed: item.speed, 
            lat: parseFloat(item.latitude.split(',').join(''))/* .toFixed(6) */, 
            lng: parseFloat(item.longitude.split(',').join(''))/* .toFixed(6) */, 
            event: item.event, 
            duration: item.date
          }
        }

      }
      else {
        row++;
        let start = newData.hasOwnProperty(row-1) ? newData[row-1].to : item.date

        let s = moment(start);
        let e = moment(item.date);
        let durations = moment.duration(e.diff(s));
        let d = durations._data
        let hari = d.days > 0 ? d.days+' hari ' : ''
        let jam = d.hours > 0 ? d.hours+' jam ' : ''
        let menit = d.minutes > 0 ? d.minutes+' menit ' : ''
        let detik = d.seconds+' detik'
        let duration = hari+jam+menit+detik

        newData[row] = {
          id: row, 
          from: start, 
          to: item.date, 
          speed: item.speed, 
          lat: parseFloat(item.latitude.split(',').join(''))/* .toFixed(6) */, 
          lng: parseFloat(item.longitude.split(',').join(''))/* .toFixed(6) */, 
          event: item.event, 
          duration: duration
        }
      }

      /* if(data.hasOwnProperty((i-1)) && ((data[i].latitude == data[(i-1)].latitude) && (data[i].longitude == data[(i-1)].longitude))) {
        let s = moment(groupedData[rowG].from);
        let e = moment(item.date);
        let duration = e.diff(s,'seconds');


        let speed = item.speed == 0 ? 1 : item.speed

        groupedData[rowG].to = item.date
        groupedData[rowG].speed = speed
        groupedData[rowG].duration = duration
      }
      else {
        rowG++;
        let start = groupedData.hasOwnProperty(rowG-1) ? groupedData[rowG-1].to : item.date
        let s = moment(start);
        let e = moment(item.date);
        let duration = e.diff(s,'seconds');

        let speed = item.speed == 0 ? 1 : item.speed

        groupedData[rowG] = {
          id: rowG, 
          from: start, 
          to: item.date, 
          speed: speed, 
          lat: parseFloat(item.latitude.split(',').join('')), 
          lng: parseFloat(item.longitude.split(',').join('')),
          duration: duration
        }
      } */

      realData.push({
        id: i,
        date: item.date, 
        lat: parseFloat(item.latitude.split(',').join(''))/* .toFixed(6) */, 
        lng: parseFloat(item.longitude.split(',').join(''))/* .toFixed(6) */, 
        speed: item.speed, 
        event: item.event
      })

    })

    if(realData.hasOwnProperty(0)) {
      this.props.dispatch(setChartData({date: realData[0].date, speed: realData[0].speed}))
    }

    const refotmatData = newData.filter(val => val)
    this.setState({formatedData: refotmatData}, () => {
      dispatch(setFilteredData(this.state.formatedData))
    })

    const dataGrouped = groupedData.filter(val => val)
    dispatch(setGroupedData(dataGrouped))

    dispatch(setRealData(realData))
  }

  render() {
    const { classes } = this.props
    const { from , to } = this.state
    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" gutterBottom>
          Filter Data
        </Typography>
        <Divider />
        <FormControl fullWidth className={classes.form} error={!this.state.fromValid}>
          <InputLabel htmlFor="history_from">Dari</InputLabel>
          <Input
            id="history_from"
            value={from}
            autoComplete="off"
            onChange={this.handleChangeFrom}
          />
          {
            !this.state.fromValid && <FormHelperText id="history_from-text">Masukan dengan format YYYY-MM-DD HH:mm:ss</FormHelperText>
          }
        </FormControl>
        <FormControl fullWidth className={classes.form} error={!this.state.toValid}>
          <InputLabel htmlFor="history_from">Sampai</InputLabel>
          <Input
            id="history_to"
            value={to}
            autoComplete="off"
            onChange={this.handleChangeTo}
          />
          {
            !this.state.toValid && <FormHelperText id="history_to-text">Masukan dengan format YYYY-MM-DD HH:mm:ss</FormHelperText>
          }
        </FormControl>
        <FormControl fullWidth className={classes.form}>
          <Button 
            disabled={this.state.loading || !this.state.fromValid || !this.state.toValid}
            onClick={this.showHistories} 
            margin="normal" 
            variant="contained" 
            size="large" 
            color="primary" 
            className={classes.margin}
          >
            {`${this.state.loading ? 'Loading' : 'Show Histories'}`}
          </Button>
        </FormControl>
          {/* <TextField margin="normal" value={from} onChange={this.handleChangeFrom} label="From" />
          <TextField margin="normal" value={to} onChange={(e) => this.setState({to: e.target.value})} label="To" />
          <Button disabled={this.state.loading} onClick={this.showHistories} margin="normal" variant="contained" size="large" color="primary" className={classes.margin}>
           
            {`${this.state.loading ? 'Loading' : 'Show Histories'}`}
          </Button>
        </FormControl>*/}
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={this.state.snackbarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackbar}
        >
          <MySnackbarContentWrapper
            onClose={this.handleCloseSnackbar}
            variant="error"
            message={this.state.message}
          />
        </Snackbar>
      </Paper>
    )
  }

  handleCloseSnackbar = () => {
    this.setState({snackbarOpen: false})
  }

  handleChangeFrom = (e) => {
    this.setState({from: e.target.value})
    let isValid = this.isDateTimeValid(e.target.value)
    if(isValid) {
      this.setState({fromValid: true})
    }
    else {
      this.setState({fromValid: false})
    }
  }

  handleChangeTo = (e) => {
    this.setState({to: e.target.value})
    let isValid = this.isDateTimeValid(e.target.value)
    if(isValid) {
      this.setState({toValid: true})
    }
    else {
      this.setState({toValid: false})
    }

  }
}

FilterHistory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect()(withStyles(styles)(FilterHistory));