<template>
  <div class="container thoridal-list">
    <div class="light-block list-header">
      <div class="search">
        <form @submit.prevent="fetchRecordList(1)">
          <el-input size="small" v-model="searchInput" prefix-icon="el-icon-search"></el-input>
        </form>
      </div>
      <div class="action-row">
        <el-button type="text" icon="el-icon-refresh" @click="refreshList()"></el-button>
        <el-button type="text" icon="el-icon-plus" @click="addRecord()"></el-button>
        <el-dropdown @command="handleHeadDropdown" trigger="click">
          <el-button type="text" icon="el-icon-more"></el-button>
          <el-dropdown-menu slot="dropdown" class="th-header-dropdown">
            <el-dropdown-item command="modify-password"><span class="iconfont icon-edit"></span> 修改密码</el-dropdown-item>
            <el-dropdown-item command="send-backup"><span class="iconfont icon-modify"></span> 备份数据</el-dropdown-item>
            <el-dropdown-item command="create-user" divided v-if="isAdmin"><span class="iconfont icon-collection"></span> 创建用户</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="list-content">
      <div class="light-block list-card" v-for="(item, itemIndex) in listData" :key="item._id">
        <div class="action-row">
          <el-button type="text" icon="el-icon-edit" @click="openEditRecord(item)"></el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteRecord(item, itemIndex)"></el-button>
        </div>
        <h2 class="title">{{item.Name}}</h2>
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
            <pre>{{field.Value}}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="loadmore" v-show="listCtr.page < listCtr.total" @click="fetchRecordList(listCtr.page + 1)" :title="listCtr.page + '/' + listCtr.total ">
      <span class="iconfont icon-down"></span>
    </div>
    <div class="empyt-placeholder" v-show="listData.length === 0">
      <span class="iconfont icon-emptybox"></span>
    </div>
    <record-editor ref="recordEditor" @refresh-list="refreshList" @patch-item="patchListItem"></record-editor>
    <user-creator ref="userCreator"></user-creator>
    <input type="text" id="copy-container">
  </div>
</template>
<script>
import axios from 'axios';
import recordEditorView from '../components/recordEditor';
import userCreatorView from '../components/userCreator';
import { decryptAES } from '../utils';

const PAGE_SIZE = 15;

export default {
  components: {
    'user-creator': userCreatorView,
    'record-editor': recordEditorView
  },
  data() {
    return {
      searchInput: '',
      listData: [],
      listCtr: {
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
    refreshList() {
      this.fetchRecordList(1);
    },
    addRecord() {
      this.$refs.recordEditor.open({
        Name: '',
        Data: {}
      });
    },
    handleHeadDropdown(cmd) {
      switch (cmd) {
        case 'modify-password':
          this.$root.confirm('此功能尚在开发中');
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
      try {
        this.listCtr.page = page;
        const resp = await axios.get('/api/records', {
          params: {
            pageSize: PAGE_SIZE,
            page,
            Name: this.searchInput,
            Type: 0
          }
        });
        this.listCtr = {
          total: Math.ceil(resp.data.totalNum / PAGE_SIZE),
          totalNum: resp.data.totalNum,
          page: resp.data.page
        };
        const newData = resp.data.data.map((item) => {
          if (item.Data) {
            let text = decryptAES(item.Data, this.auth.password);
            item.Data = text ? JSON.parse(text) : {};
          } else {
            item.Data = {};
          }
          return item;
        });
        if (this.listCtr.page === 1) {
          this.listData = newData;
        } else {
          this.listData = this.listData.concat(newData);
        }
      } catch (e) {
        this.$root.errorLogger(e, '获取数据失败');
      }
    },
    async sendBackup() {
      const isConfirm = await this.$root.confirm('发送备份数据到邮箱？');
      if (!isConfirm) {
        return;
      }
      try {
        await axios.post('/api/users/sendBackup');
        this.$root.success('备份数据已发送');
      } catch (e) {
        this.$root.errorLogger(e, '备份发送失败');
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
      const isConfirm = await this.$root.confirm(`确认删除 ${item.Name} ?`);
      if (!isConfirm) {
        return;
      }
      try {
        await axios.delete(`/api/records/${item._id}`);
        this.listData.splice(index, 1);
      } catch (e) {
        this.$root.errorLogger(e, '删除出错');
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
        this.$root.success('已复制');
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
    .action-row {
      position: absolute;
      right: 32px;
      top: 28px;
      .el-button {
        padding: 0;
        margin-left: 16px;
        font-size: 22px;
      }
    }
    .list-header {
      position: relative;
      .el-input {
        max-width: 16em;
      }
    }
    .list-card {
      position: relative;
      .action-row {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .title {
        margin-top: 0;
      }
      .info-container {
        line-height: 20px;
        margin: 12px 0;
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
    .loadmore {
      text-align: center;
      padding: 16px 0;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.3s ease;
      .iconfont {
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
      opacity: 0;
      pointer-events: none;
      z-index: -1;
      position: fixed;
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
      .list-header {
        .el-input {
          max-width: 50vw;
        }
      }
    }
  }
</style>
