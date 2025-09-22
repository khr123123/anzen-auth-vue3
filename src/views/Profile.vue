<template>
   <div class="profile-page app">
      <a-card title="个人信息">
         <a-form ref="formRef" :model="form" :rules="rules">
            <!-- 头像 -->
            <a-form-item label="头像" field="avatar">
               <a-space direction="vertical" :style="{ width: '100%' }">
                  <a-upload action="http://localhost:8080/api/upload"
                     :headers="{ Authorization: `Bearer ${tokenStore.token}` }" :file-list="fileList"
                     :show-file-list="false" @before-upload="beforeUpload" @change="handleUploadChange">

                     <template #upload-button>
                        <div
                           :class="`arco-upload-list-item${fileList.length && fileList[0].status === 'error' ? ' arco-upload-list-item-error' : ''}`">
                           <div class="arco-upload-list-picture custom-upload-avatar" v-if="form.avatar">
                              <img :src="form.avatar" />
                              <div class="arco-upload-list-picture-mask">
                                 <IconEdit />
                              </div>
                           </div>
                           <div class="arco-upload-picture-card" v-else>
                              <div class="arco-upload-picture-card-text">
                                 <IconPlus />
                                 <div style="margin-top: 10px; font-weight: 600">Upload</div>
                              </div>
                           </div>
                        </div>
                     </template>
                  </a-upload>
               </a-space>
            </a-form-item>

            <!-- 用户名 -->
            <a-form-item label="昵称" field="nickname">
               <a-input v-model="form.nickname" placeholder="请输入昵称" />
            </a-form-item>

            <!-- 邮箱 -->
            <a-form-item label="邮箱" field="email">
               <a-input v-model="form.email" placeholder="请输入邮箱" />
            </a-form-item>

            <!-- 提交按钮 -->
            <a-form-item wrapper-col="{ offset: 6, span: 16 }">
               <a-button type="primary" @click="handleSubmit">保存修改</a-button>
            </a-form-item>
         </a-form>
      </a-card>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message, type FormInstance } from '@arco-design/web-vue'
import { useUserStore } from '@/store/userStore'
import { UploadFile } from '@arco-design/web-vue'
import { useTokenStore } from '@/store/tokenStore'
import { updateUser } from '@/api/sysUserController'

const tokenStore = useTokenStore()
const userStore = useUserStore()
const user = userStore.userInfo.user
const form = ref({ ...user })
const formRef = ref<FormInstance | null>(null)

// 上传文件列表
const fileList = ref<UploadFile[]>(form.value.avatar ? [{ url: form.value.avatar, status: 'done' }] : [])

// 表单验证规则
const rules = {
   nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
   email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
   ],
}

// 上传前校验
const beforeUpload = (file: File) => {
   console.log(file);
   const isImage = file.type.startsWith('image/')
   if (!isImage) Message.error('只能上传图片！')
   const isLt2M = file.size / 1024 / 1024 < 2
   if (!isLt2M) Message.error('图片大小不能超过2MB！')
   return isImage && isLt2M
}
// 上传状态变化
const handleUploadChange = (_, currentFile: any) => {
   if (!currentFile) return
   if (currentFile.status === 'done') {
      Message.success('上传成功')
      const fileUrl = currentFile.response?.url
      form.value.avatar = fileUrl
   } else if (currentFile.status === 'error') {
      Message.error('上传失败')
   }
}
// 保存修改
const handleSubmit = async () => {
   const res = await formRef.value.validate()
   if (res) return
   updateUser({
      userId: user.userId,
      nickname: form.value.nickname,
      email: form.value.email,
      avatar: form.value.avatar,
   }).then(() => {
      userStore.updateUser(form.value)
      Message.success('修改成功')
   }).catch((e) => {
      console.log(e);
   })
}
</script>

<style scoped>
.profile-page {
   background-color: var(--color-bg-1);
   min-height: 80vh;
   padding-top: 20px;
}

.custom-upload-avatar img {
   width: 100%;
   /* 图片宽度铺满容器 */
   height: 100%;
   /* 图片高度铺满容器 */
   object-fit: cover;
   /* 保持比例裁剪，铺满容器 */
   display: block;
   /* 避免 inline 元素多余空隙 */
   border-radius: 50%;
   /* 如果想要圆形头像 */
}

/* 如果外层容器固定大小，保证图片居中 */
.custom-upload-avatar {
   width: 100px;
   /* 容器宽度 */
   height: 100px;
   /* 容器高度 */
   overflow: hidden;
   /* 裁剪超出部分 */
   display: flex;
   justify-content: center;
   align-items: center;
   /* 垂直水平居中 */
}
</style>
