<template>
  <div id="app">
    <component :is="activeComponent"></component>
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
    async copyText(text) {      
      try {
        if (!navigator.clipboard) {
          return;
        }
        await navigator.clipboard.writeText(text);
        this.success("Copied");
      } catch (e) {
        console.log('failed to copy', e.toString());
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
