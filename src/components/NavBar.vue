<template>
  <div id="navApp">
    <div id="navTitle">
      <i class="fas fa-robot title__logo"></i>
      <span class="chat__title">mychatbot</span>
    </div>
    <div id="windowButtons">
      <div class="window__button" @click="minimizeWindow">
        <i class="far fa-window-minimize window__icon"></i>
      </div>
      <div class="window__button" v-if="isMax" @click="unmaximizeWindow">
        <i class="far fa-window-restore window__icon window__button"></i>
      </div>
      <div class="window__button" v-else @click="maximizeWindow">
        <i class="far fa-window-maximize window__icon window__button"></i>
      </div>
      <div class="window__button" @click="closeWindow">
        <i class="fas fa-times window__icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "navBar",
  data() {
    return {
      isMax: false,
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  methods: {
    minimizeWindow: function() {
      ipcRenderer.send("minimize");
    },
    maximizeWindow: function() {
      ipcRenderer.send("maximize");
      this.isMax = true;
    },
    unmaximizeWindow: function() {
      ipcRenderer.send("unmaximize");
      this.isMax = false;
    },
    closeWindow: function() {
      ipcRenderer.send("close");
    },
    handleResize: function() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      if (
        this.window.width === screen.width &&
        this.window.height + 40 === screen.height
      ) {
        this.isMax = true;
      } else {
        this.isMax = false;
      }
    },
  },
};
</script>

<style>
#navApp {
  display: flex;
  position: fixed;
  width: 100%;
  height: 30x;
}

#navTitle {
  margin-top: 1px;
  padding: 5px 10px;
  -webkit-app-region: drag;
  flex-grow: 1;
}

#windowButtons {
  display: flex;
  margin-top: 0.1px;
  height: 34px;
  right: 0;
}

.title__logo {
  color: pink;
  margin-right:5px
}

.chat__title {
  color: rgb(59, 59, 59);
}

.window__icon {
  margin-left: 12px;
  margin-right: 12px;
  font-size: 12px;
  color: rgb(119, 119, 119);
}

.window__button {
  cursor: pointer;
}

.window__button:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
