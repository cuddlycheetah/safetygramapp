<template>
  <v-flex>
    <v-toolbar>
      <v-toolbar-title>
        <ApolloQuery
          :query="require('../graphql/NameResolutionChat.gql')"
          :variables="{ peer: $route.params.id }"
        >
          <template v-slot="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading Name...</div>
            <!-- Error -->
            <div v-else-if="error" class="error apollo">An error occurred</div>
            <!-- Result -->
            <div v-else-if="data" class="result apollo">{{ data.name.name }}</div>
            <!-- No result -->
            <div v-else class="no-result apollo">{{ $route.params.id }}</div>
          </template>
        </ApolloQuery>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!--<v-toolbar-items v-if="$vuetify.breakpoint.smAndUp">
        <v-btn text @click="importChat">Import Chat</v-btn>
        <v-btn text>Button 2</v-btn>
      </v-toolbar-items>-->

      <v-menu :close-on-content-click="false" :nudge-width="200" offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon color="primary" dark v-on="on">
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <!--<v-list-item-avatar>
                <v-img v-bind:src="'/api/file/' + chatInfo.photo"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>John Leider</v-list-item-title>
                <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
              </v-list-item-content>-->

              <!--<v-list-item-action>
                <v-btn
                  :class="fav ? 'red--text' : ''"
                  icon
                  @click="fav = !fav"
                >
                  <v-icon>favorite</v-icon>
                </v-btn>
              </v-list-item-action>-->
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <!--<v-list-item>
              <v-list-item-action>
                <v-switch v-model="message" color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable messages</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-switch v-model="hints" color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable hints</v-list-item-title>
            </v-list-item>-->
            <v-btn text @click="importChat">Import Chat</v-btn>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" text @click="menu = false">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
    <div class="chat-container infinite-wrapper">
      <infinite-loading force-use-infinite-wrapper=".infinite-wrapper" direction="top" @infinite="infiniteHandler"></infinite-loading>
      <div style="display: flex; flex-direction: column-reverse;">
        <div class="message" :class="{ own: item.isOutgoing, deleted: item.deleted, [item.content._ ]: true }" v-for="(item, $index) in chatMsgs" :key="$index">

          <div class="content">
            <ApolloQuery class="username" v-if="($index>0 && chatMsgs[$index+1] && chatMsgs[$index+1].from != item.from) || ($index == chatMsgs.length)"
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
            <ApolloQuery class="forwardedfrom" v-if="item.forwardedType"
              :query="item.forwardedType == 'messageForwardOriginUser' ? require('../graphql/NameResolutionUser.gql') : require('../graphql/NameResolutionChat.gql')"
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
    <!-- <emoji-picker :show="emojiPanel" @close="toggleEmojiPanel" @click="addMessage"></emoji-picker> -->
    <!-- <div class="typer">
      <input
        type="text"
        placeholder="Type here..."
        v-on:keyup.enter="sendMessage"
        v-model="content"
      />
      <v-btn icon class="blue--text emoji-panel">
        <v-icon>mood</v-icon>
      </v-btn>
    </div>-->
  </v-flex>
</template>
<script>
import gql from "graphql-tag";

import InfiniteLoading from "vue-infinite-loading";

const FETCH = gql`
  query getMessages($chatid: MongoID!, $page: Int!) {
    messages: messagePagination(
      filter: { peer: $chatid }
      sort: CREATEDAT_DESC
      page: $page
      perPage: 10
    ) {
      count
      items {
        id
        _id
        peer
        from
        fromType

        forwardedName
        forwardedFrom
        forwardedDate
        forwardedType

        content
        contentFiles
        edits
        replyToMessageId
        isOutgoing
        createdAt
        deleted
        deletedAt
      }
    }
  }
`;

const importChat = gql`
  mutation importChat($chatId: MongoID!) {
    importChat(chatId: $chatId)
  }
`;
const chatInfo = gql`
  query chatInfo($chatid: MongoID!) {
    chatInfo: chatOne(filter: { _id: $chatid }) {
      storageLevel
      type
      lastUpdate
      user
      basicGroupId
      supergroupId 
    }
  }
`;
export default {
  data() {
    return {
      content: "",
      chatMessages: [],
      loading: false,
      totalChatHeight: 0,
      page: 1,
      messages: { items: [] },
    };
  },
  props: ["chatid"],
  apollo: {
    chatInfo: {
      query: chatInfo,
      variables() {
        return {
          chatid: this.$route.params.id,
        };
      },result() {
        console.log(this.chatInfo);
      },
    },
    messages: {
      query: FETCH,
      variables() {
        return {
          chatid: this.$route.params.id,
          page: 1
        };
      },
      /*result() {
        console.log(this.chatMsgs);
      },*/
    }
  },
  components: {
    InfiniteLoading
  },
  computed: {
    chatMsgs() {
      let arr = this.messages.items;
      return this.messages ? arr : [];
    },
  },
  methods: {
    importChat() {
      this.$apollo.mutate({
        mutation: importChat,
        variables: {
          chatId: this.$route.params.id,
        },
      })
      .then(() => {
        // TODO: add ui feedback for import start
      })
    },
    infiniteHandler($state) {
      this.page++;
      this.$apollo.queries.messages
      .fetchMore({
        variables: {
          chatid: this.$route.params.id,
          page: this.page
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          //const hasMore = fetchMoreResult.tagsPage.hasMore

          //this.showMoreEnabled = hasMore
          if (fetchMoreResult.messages.items.length > 0)
            $state.loaded();
          else
            $state.complete();
          return {
            messages: {
              __typename: previousResult.messages.__typename,
              count: previousResult.messages.count,
              // Merging the tag list
              items: [
                ...previousResult.messages.items,
                ...fetchMoreResult.messages.items
              ]
              //hasMore,
            }
          };
        }
      })
      .then(() => {
      });
    }
  }
};
</script>

<style>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
  font: 13px/18px Tahoma,sans-serif,Arial,Helvetica;
  font-weight: normal;
  font-size: 13px;
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

.timestamp {
  margin-top: 5px;
  font-size: 0.75rem;
  font-family: monospace;
}

.chat-container .username {
  /*font-size: 18px;*/
  font-weight: bold;
}
.chat-container .content {
  text-align: initial;
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