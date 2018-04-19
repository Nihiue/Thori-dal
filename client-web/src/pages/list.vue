<template>
  <div class="container thoridal-list">
    <div class="light-block list-header action-row-container">
      <div class="search">
        <form @submit.prevent="fetchRecordList(1)">
          <el-input role="search" :class="{active: searchInput.length > 0}" size="small" v-model="searchInput" prefix-icon="el-icon-search" tabindex="10"></el-input>
        </form>
      </div>
      <div class="action-row">
        <el-button type="text" icon="el-icon-refresh" @click="refreshList()" tabindex="-1"></el-button>
        <el-button type="text" icon="el-icon-plus" @click="addRecord()" tabindex="-1"></el-button>
        <el-dropdown @command="handleHeadDropdown" trigger="click">
          <el-button type="text" icon="el-icon-more" tabindex="-1"></el-button>
          <el-dropdown-menu slot="dropdown" class="th-header-dropdown" tabindex="-1">
            <el-dropdown-item command="modify-password"><span class="iconfont icon-edit"></span> Change Password</el-dropdown-item>
            <el-dropdown-item command="send-backup"><span class="iconfont icon-modify"></span> Send Backup</el-dropdown-item>
            <el-dropdown-item command="create-user" divided v-if="isAdmin"><span class="iconfont icon-collection"></span> Create User</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="list-content">
      <div class="light-block list-card" v-for="(item, itemIndex) in listData" :key="item._id">
        <div class="action-row-container">
          <h2 class="title">{{item.Name}}</h2>
          <div class="action-row">
            <el-button type="text" icon="el-icon-edit" @click="openEditRecord(item)" tabindex="-1"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteRecord(item, itemIndex)" tabindex="-1"></el-button>
          </div>
        </div>
        <div class="info-container">
          <p @click="copyText(item.Data.Account)" v-if="item.Data.Account">
            <span class="iconfont icon-account"></span>{{item.Data.Account}}</p>
          <p @click="copyText(item.Data.Password)" v-if="item.Data.Password">
            <span class="iconfont icon-password"></span><span class="iconfont pwd-mask" v-html="('&#xe64c;').repeat(item.Data.Password.length)"></span></p>
          <p @click="copyText(item.Data.Link)" v-if="item.Data.Link">
            <span class="iconfont icon-link"></span>{{item.Data.Link}}</p>
        </div>
        <el-collapse v-if="item.Data.Fields && item.Data.Fields.length > 0">
          <el-collapse-item v-for="(field, fIdx) in item.Data.Fields" :title="field.Name" :key="fIdx" :name="fIdx" >
            <pre class="custom-fileds-pre">{{field.Value}}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="loadmore" v-show="listCtr.page < listCtr.total" @click="fetchRecordList(listCtr.page + 1)" :title="listCtr.page + '/' + listCtr.total ">
      <span class="iconfont icon-down" v-show="!listCtr.isRequesting"></span>
      <span class="el-icon-loading" v-show="listCtr.isRequesting"></span>
    </div>
    <div class="empyt-placeholder" v-show="listData.length === 0 && !listCtr.isRequesting">
      <span class="iconfont icon-emptybox"></span>
    </div>
    <record-editor ref="recordEditor" @refresh-list="refreshList" @patch-item="patchListItem"></record-editor>
    <user-creator ref="userCreator"></user-creator>
    <change-password ref="changePassword"></change-password>
    <input type="text" id="copy-container" tabindex="-1" readonly>
  </div>
</template>
<script>
import axios from 'axios';
import recordEditorView from '../components/recordEditor';
import userCreatorView from '../components/userCreator';
import changePasswordView from '../components/changePassword';

import { genRandomPassword } from '../utils/index';
import cipher from '../utils/cipher';
const PAGE_SIZE = 10;

