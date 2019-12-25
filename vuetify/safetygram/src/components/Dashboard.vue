<template>
  <v-container>
    Dashboard
    <pre>{{ stats }}</pre>

    <v-bottom-sheet v-model="showSetupHint" persistent fullscreen>
      <v-sheet class="text-center" height="200px">
        <div class="py-3">
          Telegram has not been configured yet. Please follow the Setup.
        </div>
        <v-btn class="mt-6" color="error" to="/setup">Setup</v-btn>
      </v-sheet>
    </v-bottom-sheet>
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
    telegramStatus
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
  computed: {
    showSetupHint: function(){
      console.log(this.stats)
      return this.stats ? this.stats.telegramStatus !== 'authorizationStateReady' : false
    }
  }
};
</script>
