<template>
  <div class="thoridal-login">
    <div class="login-box">
      <el-form ref="form" label-position="top" :model="form" label-width="80px" @submit.native.prevent="doLogin">
        <h1>Thori'dal</h1>
        <el-form-item>
          <el-input v-model="form.name" name="thoridal-username" placeholder="Name" required></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" name="thoridal-acesstoken" type="password" placeholder="Password" required></el-input>
        </el-form-item>
        <el-form-item v-show="!isSubmitting">
          <el-button type="primary" native-type="submit" style="width: 100%">Login</el-button>
        </el-form-item>
        <el-form-item v-show="isSubmitting">
          <el-button v-show="isSubmitting" type="primary" native-type="button" style="width: 100%" disabled><span class="el-icon-loading"></span></el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      form: {
        name: '',
        password: ''
      },
      isSubmitting: false
    };
  },
  methods: {
    doLogin() {
      this.isSubmitting = true;
      console.log(this.form);
    }
  }
};

</script>

<style lang="scss">
  .thoridal-login {
    background: rgb(246,246,246);
    display: flex;
    height: 100vh;
    align-items: center;
    .login-box {
      background: #fff;
      padding: 50px 82px 60px 82px;
      box-shadow: 0 2px 3px rgba(213, 213, 213, 0.7);
      width: 296px;
      min-height: 300px;
      margin: 0 auto;
    }
    h1 {
      text-shadow: 1px 1px 6px #ddd;
      font-size: 28px;
      font-weight: normal;
      text-align: center;
      margin-bottom: 50px;
    }
  }

</style>
