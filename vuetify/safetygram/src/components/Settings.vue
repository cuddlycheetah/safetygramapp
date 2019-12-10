<template>

  <div class="chat-overview">
    <v-list three-line>
      <template v-for="option in options">
        <v-list-item :key="option.key">
          <v-list-item-content>
            <v-list-item-title v-html="option.key"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import gql from "graphql-tag";

const FETCH = gql`{
  options: optionMany {
    _id
    key
    desc
    default
    value
  }
}`
export default {
  apollo: {
    options: {
        query: FETCH,
        pollInterval: 5000
    }
  },
  methods: {
  }
};
</script>