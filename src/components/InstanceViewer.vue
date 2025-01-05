<template>
  <div class="InstanceViewer">
    <div class="dashboard">
      <div class="dashboardTop">
        <h1 class="dashboard-title">{{ instanceName }}</h1>
      </div>
      <div class="buttons">
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

.InstanceViewer {
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
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 34px;
  width: 100%;
  margin-right: 20px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.301);
  text-align: left;
  text-indent: 34px;
  font-size: x-small;
}

.dashboardTop {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 34px;
  width: 30%;
}

.startButton {
}

.stopButton {
}
</style>
