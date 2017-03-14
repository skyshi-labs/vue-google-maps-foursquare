/**
 * Created by ardani on 3/10/17.
 */

import * as types from '../mutation-types'

const state = {
  location: {
    position: {
      lat: -7.7713527000000004,
      lng: 110.3459022
    },
    infoText: 'You Are Here'
  }
}

const getters = {
  location: state => state.location
}

const getPosition = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

const actions = {
  setPosition ({commit}) {
    getPosition()
      .then((location) => {
        let position = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
        console.log(position)
        commit(types.LOCATION_SET, {position})
      })
      .catch((err) => {
        console.error(err.message)
      })
  }
}

// mutations
const mutations = {
  [types.LOCATION_SET] (state, {position}) {
    state.location.position = position
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
