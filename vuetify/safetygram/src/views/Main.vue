<template>
  <v-app id="keep">
    <v-app-bar app clipped-left color="blue">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span class="title ml-3 mr-5">
        Safetygram&nbsp;
        <span class="font-weight-light">Beta</span>
      </span>
      <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search" />
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-4" />
          <v-list-item v-else-if="item.href" :key="i" link v-bind:href="item.href" target="_blank">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else-if="item.link" :key="i" link v-bind:to="item.link">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider dark class="my-4" />
        <v-list-item>
          <v-list-item-action>
          <v-switch v-model="$vuetify.theme.dark"></v-switch>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">Dark Theme</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider dark class="my-4" />
        <v-list-item link @click="logout()">
          <v-list-item-action>
            <v-icon>logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    items: [
      { icon: "dashboard", text: "Dashboard", link: "/" },
      { icon: "developer_mode", text: "Raw Query Interface", link: "/rqi" },
      //{ divider: true },
      //{ heading: "Labels" },
      //{ icon: "add", text: "Create new label", link: "" },
      { divider: true },
      { icon: "chat", text: "Chats", link: "/chats" },
      //{ icon: "archive", text: "Archive", link: "/archive" },
      { icon: "delete", text: "Deleted Messages", link: "/deletedmsgs" },
      { divider: true },
      { icon: "settings", text: "Settings", link: "/settings" },
      //{ icon: "arrow_downward", text: "Downloads", link: "/downloads" },
      //{ icon: "folder", text: "Files", link: "/files" },
      { divider: true },
      { icon: "new_releases", text: "News & Updates", href: "https://t.me/Safetygram" },
      { icon: "help", text: "Help (Wiki)", href: "https://github.com/cuddlycheetah/safetygram/wiki/Help" },
      { icon: "live_help", text: "Support Chat", href: "https://t.me/joinchat/AmGzaUvpit2VP-g4V5NDdA" },
    ]
  }),
  created() {
    if (localStorage.getItem('token') === null) {
      this.$router.push('/login')
    }
  },
  mounted() {
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
