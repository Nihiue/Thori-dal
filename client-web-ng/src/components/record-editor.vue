<template>
  <el-dialog
    v-model="dialogVisible"
    width="570px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #title>
      {{ item._id ? "Edit Record" : "New Record" }}
    </template>
    <div class="record-editor-dialog">
      <el-form ref="form" label-width="0">
        <el-form-item>
          <el-input
            v-model="item.Name"
            placeholder="Name"
            prefix-icon="iconfont icon-search-name"
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="item.Data.Account"
            placeholder="Account"
            prefix-icon="iconfont icon-account"
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="item.Data.Password"
            placeholder="Password"
            prefix-icon="iconfont icon-password"
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="item.Data.TOTP"
            placeholder="TOTP Secret"
            prefix-icon="iconfont icon-otp"
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="item.Data.Link"
            placeholder="Link"
            prefix-icon="iconfont icon-link"
            spellcheck="false"
          ></el-input>
        </el-form-item>
        <div class="custom-field">
          <div
            v-for="(field, fIdx) in item.Data.Fields"
            :key="fIdx"
            class="custom-field-item"
          >
            <el-input
              v-model="field.Name"
              placeholder="Field Name"
              size="small"
              prefix-icon="iconfont icon-accessory"
              spellcheck="false"
            ></el-input>
            <el-input
              type="textarea"
              v-model="field.Value"
              placeholder="Field Value"
              rows="4"
              spellcheck="false"
            ></el-input>
          </div>
          <div style="text-align: center">
            <el-button type="text" @click="appendField" icon="el-icon-plus">
              Add Field</el-button
            >
          </div>
        </div>
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
import cipher from "../utils/cipher";
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false,
      item: {
        Name: "",
        Data: {
          Fields: [],
        },
      },
      isSubmitting: false,
    };
  },
  emits: ["refresh-list", "patch-item"],
  methods: {
    open(item) {
      if (!item.Data) {
        item.Data = {};
      }
      if (!item.Data.Fields) {
        item.Data.Fields = [];
      }
      this.isSubmitting = false;
      this.item = item;
      this.dialogVisible = true;
    },
    appendField() {
      this.item.Data.Fields.push({ Name: "", Value: "" });
    },
    async createRecord(payload) {
      payload.Type = 0;
      await axios.post("/api/records", payload);
      this.$emit("refresh-list");
    },
    async saveRecord(id, payload) {
      await axios.put(`/api/records/${id}`, payload);
      this.$emit("patch-item", {
        id,
        data: {
          Name: this.item.Name,
          Data: JSON.parse(JSON.stringify(this.item.Data)),
        },
      });
    },
    async submit() {
      if (this.isSubmitting) {
        return;
      }
      this.item.Data.Fields = this.item.Data.Fields.filter(function (f) {
        return f.Name || f.Value;
      });
      try {
        this.isSubmitting = true;
        const decryptedKey = this.auth._decryptedKey;
        const { data, iv } = await cipher.encryptText(
          JSON.stringify(this.item.Data),
          decryptedKey
        );
        const payload = {
          Name: this.item.Name.trim(),
          Data: data,
          IV: iv,
        };
        if (this.item._id) {
          await this.saveRecord(this.item._id, payload);
        } else {
          await this.createRecord(payload);
        }
        this.isSubmitting = false;
        this.dialogVisible = false;
      } catch (e) {
        this.isSubmitting = false;
        this.$root.errorLogger(e, "Unable to save");
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

<style lang="scss">
.record-editor-dialog {
  .custom-field {
    margin-top: 18px;
  }
  .custom-field-item {
    margin: 8px 0;
    border-top: 1px solid #eee;
    padding: 16px 0;
    .el-input {
      margin-bottom: 16px;
    }
  }
}
</style>
