import React from 'react'
import { connect } from 'react-redux'
import ReactEcharts from 'echarts-for-react';
import cloneDeep from 'lodash.clonedeep';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => ({option: this.getOption()})

  componentDidUpdate(prevProps) {
    if(prevProps.chartData != this.props.chartData) {
      this.pushChart()
    }
  }

  pushChart () {
    const { chartData } = this.props
    let endIndex = chartData.length - 1
    const option = cloneDeep(this.state.option); // immutable
    let data = option.series[0].data;
    
    data.push(chartData[endIndex].speed);
    
    option.xAxis[0].data.push(chartData[endIndex].date);

    this.setState({
      option,
    });
  }

  render() {
    return (
      <ReactEcharts ref='echarts_react'
        option={this.state.option}
        style={{paddingLeft: 5, paddingTop: 5, paddingBottom: 5}}
      />
    );
  }

  getOption = () => ({
    title: {
      text:'Grafik Kecepatan',
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 60,
      left: 40,
      right: 40,
      bottom:30
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        name: 'KM/Jam',
        max: 80,
        min: 0,
        boundaryGap: [0.2, 0.2]
      }
    ],
    series: [
      {
        name:'Kecepatan',
        type:'line',
        data: [],
        smooth:true,
        itemStyle: {
          normal: {
            lineStyle: {
              shadowColor : 'rgba(0,0,0,0.4)'
            }
          }
        },
      }
    ]
  });
}

const mapStateToProps = state => {
  return {
    chartData: state.chartData,
  }
}

export default connect(mapStateToProps)(Chart);