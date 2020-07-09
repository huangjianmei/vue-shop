<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          {{scope.row.level}}
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialog" width="50%" @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialog"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCates">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类的数据列表
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialog: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      editCateDialog: false,
      editCateForm: {},
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      this.$message.success('获取商品分类成功')
      console.log(this.cateList, '=====this.cateList')
    },
    // 切换每页的显示条数
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCateList()
    },
    // 切换页码
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCateList()
    },
    // 编辑分类
    async editCate(row) {
      this.editCateDialog = true
      console.log(row, '===id')
      const { data: res } = await this.$http.get(`categories/${row.cat_id}`)
      console.log(res, '==编辑分类')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.$message.success('获取分类成功')
      this.editCateForm = res.data
    },
    // 提交编辑分类
    async editCates() {
      console.log('提交编辑分类')
      const { data: res } = await this.$http.put(
        `categories/${this.editCateForm.cat_id}`,
        {
          cat_name: this.editCateForm.cat_name
        }
      )
      console.log(res, '==提交编辑分类')
      if (res.meta.status !== 200) {
        return this.$message.error('更新分类失败')
      }
      this.$message.success('更新分类成功')
      this.editCateDialog = false
      this.getCateList()
    },
    // 监听编辑分类关闭事件
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateDialog = false
    },
    // 删除分类
    async deleteCate(row) {
      console.log(row, '删除分类')
      const { data: res } = await this.$http.delete(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getCateList()
    },
    // 点击显示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialog = true
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.$message.success('获取父级分类列表成功')
      console.log(res, 'categories')
      this.parentCateList = res.data
    },
    // 监听父级分类change时间
    handleChange() {
      console.log(this.selectedKeys, '==selectedKeys')
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 关闭添加分类对话框
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 提交添加分类对话框
    async addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        console.log(res, '==res')
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.addCateDialog = false
        this.$message.success('添加分类成功')
      })

      // console.log(this.addCateForm, '====cat')
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
