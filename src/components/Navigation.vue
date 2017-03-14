<template>
  <div class="navigation">
    <div class="shadow-layer"></div>
    <nav id="main-nav">
      <ul>
        <li><router-link class="menu" to="/"><span>Home</span></router-link></li>
        <li><router-link class="menu" to="/about"><span>About</span></router-link></li>
        <li><router-link class="menu" to="/contact"><span>Contact</span></router-link></li>
      </ul>
      <a href="#" class="close-menu">Close<span></span></a>
    </nav>
  </div>
</template>
<script>
  export default {
    name: 'Navigation'
  }
</script>
