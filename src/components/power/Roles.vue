<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2!==0?'bdtop':'','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="editRole(scope.row.id)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="delRole(scope.row.id)"
            >删除</el-button>
            <el-button
              icon="el-icon-setting"
              type="warning"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%" @close="addDialogClosed">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="80px"
        addDialogClosed
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoleForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="editRoleDialog" width="50%" @close="editDialogClosed">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="80px"
        addDialogClosed
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialog" width="50%" @close="setDialogClosed">
      <el-tree
        :data="rightList"
        :props="rightProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoleDialog: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      editRoleDialog: false,
      editForm: {},
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      setRightDialog: false,
      rightList: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      // 树形结构默认选中的
      defaultKeys: [],
      // 选中分配角色的id
      roleId: ''
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    // 获取角色列表
    async getrolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res, 'getRolesList')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.$message.success('获取角色列表成功')
    },
    // 点击显示添加角色对话框
    async addRoles() {
      this.addRoleDialog = true
    },
    // 添加角色
    addRoleForm() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid, '==valid')
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        console.log(res, '===addrole')
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.addRoleDialog = false
        this.getrolesList()
        this.$message.success('添加角色成功')
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑角色信息
    async editRole(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data
      this.editRoleDialog = true
    },

    // 提交编辑角色信息
    async editRoleForm() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色信息失败')
      }
      this.editRoleDialog = false
      this.getrolesList()
      this.$message.success('更新角色信息成功')
    },
    // 编辑角色对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 删除角色
    async delRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.getrolesList()
      this.$message.success('删除成功')
    },
    // 根据id删除右侧角色
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      console.log(role, rightId, '==rightId')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      console.log(res, '==rightId')
      role.children = res.data
      this.$message.success('删除成功')
    },
    // 权限分配对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      console.log(this.roleId, '===this.roleId')
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res, 'right===')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限失败')
      }
      this.rightList = res.data
      // 递归获得三级节点的Id
      this.getDefultKeys(role, this.defaultKeys)
      console.log(this.defaultKeys, '===this.defaultKeys')
      this.setRightDialog = true
    },
    // 默认选中keys
    getDefultKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getDefultKeys(item, arr)
      })
    },
    // 提交分配权限
    async setRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keyStr }
      )
      console.log(res, '====ress')
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.getrolesList()
      this.setRightDialog = false
      this.$message.success('分配权限成功')
    },
    // 权限分配对话框关闭
    setDialogClosed() {}
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 6px 10px 0;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
