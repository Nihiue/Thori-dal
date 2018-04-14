<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    confirm(content, title) {
      return new Promise((resolve) => {
        this.$confirm(content, title || '确认', {
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
    errorLogger(e, title) {
      this.$notify.error({
        title: title || '错误',
        message: e.response ? e.response.data : e.toString()
      });
    }
  }
};
</script>

<style>
#app {

}
</style>
