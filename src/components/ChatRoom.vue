<template>
  <v-app>
    <NavBar class="light-blue lighten-4" />
    <div class="light-blue lighten-4" id="chatWindow">
      <template v-for="item in items">
        <div v-if="item.type === 'response'" :key="item.id">
          <i class="fas fa-robot icon__custom"></i>
          <div>
            <div class="chat__content left" v-show="item.text">{{ item.text }}</div>
            <div v-show="item.image">
              <img :src="item.image" alt="" width="300px" height="300px" />
            </div>
            <div v-show="item.buttons">
              <v-simple-table dense id="buttonTable">
                <template v-slot:default>
                  <tbody>
                    <tr
                      v-for="button in item.buttons"
                      :key="button.title"
                      class="button__item"
                    >
                      <td
                        @click="clickButton(button.title)"
                        style="font-size: 11px"
                      >
                        {{ button.title }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </div>
        </div>
        <div class="right" v-else :key="item.id">
          <i class="fas fa-user-circle icon__custom"></i>
          <div>
            <div class="chat__content qtext__margin" v-show="item.text">
              {{ item.text }}
            </div>
            <div v-show="item.image">
              <img
                :src="item.image"
                @click="openImage(item.image)"
                alt=""
                class="cursor__pointer"
                width="300px"
                height="300px"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <div id="inputContainer">
      <textarea
        id="inputArea"
        spellcheck="false"
        v-model="textMessage"
        @keydown="sendMessage"
      ></textarea>
      <div class="option__container">
        <div class="option__item">
          <v-file-input v-model="files" hide-input></v-file-input>
        </div>
      </div>
    </div>
    <div class="back__shadow" v-show="files || isNotImage"></div>
    <ImageModal
      :files="files"
      @close-modal="closeModal"
      @submit="submitImageFile"
      v-show="files"
    />
    <NotImageModal
      @confirm="clickConfirm"
      v-show="isNotImage"
    />
  </v-app>
</template>

<script>
import ImageModal from "./modals/ImageFileModal";
import NotImageModal from "./modals/NotImageModal";
import NavBar from "./NavBar";
import * as rasaApi from "@/apis/chat";

export default {
  data() {
    return {
      items: [],
      files: null,
      textMessage: "",
      msgIdx: 0,
      isShift: false,
      isNotImage: false,
    };
  },
  components: {
    ImageModal,
    NotImageModal,
    NavBar,
  },
  updated() {
    if (!this.isShift) this.textMessage = this.textMessage.replace("\n", "");
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  },
  methods: {
    requestRasa: async function(data) {
      const responseData = await rasaApi.chat(data.sender, data.message);
      return responseData.data;
    },
    responseFromRasa: function(responseData) {
      responseData.forEach(response => {
        this.items.push({
          id: this.msgIdx++,
          type: "response",
          text: response.text,
          image: response.image,
          buttons: response.buttons,
        });
      });
    },
    responseServerErrorMsg() {
      this.items.push({
          id: this.msgIdx++,
          type: "response",
          text: "500 Error!!",
        });
    },
    sendMessage: async function(e) {
      if (e.shiftKey) this.isShift = e.shiftKey;
      if (e.keyCode === 13 && !e.shiftKey) {
        if (!this.textMessage) return;

        const data = {
          sender: "me",
          message: this.textMessage,
        };

        this.items.push({
          id: this.msgIdx++,
          type: "request",
          text: this.textMessage,
        });

        this.textMessage = "";
        this.isShift = false;

        try {
          const responseData = await this.requestRasa(data);
          if (responseData.length) this.responseFromRasa(responseData);
        } catch {
          this.responseServerErrorMsg()
        }
      }
    },
    clickButton: async function(message) {
      const data = {
        sender: "me",
        message: message,
      };
      this.items.splice(-1, 1);

      this.items.push({
        id: this.msgIdx++,
        type: "request",
        text: message,
      });

      const responseData = await this.requestRasa(data);
      if (responseData.length) this.responseFromRasa(responseData);
    },
    submitImageFile: function(file) {
      const extValidList = ["jpg", "PNG", "png", "jpeg"];
      const fileExt = file.name.slice(file.name.indexOf(".") + 1);
      if (extValidList.indexOf(fileExt) === -1) {
        this.isNotImage = true;
        this.files = null;
        return;
      }

      const imgUrl = window.URL.createObjectURL(file);
      this.items.push({
        id: this.msgIdx++,
        type: "request",
        image: imgUrl,
      });
      this.closeModal(null);
    },
    clickConfirm: function() {
      this.isNotImage = false;
    },
    closeModal: function(close) {
      this.files = close;
    },
    openImage: function(image) {
      window.open(image ,"_blank","height=650,width=1000,frame=true,show=true");
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Chrome, Safari and Opera */
#chatWindow::-webkit-scrollbar {
  display: none;
}

#chatWindow {
  height: 84vh;
  overflow-y: scroll;
  padding-top: 35px;
}

.chat__content {
  display: inline-block;
  background-color: white;
  padding: 10px 10px;
  max-width: 50vw;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 11px;
  word-break: break-all;
  white-space: pre-wrap;
}

.right {
  text-align: right;
}

.qtext__margin {
  margin-right: 10px;
}

.left {
  text-align: left;
  margin-left: 10px;
}

.cursor__pointer {
  cursor: pointer;
}

#buttonTable {
  width: 60vw;
  border-radius: 10px;
  margin-left: 10px;
}

.button__item {
  text-align: center;
  cursor: pointer;
}

#inputContainer {
  height: 16vh;
}

#inputArea {
  width: 100%;
  height: 10vh;
  border: none;
  outline: none;
  resize: none;
  padding: 10px 20px;
  font-size: 14px;
}

#inputArea::-webkit-scrollbar {
  width: 3px;
}

#inputArea::-webkit-scrollbar-thumb {
  background-color: gray;
}

.option__container {
  display: flex;
  align-content: center;
  position: absolute;
  bottom: 10px;
}

.option__item {
  margin-left: 15px;
  cursor: pointer;
  font-size: 20px;
  color: rgb(219, 216, 216);
}

.back__shadow {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
}

.icon__custom {
  font-size: 25px; 
  margin-right: 10px;
}
</style>
