<template>
  <div class="mainContent">
    <div class="dashboard">
      <h1 class="dashboard-title">{{ instanceName }}</h1>
      <div class="controlButtons">
        <button class="startButton" @click="startInstance">Start</button>
        <button class="stopButton" @click="stopInstance">Stop</button>
      </div>
    </div>
    <div class="moduleEditor"></div>
    <div class="terminalViewer">
      <p>
        {{ terminalContent }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "InstanceViewer",
  components: {},
  props: {
    instanceName: {
      type: String,
      required: true,
    },
  },
  setup() {
    const terminalContent = ref(
      "This terminal is empty; press the start button to start the instance."
    );

    return { terminalContent };
  },
  methods: {
    startInstance() {
      // Implement the logic to start the instance
      window.alert("Instance started");
    },
    stopInstance() {
      // Implement the logic to stop the instance
      window.alert("Instance stopped");
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Consolas:wght@100;200;300;400;500;600;700;800;900&display=swap");

.mainContent {
  display: flex;
  flex-direction: row;
}
.terminalViewer {
  background-color: #130324;
  color: #8a58bc;
  padding: 10px;
  border-radius: 34px;
  height: 25vh;
  text-align: left;
  width: 100%;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  font-size: 12px;
  text-indent: 5px;
  box-shadow: 0 0 10px rgb(26, 6, 48);
}

.dashboard {
  display: flex;
  flex-direction: row;
  background-color: #1e1e1e;
  border-radius: 34px;
  width: 100%;
  margin-right: 20px;
  padding-left: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.301);
  text-align: left;
  text-indent: 34px;
  font-size: xx-small;
}

.dashboard-title {
  margin-top: 34px;
}

.controlButtons {
  height: 50px;
  margin-left: 98px;
  margin-top: 25px;
}

.startButton {
  background-color: #04aa6d;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 18px;
  font-size: 16px;
  cursor: pointer;
  justify-content: center;
  font-weight: bolder;
}

.stopButton {
  margin-left: 10px;
  background-color: #e55252;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 18px;
  font-size: 16px;
  cursor: pointer;
  justify-content: center;
  font-weight: bolder;
}
</style>
