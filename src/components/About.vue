<template>
  <div id="app">
    <main id="main-content">
      <section id="intro">
        <header class="header">
          <div id="logo">
            <a href="#"><img src="/static/img/logo.svg" alt="Logo"></a>
          </div>
          <div id="search-box"></div>
          <a class="menu-trigger" href="javascript:void(0)">Menu<span></span></a>
        </header>
        <div class="content-wrapper">
          <p>
            <img src="/static/img/skyshi.png" class="logo-skyshi">
            <br/>
            This is a simple project to learn about the collaboration of Vue, Google Maps, and Foursquare.
            This project is developed by Skyshi.
            Skyshi is a software development company in Yogyakarta, Indonesia.
            We can help you to scale up your startup business by using latest technologies.
            We can help your startup create your MVP (Minimum Viable Products),
            Build your mobile apps, Extend your existing team, and Launch new features.
            Skyshi established since 2009 with 30 and more talented workers. we can develop 5 startups every month.
            We always learn something new and share it with others.
          </p>
          <blockquote>
            A person who never made a mistake never tried anything new<br/><br/>
            <span>- Einstein -</span>
          </blockquote>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
  export default {
    name: 'About',
    data () {
      return {
        msg: 'About'
      }
    }
  }
</script>
