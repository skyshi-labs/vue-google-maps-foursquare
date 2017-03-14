/**
 * Created by ardani on 3/10/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import map from './modules/map'
import location from './modules/location'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  actions,
  getters,
  modules: {
    map,
    location
  },
  strict: debug
})
