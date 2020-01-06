<template>
  <v-container>
    <v-row>
      <v-col cols="12" xs="12" sm="4" md="3">
        <v-card v-ripple>
          <v-card-title>Database Size:</v-card-title>
          <v-card-text>{{ stats.totalDBSize }} MB</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="4" md="3">
        <v-card v-ripple>
          <v-card-title>Chats:</v-card-title>
          <v-card-text>{{ stats.chats }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="4" md="3">
        <v-card v-ripple>
          <v-card-title>Users:</v-card-title>
          <v-card-text>{{ stats.users }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="4" md="3">
        <v-card v-ripple>
          <v-card-title>Deleted Messages:</v-card-title>
          <v-card-text>{{ stats.messagesDeleted }} / {{ stats.messages }} total Messages</v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
      return this.stats ? this.stats.telegramStatus !== 'authorizationStateReady' : false
    }
  }
};
</script>
