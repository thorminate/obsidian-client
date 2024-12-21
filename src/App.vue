<template>
  <div class="app">
    <Sidebar @instance-selected="updateSelectedInstance" />
    <div class="main-content">
      <h1 class="title">
        {{ selectedInstance ? selectedInstance : "Welcome to the App" }}
      </h1>
      <p class="title-content">
        {{
          selectedInstance
            ? `Content for ${selectedInstance}`
            : "This content will change based on the selected instance."
        }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";

export default defineComponent({
  name: "App",
  components: {
    Sidebar,
  },
  setup() {
    const selectedInstance = ref<string | null>(null);

    const updateSelectedInstance = (instanceName: string) => {
      selectedInstance.value = instanceName;
    };

    return {
      selectedInstance,
      updateSelectedInstance,
    };
  },
});
</script>

<style scoped>
.app {
  height: calc(100vh - 106x); /* Ensure full screen height */
  width: calc(100vw - 250px);
  margin-left: 175px;
  margin-top: 16px;
  text-align: center;
}

.main-content {
  flex-grow: 2;
  padding: 20px;
  background-color: #161616;
  transition: margin-left 0.3s;
  border-radius: 50px;
  height: calc(100vh - 106px);
  width: calc(100vw - 250px);
  filter: drop-shadow(0 0 16px rgba(27, 26, 29, 0.582));
}

.title {
  color: #383838;
  font-size: 24px;
  margin-bottom: 10px;
}

.title-content {
  font-size: 16px;
  color: #666;
}
</style>
