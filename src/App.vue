<template>
  <v-app id="masterApp">
    <ChatRoom />
  </v-app>
</template>

<script>
import ChatRoom from "./components/ChatRoom";

export default {
  name: "App",
  components: {
    ChatRoom,
  },
};
</script>
