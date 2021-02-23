<template>
  <div id="app">
    <component :is="activeComponent"></component>
    <input type="text" id="copy-container" tabindex="-1" readonly />
  </div>
</template>

<script>
import listView from "./pages/list.vue";
import loginView from "./pages/login.vue";
export default {
  name: "App",
  mounted() {
    this.bonjour();
  },
  components: {
    "thoridal-list": listView,
    "thoridal-login": loginView,
  },
  methods: {
    async bonjour() {
      try {
        await this.$store.dispatch("bonjour");
      } catch (e) {
        this.errorLogger(e, "Unable to fetch server info");
      }
    },
    copyText(text) {
      const el = this.$el.querySelector("#copy-container");
      el.value = text;
      el.select();
      if (window.document.execCommand("copy")) {
        this.success("Copied");
      }
    },
    confirm(content, title) {
      return new Promise((resolve) => {
        this.$confirm(content, title || "Confirm", {
          lockScroll: false,
          callback: function (action) {
            resolve(action === "confirm");
          },
        });
      });
    },
    success(message) {
      this.$message({
        message,
        type: "success",
        center: true,
      });
    },
    error(message) {
      this.$message({
        message,
        type: "error",
        center: true,
      });
    },
    errorLogger(e, title) {
      this.$notify.error({
        title: title || "Error",
        message: e.response ? e.response.data : e.toString(),
      });
    },
  },
  computed: {
    activeComponent() {
      if (this.$store.state.auth && this.$store.state.auth.ok) {
        return "thoridal-list";
      }
      return "thoridal-login";
    },
  },
};
</script>

<style>
#copy-container {
  width: 10px;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
