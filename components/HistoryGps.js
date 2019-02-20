import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import { connect } from 'react-redux'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import MuiTable from 'mui-virtualized-table';

import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
  root: {
    padding: 0,
    margin: 0,
    height: '450px'
  },
  cellSelected: {
    backgroundColor: grey[700],
    color: '#ffffff'
  },
});

class HistoryGps extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        selectedRowIds: [props.gpsIndex]
    }
  }

  componentDidUpdate(prevProps) {
      if(prevProps.gpsIndex !== this.props.gpsIndex) { 
        this.setState({selectedRowIds: [this.props.gpsIndex]})
      }
  }

  render() {
    const { classes } = this.props
    return (
      <Paper className={classes.root} elevation={1}>
        <AutoSizer>
          {({ width, height }) => (
            <MuiTable
              classes={{
                cellSelected: classNames(classes.cellSelected),
              }}
              data={this.props.realData}
              fitHeightToRows
              rowHeight={30}
              columns={[
                { 
                  name: 'date', 
                  width: 150, 
                  header: 'Tanggal Jam',
                  cellProps: { style: { padding: 10 } }
                },
                { 
                    name: 'lat', 
                    width: 150, 
                    header: 'Lat',
                    cellProps: { style: { padding: 10 } }
                },
                { 
                    name: 'lng', 
                    width: 150, 
                    header: 'Lng',
                    cellProps: { style: { padding: 10 } }
                },
                { 
                    name: 'speed', 
                    width: 100, 
                    header: 'Speed (KPJ)',
                    cellProps: { style: { padding: 10 } }
                },
              ]}
              width={width}
              maxHeight={height}
              includeHeaders={true}
              fixedRowCount={1}
              //fixedColumnCount={1}
              /* isCellHovered={(column, rowData, hoveredColumn, hoveredRowData) =>
                rowData.id && rowData.id === hoveredRowData.id
              } */
              isCellSelected={(column, rowData) =>
                this.state.selectedRowIds.some(id => rowData && rowData.id === id)
              }
              cellProps={{ padding: 'none' }}
              style={{ backgroundColor: 'white', whiteSpace: 'pre' }}
              cellProps={(column, rowData) =>
                column.event === 'PARKING'
                  ? { style: { backgroundColor: 'rgba(255,0,0,.5)', color: 'white' } }
                  : {}
              }
            />
          )}
        </AutoSizer>        
      </Paper>
    );
  }
}

HistoryGps.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    realData: state.realData,
    gpsIndex: state.gpsIndex
  };
};

export default connect(mapStateToProps)(withStyles(styles)(HistoryGps));