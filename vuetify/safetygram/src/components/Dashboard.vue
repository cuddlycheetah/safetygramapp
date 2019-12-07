<template>
  <v-container>
    Dashboard
    <pre>{{ stats }}</pre>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

const STATS = gql`{
  stats {
    chats
    users
    messages
    messagesDeleted
    files
    totalDBSize
    totalArchiveSize
  }
}`
export default {
  name: 'Dashboard',
  apollo: {
    stats: {
        query: STATS,
        pollInterval: 1000
    }
  },
};
</script>
