<template>
  <div class="chat-container">
    <div style="display: flex; flex-direction: column-reverse;">
        <div class="message" :class="{ own: item.isOutgoing, deleted: item.deleted, [item.content._ ]: true }" v-for="(item, $index) in messages" :key="$index">
          <div class="content">
            <div class="deletedChatInfo" v-if="item.peer !== item.from">
              <ApolloQuery
                :query="require('../graphql/NameResolutionChat.gql')"
                :variables="{ peer: item.peer }"
              >
                <template v-slot="{ result: { loading, error, data } }">
                  <!-- Loading -->
                  <div v-if="loading" class="loading apollo">Loading Chat Name...</div>
                  <!-- Error -->
                  <div v-else-if="error" class="error apollo">An error occurred peer</div>
                  <!-- Result -->
                  <div v-else-if="data" class="result apollo">{{ data.name.name || `${ data.name.firstName } ${ data.name.lastName }` }}</div>
                  <!-- No result -->
                  <div v-else class="no-result apollo">peer={{ item.peer }}</div>
                </template>
              </ApolloQuery>
            </div>
            <div class="forwardedfrom" v-if="item.forwardedFrom">
              <ApolloQuery
                :query="item.peerType == 'messageForwardOriginUser' ? require('../graphql/NameResolutionUser.gql') : require('../graphql/NameResolutionChat.gql')"
                :variables="{ peer: item.forwardedFrom }"
              >
                <template v-slot="{ result: { loading, error, data } }">
                  <!-- Loading -->
                  <div v-if="loading" class="loading apollo">Loading Name...</div>
                  <!-- Error -->
                  <div v-else-if="error" class="error apollo">{{ item.forwardedName }}</div>
                  <!-- Result -->
                  <div v-else-if="data" class="result apollo">{{ data.name.name || `${ data.name.firstName } ${ data.name.lastName }` }}</div>
                  <!-- No result -->
                  <div v-else class="no-result apollo">{{ item.forwardedName }}</div>
                </template>
              </ApolloQuery>
            </div>
            <div class="username">
              <ApolloQuery
                :query="item.fromType == 'User' ? require('../graphql/NameResolutionUser.gql') : require('../graphql/NameResolutionChat.gql')"
                :variables="{ peer: item.from }"
              >
                <template v-slot="{ result: { loading, error, data } }">
                  <!-- Loading -->
                  <div v-if="loading" class="loading apollo">Loading Name...</div>
                  <!-- Error -->
                  <div v-else-if="error" class="error apollo">An error occurred</div>
                  <!-- Result -->
                  <div v-else-if="data" class="result apollo">{{ data.name.name || `${ data.name.firstName } ${ data.name.lastName }` }}</div>
                  <!-- No result -->
                  <div v-else class="no-result apollo">from={{ item.from }}</div>
                </template>
              </ApolloQuery>
            </div>
            <div style="margin-top: 5px"></div>
            <div v-for="(entry, $index) in [{newContent: item.content, date: item.createdAt}, ...item.edits]" :key="$index">
              <div v-if="entry.newContent._ === 'messageText'" v-text="entry.newContent.text.text"></div>
              <div v-else-if="entry.newContent._ === 'messagePhoto'">
                <v-img v-bind:src="'/api/file/' + item.contentFiles[1]"></v-img>
                <div v-text="entry.newContent.caption.text"></div>
              </div>
              <div v-else-if="entry.newContent._ === 'messageSticker'">
                <img v-bind:src="'/api/file/' + item.contentFiles[0]">
              </div>
              <div v-else-if="entry.newContent._ === 'messageVoiceNote'">
                <audio v-bind:src="'/api/file/' + item.contentFiles[0]" controls></audio>
              </div>
              <div v-else-if="entry.newContent._ === 'messageVideoNote'">
                <video controls v-bind:poster="'/api/file/' + item.contentFiles[0]" v-bind:src="'/api/file/' + item.contentFiles[1]"></video>
              </div>
              <div v-else-if="entry.newContent._ === 'messageAnimation'">
                <video loop autoplay controls v-bind:poster="'/api/file/' + item.contentFiles[0]" v-bind:src="'/api/file/' + item.contentFiles[1]"></video>
              </div>
              <div v-else-if="entry.newContent._ === 'messageVideo'">
                <video controls v-bind:poster="'/api/file/' + item.contentFiles[0]" v-bind:src="'/api/file/' + (item.contentFiles[1] || item.contentFiles[0])"></video>
              </div>
              <div v-else-if="entry.newContent._ === 'messageAudio'">
                <audio v-bind:src="'/api/file/' + item.contentFiles[0]" controls></audio>
              </div>
              <div v-else-if="entry.newContent._ === 'messageDocument'">
                <a v-bind:download="item.content.document.fileName" v-bind:href="'/api/file/' + item.contentFiles[0]">{{ item.content.document.fileName }}</a>
              </div>
              <div v-else v-html="entry.newContent"></div>
              <div class="timestamp">
                {{ entry.date | moment("calendar") }}
              </div>
            </div>
            <div class="timestamp" v-if="item.deleted">
              <br>deleted {{ item.deletedAt | moment("calendar") }}
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

const FETCH = gql`{
  messages: messageMany(filter: { deleted: true }) {
    id
    _id
    peer
    from
    fromType
    content
    contentFiles
    edits
    replyToMessageId
    isOutgoing
    createdAt
    deleted
    deletedAt
  }
}`
export default {
  apollo: {
    messages: {
      query: FETCH,
      pollInterval: 5000
    }
  },
};
</script>