<template>
  <div class="mainContent">
    <div class="terminalViewer">
      <p>
        {{ terminalContent }}
      </p>
    </div>
    <div class="moduleEditor"></div>
    <div class="dashboard"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "InstanceViewer",
  components: {},
  setup() {
    const terminalContent = ref("This terminal is empty.");

    return { terminalContent };
  },
});
</script>

<style scoped>
.terminalViewer {
  background-color: #0c0c0c;
  color: #fff;
  padding: 10px;
  border-radius: 34px;
  height: 25vh;
  margin-top: -2px;
  text-align: left;
  width: 50%;
  margin-left: calc(100% - 54%);
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  font-size: 12px;
  outline-width: 5px;
  outline-color: #ffffff45;
  outline-style: solid;
  text-indent: 5px;
}
</style>
