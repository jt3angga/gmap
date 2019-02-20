import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux'
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import MuiTable from 'mui-virtualized-table';

import deepPurple from '@material-ui/core/colors/deepPurple';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import blueGrey from '@material-ui/core/colors/blueGrey';

const styles = theme => ({
  root: {
    padding: 0,
    margin: theme.spacing.unit,
    height: '450px'
  },
  cellContents: {
    whiteSpace: 'normal',
  },
  chip: {
    margin: theme.spacing.unit,
  },
  S: {
    margin: 10,
    color: '#fff',
    backgroundColor: red[500],
  },
  D: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
  M: {
    margin: 10,
    color: '#000',
    backgroundColor: yellow[500],
  },
  P: {
    margin: 10,
    color: '#fff',
    backgroundColor: blueGrey[500],
  },
});

class FilterTable extends React.Component {
  constructor (props) {
    super(props)
  }

  render() {
    const { classes } = this.props
    const color = {'P': 'teal', 'S': 'secondary', 'M': 'orange', 'D': 'primary'}
    return (
      <Paper className={classes.root} elevation={1}>
        <AutoSizer>
          {({ width, height }) => (
            <MuiTable
              classes={{
                cellContents: classNames(classes.cellContents),
              }}
              data={this.props.filteredData}
              columns={[
                {
                  name: 'event',
                  header: 'Event',
                  width: 60,
                  cell: d => {
                    let classChip = classNames(classes.chip, classes[d.event.charAt(0)]);
                    return (
                      <Chip className={classChip} label={d.event.charAt(0)} />
                    )
                  },
                  cellProps: { style: { padding: 0, textAlign: 'center' } }
                },
                { 
                  name: 'from', 
                  width: 90, 
                  header: 'Mulai',
                  cell: d => d.from.split(' ').map(item => item+"\n"),
                  cellProps: { style: { padding: 10, whiteSpace: 'pre' } }
                },
                { 
                  name: 'to', 
                  width: 90, 
                  header: 'Selesai',
                  cell: d => d.to.split(' ').map(item => item+"\n"),
                  cellProps: { style: { padding: 10, whiteSpace: 'pre' } }
                },
                { 
                  name: 'duration', 
                  width: 85, 
                  header: 'Durasi',
                  cellProps: { style: { padding: 10, whiteSpace: 'pre' } }
                }
              ]}
              width={width}
              maxHeight={height}
              includeHeaders={true}
              fixedRowCount={1}
              //fixedColumnCount={1}
              isCellHovered={(column, rowData, hoveredColumn, hoveredRowData) =>
                rowData.id && rowData.id === hoveredRowData.id
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

FilterTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    filteredData: state.filteredData
  };
};

export default connect(mapStateToProps)(withStyles(styles)(FilterTable));