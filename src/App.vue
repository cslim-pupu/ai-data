<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <h2 class="app-title">案例数据管理工具</h2>
          <el-menu
            :default-active="$route.path"
            mode="horizontal"
            background-color="#409EFF"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            class="nav-menu"
          >
            <el-menu-item index="/form">
              <el-icon><EditPen /></el-icon>
              <span>填写案例</span>
            </el-menu-item>
            <el-menu-item index="/list">
              <el-icon><List /></el-icon>
              <span>案例列表</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { EditPen, List } from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    EditPen,
    List
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

body {
  margin: 0;
  padding: 0;
}

.app-header {
  background-color: #409EFF;
  color: white;
  padding: 0;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  border: none;
  background-color: transparent !important;
}

.nav-menu .el-menu-item {
  border-bottom: none !important;
  color: #fff !important;
}

.nav-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.nav-menu .el-menu-item.is-active {
  background-color: rgba(255, 208, 75, 0.2) !important;
  color: #ffd04b !important;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  
  .app-header {
    height: auto;
  }
  
  .app-title {
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>