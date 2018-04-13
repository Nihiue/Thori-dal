<template>
  <div class="container thoridal-list">
    <div class="light-block list-header">
      <div class="search">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="icons">
        <el-button-group>
          <el-button icon="el-icon-plus"></el-button>
          <el-button icon="el-icon-refresh"></el-button>
          <el-button icon="el-icon-more"></el-button>
        </el-button-group>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
  .thoridal-list {
    padding: 10vh 0;
    .light-block {
      background: #fff; // border: 1px solid #ebebeb;
      border-radius: 3px;
      padding: 30px;
    }
    .list-header {
      display: flex;
      >div {
        width: 50%;
      }
      >.icons {
        text-align: right;

      }
      .el-input {
        max-width: 16em;
      }
    }
  }

</style>
