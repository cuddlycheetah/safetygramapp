<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Safetygram</v-toolbar-title>
                <v-spacer />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn :href="source" icon large target="_blank" v-on="on">
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source Code</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form @submit="login" v-on:submit.prevent="send">
                  <v-text-field
                    id="password"
                    label="Password"
                    v-model="password"
                    prepend-icon="lock"
                    type="password"
                  />
                  <div class="alert alert-danger" v-if="error">
                    <p>{{ error }}</p>
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn type="submit" color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';
import router from '../router'
export default {
  name: "Login",
  props: {
    source: String
  },
  data() {
    return {
      password: '',
      error: '',
    };
  },
  methods: {
    login() {
      axios.post('/api/login', { password: this.password })
      .then(res => {
        //if successfull
        if (res.status === 200) {
          localStorage.setItem('token', res.data)
          router.push('/')
        }
      }, err => {
        console.log(err.response);
        this.error = err.response.data
      })
    }
  }
};
</script>
