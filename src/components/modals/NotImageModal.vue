<template>
  <div id="modalApp__error">
    <div class="modal__container">
      <div>
          This is not image!!
      </div>
      <div class="button__item">
        <v-btn
          depressed
          color="primary"
          @click="clickConfirm"
        >
          Confirm
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickConfirm: function() {
      this.$emit("confirm");
    },
  },
};
</script>

<style>
#modalApp__error {
  width: 488px;
  height: 150px;
  padding: 20px 20px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.1);
}

.button__item {
  margin-top: 10px;
  text-align: right;
}
</style>
