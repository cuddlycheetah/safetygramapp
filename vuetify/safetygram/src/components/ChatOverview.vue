<template>

  <div class="chat-overview">
    <v-list three-line>
      <v-skeleton-loader v-if="this.$apollo.queries.chatOverview.loading" class="mx-auto" type="list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line,list-item-avatar-three-line"></v-skeleton-loader>
      <template v-for="chat in chatOverview">
        <v-list-item :key="chat._id" v-bind:to="'/chats/' + chat._id">
          <v-list-item-avatar>
            <v-img v-bind:src="'/api/file/' + chat.photo"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="chat.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import gql from "graphql-tag";

const FETCH = gql`{
  chatOverview {
    _id
    type
    name
    photo
    user
  }
}`
export default {
  apollo: {
    chatOverview: {
      query: FETCH,
      pollInterval: 5000
    }
  },
};
</script>