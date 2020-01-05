<template>

  <div class="chat-overview">
    <v-list three-line>
      <template v-for="option in options">
        <v-list-item :key="option.key">
          <v-list-item-content>
            <v-list-item-title>
              {{ option.desc }}
              <pre style="font-size:0.8rem;">{{ option.key }}</pre>
            </v-list-item-title>
            <v-list-item-action>
              <v-col cols="12" sm="6" md="6" v-if="option.key === 'password'">
                <v-text-field type="password" placeholder="Specify a new Password" solo v-model="newPassword"></v-text-field>
                <v-btn @click="changeOption(option.key, newPassword)">Change Password(and Logout)</v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="6" v-else>
                <!-- bool -->
                <v-switch v-if="option.type === 'bool'" @change="changeOption(option.key, option.value)" v-model="option.value">Value</v-switch>
                <!-- string -->
                <template v-else-if="option.type === 'string'">
                  <v-text-field v-bind:placeholder="option.default" solo v-model="option.value"></v-text-field>
                  <v-btn @click="changeOption(option.key, option.value)">Change Value</v-btn>
                </template>
                <!-- filesize -->
                <template v-else-if="option.type === 'filesize'">
                  <v-slider v-model="option.value" step="1048576" min="1048576" max="1572864000" @change="changeOption(option.key, option.value)"></v-slider>
                  <span>{{ option.value / (1024*1024) }} MB</span>
                </template>
                <!-- keepTimeDays -->
                <template v-else-if="option.type === 'keepTimeDays'">
                  <v-slider v-model="option.value" step="1" min="0" max="1000" @change="changeOption(option.key, option.value)"></v-slider>
                  <span>{{ [option.value, 'days'] | duration('humanize') }}</span>
                </template>

                <!-- anything else -->
                <span v-else>{{ option.type }}{{ option.value }}</span>
              </v-col>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="option.key+'_d'"></v-divider>
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
    type
    desc
    default
    value
  }
}`
const changeOption = gql`
  mutation changeOption($key: String!, $value: JSON!) {
    optionUpdateOne(filter: { key: $key }, record: { value: $value }) {
      record {
        key
        type
        default
        desc
        value
      }
    }
  }
`;
export default {
  apollo: {
    options: {
      query: FETCH,
      pollInterval: 5000
    }
  },
  data() {
    return {
      newPassword: '',
    }
  },
  methods: {
    changeOption(key, value) {
      console.log('changeOption', key, value)
      this.$apollo.mutate({
        mutation: changeOption,
        variables: {
          key: key,
          value: value,
        },
      })
      .then(() => {
        if (key === 'password') {
          localStorage.clear();
          this.$router.push('/login');
        }
      })
    }
  }
};
</script>