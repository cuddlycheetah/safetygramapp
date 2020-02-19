<template>

  <div class="chat-overview">
    <v-list three-line>
      <template v-for="option in options">
        <v-list-item :key="option.key" :class="{ dirty: dirty[option.key] }">
          <v-list-item-content>
            <v-list-item-title>
              {{ option.desc }}
              <pre style="font-size:0.75rem;">{{ option.key }}</pre>
            </v-list-item-title>
            <v-list-item-action>
              <v-col cols="12" sm="6" md="6" v-if="option.key === 'password'">
                <v-row cols="12">
                  <v-text-field type="password" placeholder="Specify a new Password" @keyup="markDirty(option.key)" solo v-model="newPassword"></v-text-field>
                    <v-btn @click="changeOption(option.key, newPassword)" large raised v-if="dirty[option.key]">Change Password</v-btn>
                    <v-btn @click="changeOption(option.key, newPassword)" large disabled v-else>Change Password</v-btn>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" v-else>
                <!-- bool -->
                <v-switch v-if="option.type === 'bool'" @change="changeOption(option.key, option.value)" v-model="option.value">Value</v-switch>
                <!-- string -->
                <template v-else-if="option.type === 'string'">
                  <v-row cols="12">
                    <v-text-field v-bind:placeholder="option.default" @keyup="markDirty(option.key)" solo v-model="option.value"></v-text-field>
                    <v-btn @click="changeOption(option.key, option.value)"  x-large raised v-if="dirty[option.key]">Save & Apply</v-btn>
                    <v-btn @click="changeOption(option.key, option.value)"  x-large disabled v-else>Save & Apply</v-btn>
                    <v-btn @click="changeOption(option.key, option.default); option.value = option.default" x-large raised>Reset</v-btn>
                  </v-row>
                </template>
                <!-- filesize -->
                <template v-else-if="option.type === 'filesize'">
                  <v-slider v-model="option.value" step="1048576" min="1048576" max="1572864000" @change="changeOption(option.key, option.value)"></v-slider>
                  <span>{{ option.value / (1024*1024) }} MB</span>
                </template>
                <!-- keepTimeDays -->
                <template v-else-if="option.type === 'keepTimeDays'">
                  <v-row cols="12">
                    <v-slider v-model="option.value" step="1" min="-1" max="365" @change="markDirty(option.key)"></v-slider>
                    <v-btn @click="changeOption(option.key, option.value)" x-large raised v-if="dirty[option.key]">Save & Apply</v-btn>
                    <v-btn @click="changeOption(option.key, option.value)" x-large disabled v-else>Save & Apply</v-btn>
                    <v-btn @click="changeOption(option.key, option.default); option.value = option.default" x-large raised>Reset</v-btn>
                  </v-row>
                  <span v-if="option.value === -1">forever</span>
                  <span v-else>{{ [option.value, 'days'] | duration('humanize') }} {{ option.value }}d</span>
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
      pollInterval: 5000,
    }
  },
  data() {
    return {
      dirty: {},
      newPassword: '',
    }
  },
  watch: {
    dirty(){
    //do something
    }
  },
  methods: {
    markSaved(key) {
      this.$set(this.dirty, key , false)
    },
    markDirty(key) {
      this.$set(this.dirty, key, true)
      //this.dirty[ key ] = true
    },
    changeOption(key, value) {
      return this.$apollo.mutate({
        mutation: changeOption,
        variables: {
          key: key,
          value: value,
        },
      })
      .then(() => {
        this.markSaved(key)
        if (key === 'password') {
          localStorage.clear();
          this.$router.push('/login');
        }
      })
    }
  }
};
</script>
<style>
.dirty {
  background-color: rgba(255,0,0,0.3);
}
</style>