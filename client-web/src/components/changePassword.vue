<template>
  <el-dialog title="Change Password" :visible.sync="dialogVisible" width="570px" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="user-creator-dialog">
      <el-form ref="form" label-width="120px">
        <el-form-item label="Old Password">
          <el-input v-model="form.oldPassword" spellcheck="false" required></el-input>
        </el-form-item>
        <el-form-item label="New Password">
          <el-input v-model="form.newPassword" spellcheck="false" required></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="submit" :loading="isSubmitting">OK</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { genUserToken } from '../utils/index';
import cipher from '../utils/cipher';
import axios from 'axios';
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        oldPassword: '',
        newPassword: ''
      },
      isSubmitting: false
    };
  },
  methods: {
    open(item) {
      this.isSubmitting = false;
      this.dialogVisible = true;
      this.reset();
    },
    reset() {
      this.form = {
        oldPassword: '',
        newPassword: ''
      };
    },
    async submit() {
      if (this.isSubmitting) {
        return;
      }
      const form = this.$el.querySelector('form');
      if (!form.reportValidity()) {
        return;
      }

      const oldToken = await genUserToken(this.auth.name, this.form.oldPassword);
      if (oldToken !== this.auth.token) {
        this.$root.error('Wrong Password');
        return;
      }

      const isConfirm = await this.$root.confirm('Please keep your new password properly. Continue ?', 'Warning');
      if (!isConfirm) {
        return;
      }
      try {
        this.isSubmitting = true;
        const payload = {};
        payload.Token = await genUserToken(this.auth.name, this.form.newPassword);
        const {data, iv} = await cipher.encryptText(this.auth._decryptedKey, this.form.newPassword, true);
        payload.Key = {
          Data: data,
          IV: iv
        };
        await axios.put('/api/users/' + this.auth.name, payload);
        this.$store.commit('updateAuthToken', payload.Token);
        this.$store.dispatch('fetchUserInfo', this.auth.name);
        this.$root.success('Password Changed');
        this.isSubmitting = false;
        this.dialogVisible = false;
        this.reset();
      } catch (e) {
        this.isSubmitting = false;
        this.$root.errorLogger(e, 'Unable to change password');
      }
    },
    cancel() {
      this.dialogVisible = false;
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    }
  }
};

</script>
