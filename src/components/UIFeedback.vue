<script setup lang="ts">
import { ref } from 'vue';
import { 
  Card, Alert, Drawer, Message, Modal, Notification, 
  Popconfirm, Progress, Result, Skeleton, Spin, Watermark,
  Button, Space
} from 'ant-design-vue';
import { message, notification } from 'ant-design-vue';

// Drawer
const openDrawer = ref(false);

// Modal
const openModal = ref(false);

// Message & Notification
const showMessage = () => {
  message.success('This is a success message');
};
const showNotification = () => {
  notification.open({
    message: 'Notification Title',
    description: 'This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

// Popconfirm
const confirm = () => {
  message.success('Click on Yes');
};
const cancel = () => {
  message.error('Click on No');
};
</script>

<template>
  <div class="p-6 h-full overflow-y-auto bg-slate-50">
    <Watermark content="Ant Design Vue">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-slate-800 m-0">反馈 (Feedback)</h2>
        <p class="text-slate-500 mt-2">Ant Design Vue 反馈组件全集展示</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <!-- Alert -->
        <Card title="警告提示 (Alert)" class="rounded-xl shadow-sm">
          <Space direction="vertical" class="w-full">
            <Alert message="Success Text" type="success" />
            <Alert message="Info Text" type="info" />
            <Alert message="Warning Text" type="warning" />
            <Alert message="Error Text" type="error" />
            <Alert message="Success Tips" description="Detailed description and advice about successful copywriting." type="success" show-icon />
          </Space>
        </Card>

        <!-- Message, Notification, Modal, Drawer -->
        <Card title="全局提示 & 弹窗 (Message, Modal, Drawer)" class="rounded-xl shadow-sm">
          <Space direction="vertical" size="middle">
            <Space>
              <Button type="primary" @click="showMessage">Show Message</Button>
              <Button @click="showNotification">Show Notification</Button>
            </Space>
            <Space>
              <Button type="primary" @click="openModal = true">Open Modal</Button>
              <Button @click="openDrawer = true">Open Drawer</Button>
            </Space>
            <Popconfirm
              title="Are you sure delete this task?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="confirm"
              @cancel="cancel"
            >
              <Button danger>Delete Task (Popconfirm)</Button>
            </Popconfirm>
          </Space>

          <Modal v-model:open="openModal" title="Basic Modal" @ok="openModal = false">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>

          <Drawer v-model:open="openDrawer" class="custom-class" root-class-name="root-class-name" :root-style="{ color: 'blue' }" style="color: red" title="Basic Drawer" placement="right">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
        </Card>

        <!-- Progress -->
        <Card title="进度条 (Progress)" class="rounded-xl shadow-sm">
          <Space direction="vertical" class="w-full">
            <Progress :percent="30" />
            <Progress :percent="50" status="active" />
            <Progress :percent="70" status="exception" />
            <Progress :percent="100" />
            <Space>
              <Progress type="circle" :percent="75" />
              <Progress type="circle" :percent="70" status="exception" />
              <Progress type="circle" :percent="100" />
            </Space>
          </Space>
        </Card>

        <!-- Spin & Skeleton -->
        <Card title="加载中 & 骨架屏 (Spin & Skeleton)" class="rounded-xl shadow-sm">
          <Space direction="vertical" class="w-full" size="large">
            <Space size="large">
              <Spin size="small" />
              <Spin />
              <Spin size="large" />
            </Space>
            <Spin tip="Loading...">
              <div class="p-4 bg-slate-100 rounded border border-slate-200">
                Data is loading, please wait...
              </div>
            </Spin>
            <Skeleton active />
          </Space>
        </Card>

        <!-- Result -->
        <Card title="结果 (Result)" class="rounded-xl shadow-sm md:col-span-2">
          <Result
            status="success"
            title="Successfully Purchased Cloud Server ECS!"
            sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          >
            <template #extra>
              <Button key="console" type="primary">Go Console</Button>
              <Button key="buy">Buy Again</Button>
            </template>
          </Result>
        </Card>
      </div>
    </Watermark>
  </div>
</template>
