<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
    <Navigation></Navigation>
  </div>
</template>
<script>
  import Navigation from './components/Navigation.vue'
  export default {
    name: 'app',
    components: {
      Navigation
    }
  }
</script>
