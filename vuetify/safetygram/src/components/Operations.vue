<template>

  <div class="chat-overview">
    <v-list three-line>
      <template v-for="operation in operationStatusMany">
        <v-list-item :key="operation._id">
          <v-list-item-content>
            <v-list-item-title>
              <v-progress-circular :indeterminate="!operation.cancel && !operation.finished" :value="operation.progress"></v-progress-circular>
              {{ operation.text }}
              <pre style="font-size:0.75rem;">{{ operation.type }}</pre>
            </v-list-item-title>
            <v-list-item-action>
              <v-col cols="12" sm="6" md="6" v-if="operation.type === 'importChat'">
                <v-row cols="12">
                  <v-btn v-if="!operation.cancel && !operation.finished" @click="cancelOperation(operation._id)" large>Cancel</v-btn>
                  <v-btn v-else color="warning" @click="deleteOperation(operation._id)" x-large raised>delete</v-btn>
                </v-row>
              </v-col>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="operation._id+'_d'"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import gql from "graphql-tag";

const FETCH = gql`{
  operationStatusMany {
    _id
    type
    progress
    cancel
    finished
    text
    error
    link
  }
}`
const cancelOperation = gql`
  mutation cancelOperation($key: MongoID!) {
    cancelOperation: operationStatusUpdateOne(filter: {_id: $key}, record: { cancel: true } ) {
      recordId
    }
  }
`;
const deleteOperation = gql`
  mutation deleteOperation($key: MongoID!) {
    operationStatusRemoveById(_id: $key) { recordId }
  }
`
export default {
  apollo: {
    operationStatusMany: {
      query: FETCH,
      pollInterval: 1000,
    }
  },
  methods: {
    cancelOperation(operationId) {
      return this.$apollo.mutate({
        mutation: cancelOperation,
        variables: {
          key: operationId
        },
      })
      .then(() => this.$apollo.queries.operationStatusMany.refetch())
    },
    deleteOperation(operationId) {
      return this.$apollo.mutate({
        mutation: deleteOperation,
        variables: {
          key: operationId
        },
      })
      .then(() => this.$apollo.queries.operationStatusMany.refetch())
    }
  }
};
</script>