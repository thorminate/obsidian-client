<template>
  <div class="app"></div>
  <div class="titlebar">
    <span>Obsidian Client</span>
    <div class="app-buttons">
      <button class="minimize" onclick="minimize()">__</button>
      <button class="maximize" onclick="maximize()"></button>
      <button class="close" onclick="close()">🞨</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "App",
  components: {},
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
  mounted() {
    function minimize() {
      this.$api.window.minimize();
    }

    function maximize() {
      this.$api.window.maximize();
    }

    function close() {
      this.$api.window.close();
    }

    return {
      minimize,
      maximize,
      close,
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

.titlebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 32px;
  color: white;
  background-color: #1c0729;
  box-shadow: 0px 0px 20px #260846;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  user-select: none;
  border-bottom-left-radius: 11px;
  border-bottom-right-radius: 11px;
  -webkit-app-region: drag;
}

.app-buttons {
  position: absolute;
  top: 0;

  width: 110px;
  height: 32px;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  -webkit-app-region: no-drag;
}

.close {
  border: 0;
  height: 100%;
  background-color: #351b44;
  width: 50px;
  cursor: pointer;
  border-bottom-right-radius: 11px;
  font-size: large;
  transition: 150ms;
}

.close:hover {
  background-color: rgb(223, 13, 13);
  filter: drop-shadow(0px 0px 20px #ff0b0b);
  transition: 150ms;
  height: 100%;
  width: 50px;
  cursor: pointer;
}
.minimize {
  border: 0;
  background-color: #351b44;
  height: 100%;
  width: 50px;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  cursor: pointer;
}

.minimize:hover {
  background-color: rgb(50, 20, 78);
  height: 100%;
  width: 50px;
  cursor: pointer;
}

.maximize {
  border: 0;
  background-color: #351b44;
  height: 100%;
  width: 50px;
  cursor: pointer;
}

.maximize:hover {
  background-color: rgb(50, 20, 78);
  height: 100%;
  width: 50px;
  cursor: pointer;
}
</style>
