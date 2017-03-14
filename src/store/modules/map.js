/**
 * Created by ardani on 3/10/17.
 */
import * as types from '../mutation-types'
import _ from 'lodash'
import services from '../../../config/services'
import foursquare from 'node-foursquare-venues'
const client = foursquare(services.foursquare.appId, services.foursquare.secretKey)

const state = {
  markers: [],
  status: true,
  loading: false,
  options: {
    zoom: 15,
    infoContent: '',
    infoWinOpen: false,
    infoOptions: {
      pixelOffset: {
        width: 0,
        height: -35
      }
    },
    infoWindowPos: {
      lat: 0,
      lng: 0
    }
  }
}

// getters
const getters = {
  markers: state => state.markers,
  options: state => state.options,
  loading: state => state.loading,
  status: state => state.status
}

const templateInfo = (...params) => {
  let [name, address, isOpen, photo, rating, detail] = params
  return `<img class="venue-photo" src=${photo}>
          <div class="venue-wrapper">
            <div class="venue-title">
              ${name}
              <span class="rating">${rating}</span>
            </div>
            <p class="venue-description">${address}</p>
            <div class="venue-open">
              (Currently ${isOpen})
              <a href="${detail}" class="venue-detail" target="_blank">Details...</a>
            </div>
          </div>`
}
// actions
const actions = {
  fetch ({commit}, {search, position}) {
    commit(types.MARKER_REQUEST)
    let params = {
      ll: `${position.lat},${position.lng}`,
      query: search,
      radius: 3000
    }
    new Promise((resolve, reject) => {
      client.venues.explore(params, (reject, response) => {
        resolve(response)
      })
    }).then((result) => {
      let items = result.response.groups[0].items
      let markers = []
      items.forEach((value) => {
        let address = value.venue.location.formattedAddress
        let tips = value.hasOwnProperty('tips') ? _.first(value.tips) : Object.assign({})
        let photoUrl = tips.hasOwnProperty('photourl') ? tips.photourl : '/static/img/default.png'
        let isOpen = value.venue.hasOwnProperty('hours') ? (value.venue.hours.isOpen ? 'Open' : 'Close') : 'Close'
        let rating = value.venue.hasOwnProperty('rating') ? value.venue.rating : '-'
        let detail = 'http://maps.google.com/maps?&z=10&q=' + value.venue.name.replace(' ', '+') + '&ll=' + `${position.lat}+${position.lng}`
        let name = value.venue.name.toLowerCase()
        markers.push({
          position: {
            lat: value.venue.location.lat,
            lng: value.venue.location.lng
          },
          infoText: templateInfo(name, address.join(','), isOpen, photoUrl, rating, detail)
        })
      })
      commit(types.MARKER_SUCCESS, markers)
    }).catch(() => {
      commit(types.MARKER_FAIL)
    })
  }
}

// mutations
const mutations = {
  [types.MARKER_INFO_CLOSE] (state) {
    state.options.infoWinOpen = false
  },
  [types.MARKER_INFO_SHOW] (state, {marker}) {
    state.options.infoWindowPos = marker.position
    state.options.infoContent = marker.infoText
    state.options.infoWinOpen = true
  },
  [types.MARKER_INFO_TOGGLE] (state, {marker, idx}) {
    state.options.infoWindowPos = marker.position
    state.options.infoContent = marker.infoText
    state.options.infoWinOpen = (state.options.currentMidx === idx) ? !state.options.infoWinOpen : true
    state.options.currentMidx = idx
  },
  [types.MARKER_REQUEST] (state) {
    state.loading = true
    state.markers = []
  },
  [types.MARKER_SUCCESS] (state, markers) {
    state.loading = false
    state.markers = markers
  },
  [types.MARKER_EMPTY] (state) {
    state.markers = []
    let [a] = _.shuffle([1, -1])
    state.options.infoWinOpen = false
    state.options.zoom += a
  },
  [types.MARKER_FAIL] (state) {
    state.status = false
    state.loading = false
    state.markers = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
