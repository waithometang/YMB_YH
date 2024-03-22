<template>
  <div class="app" id="app">
    <publicHead/>
    <router-view></router-view>
  </div>
</template>

<script>
  import publicHead from './components/publicHead/publicHead';

  export default {
    name: 'ybm-yh',
    components: {
      publicHead
    }
  }
</script>

<style>
  /* CSS */
  .app{
    height: 100vh;
  }
</style>