export default {
  components: {
    'user-creator': userCreatorView,
    'record-editor': recordEditorView,
    'change-password': changePasswordView
  },
  data() {
    return {
      searchInput: '',
      listData: [],
      listCtr: {
        isRequesting: false,
        total: 0,
        page: 1,
        totalNum: 0
      }
    };
  },
  mounted() {
    this.fetchRecordList(1);
  },
  methods: {
    async refreshList() {
      await this.fetchRecordList(1);
      this.$root.success('Refreshed');
    },
    addRecord() {
      this.$refs.recordEditor.open({
        Name: '',
        Data: {
          Password: genRandomPassword(12)
        }
      });
    },
    handleHeadDropdown(cmd) {
      switch (cmd) {
        case 'modify-password':
          this.$refs.changePassword.open();
          break;
        case 'send-backup':
          this.sendBackup();
          break;
        case 'create-user':
          this.$refs.userCreator.open();
          break;
      }
    },
    async fetchRecordList(page = 1) {
      if (this.listCtr.isRequesting) {
        return;
      }
      try {
        this.listCtr.isRequesting = true;
        const resp = await axios.get('/api/records', {
          params: {
            pageSize: PAGE_SIZE,
            page,
            Name: this.searchInput,
            Type: 0
          }
        });
        const decryptedKey = this.auth._decryptedKey;
        const newData = await Promise.all(resp.data.data.map(async function(item) {
          const json = await cipher.decryptText(item.Data, decryptedKey, item.IV);
          if (item.Data.length > 0 && !json) {
            throw new Error('decrypt object failed');
          }
          delete item.IV;
          item.Data = JSON.parse(json);
          return item;
        }));

        if (this.listCtr.page === 1) {
          this.listData = newData;
        } else {
          this.listData = this.listData.concat(newData);
        }
        this.listCtr = {
          isRequesting: false,
          total: Math.ceil(resp.data.totalNum / PAGE_SIZE),
          totalNum: resp.data.totalNum,
          page: resp.data.page
        };
      } catch (e) {
        this.listCtr.isRequesting = false;
        this.$root.errorLogger(e, 'Unable to fetch data');
      }
    },
    async sendBackup() {
      const isConfirm = await this.$root.confirm('Send backup data by Email?');
      if (!isConfirm) {
        return;
      }
      try {
        await axios.post('/api/users/sendBackup');
        this.$root.success('Backup sent');
      } catch (e) {
        this.$root.errorLogger(e, 'Unable to send backup');
      }
    },
    patchListItem({id, data}) {
      const item = this.listData.find(function(item) {
        return item._id === id;
      });
      if (!item) {
        return;
      }
      item.Name = data.Name;
      item.Data = data.Data;
    },
    async deleteRecord(item, index) {
      const isConfirm = await this.$root.confirm(`Delete ${item.Name} ?`);
      if (!isConfirm) {
        return;
      }
      try {
        await axios.delete(`/api/records/${item._id}`);
        this.listData.splice(index, 1);
      } catch (e) {
        this.$root.errorLogger(e, 'Unable to delete');
      }
    },
    openEditRecord(item) {
      this.$refs.recordEditor.open(JSON.parse(JSON.stringify(item)));
    },
    async copyText(text) {
      const el = this.$el.querySelector('#copy-container');
      el.value = text;
      el.select();
      if (window.document.execCommand('copy')) {
        this.$root.success('Copied');
      }
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth;
    },
    isAdmin() {
      return this.$store.state.userInfo && this.$store.state.userInfo.AdminFlag;
    }
  }
};

</script>
<style lang="scss">
  .thoridal-list {
    padding: 32px 0 100px 0;
    .light-block {
      box-shadow: 0 2px 3px rgba(240, 240, 240, 0.5);
      background: #fff;
      border: 1px solid #ebebeb;
      border-radius: 3px;
      padding: 24px 32px;
      margin-bottom: 16px;
    }
    .action-row-container {
      display: flex;
      align-items: center;
      > * {
        flex-grow: 1;
        overflow-x: hidden;
      }
      .action-row {
        overflow-x: initial;
        flex-shrink: 0;
        flex-grow: 0;
        .el-button {
          padding: 0;
          margin-left: 16px;
          font-size: 22px;
        }
      }
    }
    .search .el-input{
      padding: 4px 0;
      .el-input__icon {
        font-size: 16px;
      }
      input {
          width: 5em;
          max-width: 100%;
          transition: all 0.5s ease;
          border-color: transparent;
      }
      input:focus {
        width: 15em;
        border-color: inherit;
      }
      &:hover,&.active {
        input {
          width: 15em;
          border-color: inherit;
        }
      }
    }
    .list-card {
      .action-row {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .title {
        word-break: break-all;
        margin: 0;
        padding: 12px 0;
      }
      .info-container {
        line-height: 20px;
        margin-bottom: 12px;
      }
      .iconfont {
        line-height: 20px;
        font-size: 16px;
        margin-right: 12px;
      }
      .pwd-mask.iconfont {
        font-size: 12px;
      }
      .info-container>p {
        color: #606266;
        cursor: pointer;
        padding: 12px 0;
        margin: 0;
        &:hover {
          color: inherit;
        }
      }
    }
    .list-card:hover {
      .action-row {
        opacity: 1;
      }
    }
    .custom-fileds-pre {
      white-space: pre-wrap;
    }
    .loadmore {
      text-align: center;
      padding: 16px 0;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.3s ease;
      .iconfont, .el-icon-loading {
        font-size: 24px;
      }
      &:hover {
        opacity: 1;
      }
    }
    .empyt-placeholder {
      text-align: center;
      padding: 150px 0;
      color: #909399b9;
      .iconfont {
        display: block;
        font-size: 120px;
      }
    }
    #copy-container {
      width: 10px;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .th-header-dropdown {
    .el-dropdown-menu__item .iconfont {
      margin-right: 6px;
    }
  }
  @media screen and (max-width:768px) {
    .thoridal-list {
      padding: 16px 0;
      .light-block {
        padding: 18px 24px;
      }
      .search .el-input {
        padding: 0;
      }
      .action-row-container .action-row .el-button{
        margin-left: 12px;
        font-size: 22px;
      }
    }
  }
</style>
