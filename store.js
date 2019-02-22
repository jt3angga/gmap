import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const initialState = {
  drawerWidth: 300,
  drawerOpen: true,
  bottomBarOpen: true,
  playMap: false,
  pauseMap: false,
  stopMap: true,
  filteredData: [],
  realData: [],
  groupedData: [],
  centerMap: true,
  speed: 10,
  polyline: true,
  chartData: [],
  gpsIndex: 0,
  mapFullyLoaded: false
}

export const actionTypes = {
  SET_MAP_FULLY_LOADED: 'SET_MAP_FULLY_LOADED',
  DRAWER_CLOSE: 'DRAWER_CLOSE',
  DRAWER_OPEN: 'DRAWER_OPEN',
  BOTTOMBAR_CLOSE: 'BOTTOMBAR_CLOSE',
  BOTTOMBAR_OPEN: 'BOTTOMBAR_OPEN',
  PLAY_MAP: 'PLAY_MAP',
  STOP_MAP: 'STOP_MAP',
  PAUSE_MAP: 'PAUSE_MAP',
  CENTER_MAP: 'CENTER_MAP',
  POLYLINE: 'POLYLINE',
  SET_FILTERED_DATA: 'SET_FILTERED_DATA',
  SET_REAL_DATA: 'SET_REAL_DATA',
  SET_GROUPED_DATA: 'SET_GROUPED_DATA',
  SET_GPS_INDEX: 'SET_GPS_INDEX',
  SET_SPEED: 'SET_SPEED',
  SET_CHART_DATA: 'SET_CHART_DATA',
  PUSH_CHART_DATA: 'PUSH_CHART_DATA',
  CLEAR_CHART_DATA: 'CLEAR_CHART_DATA',
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MAP_FULLY_LOADED:
      return Object.assign({}, state, {
        mapFullyLoaded: true,
      })
    case actionTypes.DRAWER_CLOSE:
      return Object.assign({}, state, {
        drawerOpen: false,
      })
    case actionTypes.DRAWER_OPEN:
      return Object.assign({}, state, {
        drawerOpen: true,
      })
    case actionTypes.BOTTOMBAR_CLOSE:
      return Object.assign({}, state, {
        bottomBarOpen: false,
      })
    case actionTypes.BOTTOMBAR_OPEN:
      return Object.assign({}, state, {
        bottomBarOpen: true,
      })
    case actionTypes.SET_FILTERED_DATA:
      return Object.assign({}, state, {
        filteredData: action.data,
      })
    case actionTypes.SET_REAL_DATA:
      return Object.assign({}, state, {
        realData: action.data,
      })
    case actionTypes.SET_GROUPED_DATA:
      return Object.assign({}, state, {
        groupedData: action.data,
      })
    case actionTypes.SET_GPS_INDEX:
      return Object.assign({}, state, {
        gpsIndex: action.index,
      })
    case actionTypes.SET_SPEED:
      return Object.assign({}, state, {
        speed: action.speed,
      })
    case actionTypes.PLAY_MAP:
      return Object.assign({}, state, {
        playMap: true,
        pauseMap: false,
        stopMap: false
      })
    case actionTypes.PAUSE_MAP:
      return Object.assign({}, state, {
        playMap: false,
        pauseMap: true,
        stopMap: false
      })
    case actionTypes.STOP_MAP:
      return Object.assign({}, state, {
        playMap: false,
        pauseMap: false,
        stopMap: true
      })    
    case actionTypes.CENTER_MAP:
      return Object.assign({}, state, {
        centerMap: !state.centerMap,
      })    
    case actionTypes.POLYLINE:
      return Object.assign({}, state, {
        polyline: !state.polyline,
      })    
    case actionTypes.PUSH_CHART_DATA:
      return {
        ...state,
        chartData: [...state.chartData, action.chartData]
      }
    case actionTypes.SET_CHART_DATA:
      return Object.assign({}, state, {
        chartData: [action.data],
      })
    case actionTypes.CLEAR_CHART_DATA:
      return Object.assign({}, state, {
        chartData: [],
      })
    default:
      return state
  }
}

// ACTIONS
export const closeDrawer = () => dispatch => {
  return dispatch({ type: actionTypes.DRAWER_CLOSE })
}

export const openDrawer = () => dispatch => {
  return dispatch({ type: actionTypes.DRAWER_OPEN })
}

export const closeBottombar = () => dispatch => {
  return dispatch({ type: actionTypes.BOTTOMBAR_CLOSE })
}

export const openBottombar = () => dispatch => {
  return dispatch({ type: actionTypes.BOTTOMBAR_OPEN })
}

export const playMap = () => dispatch => {
  return dispatch({ type: actionTypes.PLAY_MAP })
}

export const stopMap = () => dispatch => {
  return dispatch({ type: actionTypes.STOP_MAP })
}

export const pauseMap = () => dispatch => {
  return dispatch({ type: actionTypes.PAUSE_MAP })
}

export const centerMap = () => dispatch => {
  return dispatch({ type: actionTypes.CENTER_MAP })
}

export const polyline = () => dispatch => {
  return dispatch({ type: actionTypes.POLYLINE })
}

export const setFilteredData = (data) => dispatch => {
  return dispatch({ type: actionTypes.SET_FILTERED_DATA, data: data })
}

export const setRealData = (data) => dispatch => {
  return dispatch({ type: actionTypes.SET_REAL_DATA, data: data })
}

export const setGroupedData = (data) => dispatch => {
  return dispatch({ type: actionTypes.SET_GROUPED_DATA, data: data })
}

export const setGpsIndex = (index) => dispatch => {
  return dispatch({ type: actionTypes.SET_GPS_INDEX, index: index })
}

export const setSpeed = (speed) => dispatch => {
  return dispatch({ type: actionTypes.SET_SPEED, speed: speed })
}

export const setChartData = (data) => dispatch => {
  return dispatch({ type: actionTypes.SET_CHART_DATA, data: data })
}

export const pushChartData = (chartData) => dispatch => {
  return dispatch({ type: actionTypes.PUSH_CHART_DATA, chartData: chartData })
}

export const clearChartData = () => dispatch => {
  return dispatch({ type: actionTypes.CLEAR_CHART_DATA })
}

export const setMapFullyLoaded = (data) => dispatch => {
  return dispatch({ type: actionTypes.SET_MAP_FULLY_LOADED })
}

export function initializeStore (initialState = initialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}