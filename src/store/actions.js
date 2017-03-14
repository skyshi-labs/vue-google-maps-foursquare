/**
 * Created by ardani on 3/10/17.
 */
import * as types from './mutation-types'

export const toggleInfoWindow = ({commit}, marker, idx) => {
  commit(types.MARKER_INFO_TOGGLE, {
    marker: marker,
    idx: idx
  })
}

export const showInfo = ({commit}, marker) => {
  commit(types.MARKER_INFO_SHOW, {
    marker: marker
  })
}

export const closeInfo = ({commit}) => {
  commit(types.MARKER_INFO_CLOSE)
}

export const emptyMarker = ({commit}) => {
  commit(types.MARKER_EMPTY)
}
