<template>
  <div>
    <el-container class="home-container">
      <el-header>
        <div class="header-left">
          <!-- <img src="../assets/heima.png" alt /> -->
          <span>电商管理后台系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px':'200px'">
          <div class="toggle-button" @click="toggleMenu">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="saveActivePath('/'+subitem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数组
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = sessionStorage.activePath
  },
  methods: {
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
      console.log('退出成功')
    },
    // 获取左侧菜单列表
    async getMenuList() {
      // eslint-disable-next-line no-unused-vars
      const { data: res } = await this.$http.get('menus')
      console.log(res, 'home-res===')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮展开、折叠左侧菜单
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath(activePath) {
      sessionStorage.activePath = activePath
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  color: #fff;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border: none;
  }
  .toggle-button {
    background: #4a5064;
    font-size: 10px;
    color: #fff;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background: #eaedf1;
}
.iconfont {
  margin-right: 6px;
}
</style>
