<template>
  <iframe v-bind:src="iframeUrl" style="width: 100%; height: 100%; overflow: hidden;">
  </iframe>
</template>

<script>
export default {
  computed: {
    iframeUrl: function() {
      return '/api/interactive?Authorization=' + localStorage.getItem('token')
    }
  }
};
</script>