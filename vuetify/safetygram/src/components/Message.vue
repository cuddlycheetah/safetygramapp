<template>
</template>

<script>
//import Image from './Image.vue'
export default {
  data() {
    return {};
  },
  props: ["messages"],
  components: {
    //  'chat-image': Image
  },
  computed: {
    username() {
      return this.$store.getters.user.username;
    }
  },
  methods: {
    imageLoad() {
      // this.$emit('imageLoad')
    }
  }
};
</script>

<style>
span.emoji {
  font-size: 20px;
  vertical-align: middle;
  line-height: 2;
}
</style>