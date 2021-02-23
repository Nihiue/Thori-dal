<template>
  <el-dialog
    title="Create User"
    v-model="dialogVisible"
    width="570px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="user-creator-dialog">
      <el-form ref="form" label-width="80px">
        <el-form-item label="Name">
          <el-input v-model="item.Name" spellcheck="false" required></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="item.Password"
            spellcheck="false"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="item.Email" spellcheck="false" required></el-input>
        </el-form-item>
        <el-form-item label="Admin">
          <el-switch v-model="item.AdminFlag"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="submit" :loading="isSubmitting"
          >OK</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { genUserToken } from "../utils/index";
import cipher from "../utils/cipher";
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false,
      item: {
        Name: "",
        Password: "",
        Email: "",
        AdminFlag: false,
      },
      isSubmitting: false,
    };
  },
  methods: {
    open(item) {
      this.isSubmitting = false;
      this.dialogVisible = true;
      this.reset();
    },
    reset() {
      this.item = {
        Name: "",
        Password: "",
        Email: "",
        AdminFlag: false,
      };
    },
    async submit() {
      if (this.isSubmitting) {
        return;
      }
      const form = this.$el.querySelector("form");
      if (!form.reportValidity()) {
        return;
      }
      try {
        this.isSubmitting = true;
        const payload = {};
        Object.keys(this.item).forEach((k) => {
          if (k !== "Password") {
            payload[k] = this.item[k];
          }
        });

        payload.Token = await genUserToken(this.item.Name, this.item.Password);
        const { data, iv } = await cipher.encryptText(
          cipher.genRandomKey(),
          this.item.Password,
          true
        );
        payload.Key = {
          Data: data,
          IV: iv,
        };

        await axios.post("/api/users", payload);
        this.$root.success("User Created");
        this.isSubmitting = false;
        this.dialogVisible = false;
        this.reset();
      } catch (e) {
        this.isSubmitting = false;
        this.$root.errorLogger(e, "Unable to create user");
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    },
  },
};
</script>
