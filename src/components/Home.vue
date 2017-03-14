<template>
  <div id="app">
    <main id="main-content">
      <header class="header">
        <div id="logo">
          <a href="#"><img src="/static/img/logo.svg" alt="Logo"></a>
        </div>
        <div id="search-box">
          <input type="text" autofocus placeholder="Maem Yuk" v-model="search">
        </div>
        <a class="menu-trigger" href="javascript:void(0)">Menu<span></span></a>
      </header>
      <gmap-map
        :center="defaultMarker.position"
        :zoom="zoom"
        ref="gmap"
        style="width: 100%; height: 100%;">
        <gmap-marker
          icon="/static/img/male.png"
          :clickable="true"
          :position="defaultMarker.position"
          :animation="animation"
          @click="showInfo(defaultMarker)">
        </gmap-marker>
        <gmap-info-window
          :options="infoOptions"
          :position="infoWindowPos"
          :opened="infoWinOpen"
          :content="infoContent"
          @closeclick="infoWinOpen=false"/>
        <gmap-cluster>
          <gmap-marker
            v-for="(m,i) in markers"
            icon="/static/img/marker.png"
            :position="m.position"
            :clickable="true"
            :animation="animation"
            @click="toggleInfoWindow(m,i)" key="m">
          </gmap-marker>
        </gmap-cluster>
      </gmap-map>
      </section> <!-- intro -->
    </main>
  </div>
</template>
<script>
  import _ from 'lodash'
  import services from '../../config/services'
  import foursquare from 'node-foursquare-venues'
  const client = foursquare(services.foursquare.appId, services.foursquare.secretKey)

  export default {
    name: 'home',
    mounted () {
      this.getCurrentLocation()
    },
    watch: {
      search: _.debounce(function (val) {
        this.fetchData(val)
      }, 500)
    },
    data () {
      return {
        search: '',
        zoom: 15,
        animation: 4,
        defaultMarker: {
          position: {
            lat: -7.7713527000000004,
            lng: 110.3459022
          },
          infoText: 'You Are Here'
        },
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
        },
        markers: []
      }
    },
    methods: {
      focusMap (lat, lng) {
        this.defaultMarker.position.lat = lat
        this.defaultMarker.position.lng = lng
        let [a] = _.shuffle([1, -1])
        this.zoom += a
        this.$refs.gmap.panTo(this.defaultMarker.position)
      },
      getCurrentLocation () {
        if (navigator.geolocation) {
          new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((location) => {
              resolve([location.coords.latitude, location.coords.longitude])
            }, null, {enableHighAccuracy: true})
          }).then((position) => {
            let [lat, lng] = position
            console.info('browser geolocation active', position)
            this.focusMap(lat, lng)
          })
        } else {
          let position = `https://www.googleapis.com/geolocation/v1/geolocate?key=${services.google.key}`
          fetch(position, {method: 'POST'})
            .then((response) => response.json())
            .then((data) => {
              console.info('google geolocation active', data.location)
              this.focusMap(data.location.lat, data.location.lng)
            })
        }
      },
      toggleInfoWindow (marker, idx) {
        this.infoWindowPos = marker.position
        this.infoContent = marker.infoText
        this.infoWinOpen = (this.currentMidx === idx) ? !this.infoWinOpen : true
        this.currentMidx = idx
      },
      showInfo (marker) {
        this.infoWindowPos = marker.position
        this.infoContent = marker.infoText
        this.infoWinOpen = true
      },
      resetPosition () {
        this.$refs.gmap.panTo(this.defaultMarker.position)
        this.infoWinOpen = false
        this.markers = []
        setTimeout(() => {
          let [a] = _.shuffle([1, -1])
          this.zoom += a
        }, 1000)
      },
      fetchData (val) {
        if (!val.length) {
          this.resetPosition()
          return false
        }
        let position = this.defaultMarker.position
        let params = {
          ll: `${position.lat},${position.lng}`,
          query: val,
          radius: 3000
        }
        this.$Progress.start()
        this.markers = []
        new Promise((resolve, reject) => {
          client.venues.explore(params, (err, response) => {
            if (err) {
              reject(err)
            } else {
              resolve(response)
            }
          })
        }).then((result) => {
          let items = result.response.groups[0].items
          let markers = []
          this.infoWinOpen = false
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
              infoText: this.templateInfo(name, address.join(','), isOpen, photoUrl, rating, detail)
            })
            this.markers = markers
            this.$Progress.finish()
          })
        })
      },
      templateInfo (name, address, isOpen, photo, rating, detail) {
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
    }
  }
</script>
