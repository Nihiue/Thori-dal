<template>
  <div class="thoridal-login">
    <div class="login-box">
      <el-form
        ref="form"
        label-position="top"
        label-width="80px"
        @submit.native.prevent="loginSubmit"
      >
        <h1>Thori'dal</h1>
        <el-form-item>
          <el-input
            v-model="form.name"
            name="thoridal-username"
            autocomplete="username"
            prefix-icon="iconfont icon-account"
            required
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            name="thoridal-acesstoken"
            autocomplete="current-password"
            type="password"
            prefix-icon="iconfont icon-password"
            required
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            style="width: 100%"
            :loading="!readyToLogin || isSubmitting"
            >Login</el-button
          >
        </el-form-item>
      </el-form>
      <el-alert
        v-show="error"
        title="Login Failed"
        type="error"
        :closable="false"
      ></el-alert>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
      },
      isSubmitting: false,
      error: false,
    };
  },
  methods: {
    async loginSubmit() {
      if (this.isSubmitting) {
        return;
      }
      this.error = false;
      this.isSubmitting = true;
      const res = await this.$store.dispatch("login", {
        name: this.form.name,
        password: this.form.password,
      });
      if (!res) {
        this.error = true;
      }
      this.isSubmitting = false;
    },
  },
  computed: {
    readyToLogin() {
      return this.$store.getters.readyToLogin;
    },
  },
};
</script>

<style lang="scss">
.thoridal-login {
  display: flex;
  height: 90vh;
  align-items: center;
  .login-box {
    box-shadow: 0 2px 3px rgba(240, 240, 240, 0.5);
    background: #fff;
    border-radius: 3px;
    border: 1px solid #ebebeb;
    padding: 50px 82px 60px 82px;
    width: 100%;
    max-width: 296px;
    min-height: 300px;
    margin: 0 auto;
  }
  h1 {
    font-family: "iceland";
    font-size: 32px;
    font-weight: normal;
    text-align: center;
    margin-bottom: 50px;
  }
}
@media screen and (max-width: 768px) {
  .thoridal-login {
    padding: 16px 0;
    .login-box {
      padding: 30px 40px;
    }
  }
}
</style>
