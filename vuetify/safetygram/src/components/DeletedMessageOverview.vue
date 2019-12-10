<template>

  <div class="chat-container">
    <div style="display: flex; flex-direction: column-reverse;">
        <div class="message" :class="{ own: item.isOutgoing, deleted: item.deleted, [item.content._ ]: true }" v-for="(item, $index) in messages" :key="$index">
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
                <div v-else class="no-result apollo">{{ item.from }}</div>
              </template>
            </ApolloQuery>
          </div>
          <div style="margin-top: 5px"></div>
          <div class="content">
            <div v-if="item.content._ === 'messageText'" v-text="item.content.text.text"></div>
            <div v-else-if="item.content._ === 'messagePhoto'">
              <v-img v-bind:src="'/api/file/' + item.contentFiles[1]"></v-img>
            </div>
            <div v-else-if="item.content._ === 'messageSticker'">
              <img v-bind:src="'/api/file/' + item.contentFiles[0]">
            </div>
            <div v-else-if="item.content._ === 'messageVoiceNote'">
              <audio v-bind:src="'/api/file/' + item.contentFiles[0]" controls></audio>
            </div>
            <div v-else-if="item.content._ === 'messageVideoNote'">
              <video controls v-bind:poster="'/api/file/' + item.contentFiles[0]" v-bind:src="'/api/file/' + item.contentFiles[1]"></video>
            </div>
            <div v-else-if="item.content._ === 'messageAnimation'">
              <video controls v-bind:poster="'/api/file/' + item.contentFiles[0]" v-bind:src="'/api/file/' + item.contentFiles[1]"></video>
            </div>
            <div v-else-if="item.content._ === 'messageVideo'">
              <video controls v-bind:poster="'/api/file/' + item.contentFiles[0]" v-bind:src="'/api/file/' + (item.contentFiles[1] || item.contentFiles[0])"></video>
            </div>
            <div v-else v-html="item.content"></div>
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
      pollInterval: 15000
    }
  },
};
</script>


<style>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.typer .emoji-panel {
  /*margin-right: 15px;*/
}
.typer input[type="text"] {
  position: absolute;
  left: 2.5rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
}
.message.own .content {
  background-color: lightskyblue;
}
.message.deleted .content {
  background-color: red;
}
.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}
.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}
@media (max-width: 480px) {
  .chat-container .content {
    max-width: 60%;
  }
}

.messageSticker {
  min-height: 14rem;
} .messageSticker img {
  min-height: 14rem;
  height: 14rem;
}
.messageVideo {
  min-height: 14rem;
} .messageVideo video {
  min-height: 14rem;
  height: 14rem;
}
.messageAnimation {
  min-height: 14rem;
}.messageAnimation video {
  min-height: 14rem;
  height: 14rem;
}
</style>