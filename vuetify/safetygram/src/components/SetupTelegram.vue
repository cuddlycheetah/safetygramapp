<template>
  <v-container>
    <v-layout row>
      <!-- Phone Number -->
      <v-flex sm6 v-if="stats.telegramStatus === 'authorizationStateWaitPhoneNumber'">
        <vue-tel-input sm4 v-bind="bindProps" v-model="phoneNumber"></vue-tel-input>
        <v-btn @click="submitPhoneNumber">Continue</v-btn>
      </v-flex>
      <!-- Code -->
      <v-flex sm6 v-else-if="stats.telegramStatus === 'authorizationStateWaitCode'">
        <v-col cols="12" sm="6" md="3">
          <v-text-field label="Code" placeholder="-----" v-model="code" solo></v-text-field>
        </v-col>
        <v-btn @click="submitCode">Continue</v-btn>
      </v-flex>
      <!-- Password -->
      <v-flex sm6 v-else-if="stats.telegramStatus === 'authorizationStateWaitPassword'">
        <v-col cols="12" sm="6" md="6">
          <v-text-field label="Password" placeholder="***" type="password" v-model="password" solo></v-text-field>
        </v-col>
        <v-btn @click="submitPassword">Continue</v-btn>
      </v-flex>
      <!-- Ready -->
      <v-flex sm6 v-else-if="stats.telegramStatus === 'authorizationStateReady'">
        <v-btn v-bind:to="'/'">Go To Dashboard</v-btn>
      </v-flex>
      <!-- Invalid -->
      <v-flex sm6 v-else>
        Invalid Authorization State: {{ stats.telegramStatus }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import { VueTelInput } from 'vue-tel-input'

const STATS = gql`{
  stats {
    telegramStatus
  }
}`
const setupPhoneNumber = gql`
  mutation setupPhoneNumber($phoneNumber: String!) {
    setupPhoneNumber(phoneNumber: $phoneNumber) {
      telegramStatus
    }
  }
`;
const setupCode = gql`
  mutation setupCode($code: String!) {
    setupCode(code: $code) {
      telegramStatus
    }
  }
`;
const setupPassword = gql`
  mutation setupPassword($password: String!) {
    setupPassword(password: $password) {
      telegramStatus
    }
  }
`;

export default {
  name: 'SetupTelegram',
  components: {
    VueTelInput,
  },
  apollo: {
    stats: {
        query: STATS,
        pollInterval: 1000
    }
  },
  data() {
    return {
      bindProps: {
        mode: 'international',
        ignoredCountries: [
          'in', // we dont like this crap here
        ],
        validCharactersOnly: true,
        required: true,
      },

      phoneNumber: '',
      code: '',
      password: '',
    }
  },
  methods: {
    submitPhoneNumber() {
      this.$apollo.mutate({
        mutation: setupPhoneNumber,
        variables: {
          phoneNumber: this.phoneNumber,
        },
      });
    },
    submitCode() {
      this.$apollo.mutate({
        mutation: setupCode,
        variables: {
          code: this.code,
        },
      });
    },
    submitPassword() {
      this.$apollo.mutate({
        mutation: setupPassword,
        variables: {
          password: this.password,
        },
      });
    },
  }
};
</script>
