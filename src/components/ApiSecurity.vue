<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Table, Button, Modal, Form, InputNumber, Select, Switch, Radio, Input, Upload, message, Space } from 'ant-design-vue';
import { SettingOutlined, UploadOutlined } from '@ant-design/icons-vue';

const data = ref([
  {
    key: '1',
    name: 'Payment Service',
    endpoint: '/api/v1/payments',
    auth: 'OAuth 2.0',
    traffic: 'High',
    children: [
      { key: '1-1', name: 'Create Payment', endpoint: 'POST /api/v1/payments', auth: 'OAuth 2.0', traffic: 'High' },
      { key: '1-2', name: 'Get Payment', endpoint: 'GET /api/v1/payments/:id', auth: 'OAuth 2.0', traffic: 'Medium' },
    ],
  },
  {
    key: '2',
    name: 'User Service',
    endpoint: '/api/v1/users',
    auth: 'JWT',
    traffic: 'Medium',
    children: [
      { key: '2-1', name: 'Get Profile', endpoint: 'GET /api/v1/users/me', auth: 'JWT', traffic: 'Medium' },
    ],
  },
]);

const columns = [
  { title: 'Service / Endpoint', dataIndex: 'name', key: 'name' },
  { title: 'Path', dataIndex: 'endpoint', key: 'endpoint' },
  { title: 'Auth Method', dataIndex: 'auth', key: 'auth' },
  { title: 'Traffic Volume', dataIndex: 'traffic', key: 'traffic' },
  { title: 'Action', key: 'action' },
];

// Modal 1: Rate Limiting
const isRateModalVisible = ref(false);
const rateForm = reactive({
  requests: 100,
  window: 'minute',
  banIp: true
});
const handleRateSubmit = () => {
  message.success('Rate limit applied');
  isRateModalVisible.value = false;
};

// Modal 2: Auth Config
const isAuthModalVisible = ref(false);
const authForm = reactive({
  type: 'jwt',
  issuer: '',
  cert: []
});
const handleAuthSubmit = () => {
  message.success('Authentication configuration saved');
  isAuthModalVisible.value = false;
};
</script>

<template>
  <div class="p-6 flex flex-col h-full">
    <div class="mb-4 flex justify-between items-center shrink-0">
      <h2 class="text-xl font-bold m-0">API Security</h2>
      <Space>
        <Button @click="isRateModalVisible = true">Global Rate Limits</Button>
        <Button type="primary" @click="isAuthModalVisible = true">
          <template #icon><SettingOutlined /></template>
          Auth Config
        </Button>
      </Space>
    </div>

    <div class="bg-white rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
      <Table
        :columns="columns"
        :data-source="data"
        class="flex-1 overflow-y-auto"
        :pagination="{ position: ['bottomCenter'], pageSize: 10 }"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'action'">
            <Button type="link" size="small">Configure Endpoint</Button>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </Table>
    </div>

    <!-- Modal 1 -->
    <Modal v-model:open="isRateModalVisible" title="Configure Rate Limiting" @ok="handleRateSubmit">
      <Form layout="vertical" :model="rateForm" class="mt-4">
        <Form.Item label="Max Requests (InputNumber)">
          <InputNumber v-model:value="rateForm.requests" :min="1" class="w-full" />
        </Form.Item>
        <Form.Item label="Time Window (Select)">
          <Select v-model:value="rateForm.window" :options="[{value: 'second', label: 'Per Second'}, {value: 'minute', label: 'Per Minute'}, {value: 'hour', label: 'Per Hour'}]" />
        </Form.Item>
        <Form.Item label="Auto-Ban IP on Violation (Switch)">
          <Switch v-model:checked="rateForm.banIp" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- Modal 2 -->
    <Modal v-model:open="isAuthModalVisible" title="Authentication Configuration" @ok="handleAuthSubmit">
      <Form layout="vertical" :model="authForm" class="mt-4">
        <Form.Item label="Auth Type (Radio Group)">
          <Radio.Group v-model:value="authForm.type">
            <Radio value="jwt">JWT</Radio>
            <Radio value="oauth">OAuth 2.0</Radio>
            <Radio value="apikey">API Key</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Issuer URL (Input)" v-if="authForm.type !== 'apikey'">
          <Input v-model:value="authForm.issuer" placeholder="https://auth.example.com" />
        </Form.Item>
        <Form.Item label="Public Certificate (Upload)" v-if="authForm.type === 'jwt'">
          <Upload action="/api/upload" :file-list="authForm.cert">
            <Button>
              <template #icon><UploadOutlined /></template>
              Upload .pem / .crt
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
