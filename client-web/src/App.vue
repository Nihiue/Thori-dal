<template>
  <div id="app">
    <component :is="activeComponent"></component>
  </div>
</template>

<script>
import listView from './pages/list';
import loginView from './pages/login';
export default {
  name: 'App',
  mounted() {
    this.bonjour();
    this.checkHttps();
  },
  components: {
    'thoridal-list': listView,
    'thoridal-login': loginView
  },
  methods: {
    async bonjour() {
      try {
        await this.$store.dispatch('bonjour');
      } catch (e) {
        this.errorLogger(e, 'Unable to fetch server info');
      }
    },
    checkHttps() {
      if (location.protocol === 'https:') {
        return;
      }
      const url = new URL('./static/thori_dal.jpg', location.href);
      url.protocol = 'https:';
      const el = document.createElement('img');
      el.addEventListener('load', async () => {
        const isConfirm = await this.confirm('Switch to HTTPS?', 'HTTPS Available');
        if (isConfirm) {
          location.replace(location.href.replace('http:', 'https:'));
        }
      });
      el.src = url.href;
      el.style.display = 'none';
      document.body.appendChild(el);
    },
    confirm(content, title) {
      return new Promise((resolve) => {
        this.$confirm(content, title || 'Confirm', {
          lockScroll: false,
          callback: function(action) {
            resolve(action === 'confirm');
          }
        });
      });
    },
    success(message) {
      this.$message({
        message,
        type: 'success',
        center: true
      });
    },
    error(message) {
      this.$message({
        message,
        type: 'error',
        center: true
      });
    },
    errorLogger(e, title) {
      this.$notify.error({
        title: title || 'Error',
        message: e.response ? e.response.data : e.toString()
      });
    }
  },
  computed: {
    activeComponent() {
      if (this.$store.state.auth && this.$store.state.auth.ok) {
        return 'thoridal-list';
      }
      return 'thoridal-login';
    }
  }
};
</script>

<style>
#app {

}
</style>
