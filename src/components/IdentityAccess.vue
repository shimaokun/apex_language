<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Table, Button, Modal, Form, Transfer, DatePicker, Input, Select, Alert, Avatar, Space, message } from 'ant-design-vue';
import { UserOutlined, SafetyOutlined } from '@ant-design/icons-vue';

const data = ref([
  { key: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', mfa: 'Enabled', lastLogin: '2023-10-20 09:00' },
  { key: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'Developer', mfa: 'Disabled', lastLogin: '2023-10-19 14:30' },
  { key: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', mfa: 'Enabled', lastLogin: '2023-10-21 10:15' },
]);

const columns = [
  { title: 'User', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'MFA Status', dataIndex: 'mfa', key: 'mfa' },
  { title: 'Last Login', dataIndex: 'lastLogin', key: 'lastLogin' },
  { title: 'Action', key: 'action' },
];

const selectedRowKeys = ref<string[]>([]);
const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys;
};
const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
  selections: [
    Table.SELECTION_ALL,
    Table.SELECTION_INVERT,
    {
      key: 'odd',
      text: 'Select Odd Rows',
      onSelect: (changableRowKeys: string[]) => {
        let newSelectedRowKeys = [];
        newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
          if (index % 2 !== 0) return false;
          return true;
        });
        selectedRowKeys.value = newSelectedRowKeys;
      },
    },
    {
      key: 'even',
      text: 'Select Even Rows',
      onSelect: (changableRowKeys: string[]) => {
        let newSelectedRowKeys = [];
        newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
          if (index % 2 !== 0) return true;
          return false;
        });
        selectedRowKeys.value = newSelectedRowKeys;
      },
    },
  ],
};

// Modal 1: Assign Role
const isRoleModalVisible = ref(false);
const roleForm = reactive({
  roles: ['viewer'],
  expiration: null
});
const mockRoles = [
  { key: 'admin', title: 'Administrator' },
  { key: 'developer', title: 'Developer' },
  { key: 'viewer', title: 'Viewer' },
  { key: 'auditor', title: 'Auditor' },
];
const handleRoleSubmit = () => {
  message.success('Roles updated successfully');
  isRoleModalVisible.value = false;
};

// Modal 2: Reset MFA
const isMfaModalVisible = ref(false);
const mfaForm = reactive({
  password: '',
  method: 'authenticator'
});
const handleMfaSubmit = () => {
  message.success('MFA reset link sent to user');
  isMfaModalVisible.value = false;
};
</script>

<template>
  <div class="p-6 flex flex-col h-full">
    <div class="mb-4 flex justify-between items-center shrink-0">
      <h2 class="text-xl font-bold m-0">Identity & Access</h2>
      <Space>
        <Button @click="isRoleModalVisible = true" :disabled="selectedRowKeys.length === 0">Assign Roles</Button>
        <Button type="primary" danger @click="isMfaModalVisible = true" :disabled="selectedRowKeys.length !== 1">
          <template #icon><SafetyOutlined /></template>
          Reset MFA
        </Button>
      </Space>
    </div>

    <div class="bg-white rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
      <Table
        :columns="columns"
        :data-source="data"
        :row-selection="rowSelection"
        class="flex-1 overflow-y-auto"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'name'">
            <Space>
              <Avatar class="bg-indigo-500"><template #icon><UserOutlined /></template></Avatar>
              <span class="font-medium">{{ text }}</span>
            </Space>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" size="small">View Profile</Button>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </Table>
    </div>

    <!-- Modal 1 -->
    <Modal v-model:open="isRoleModalVisible" title="Assign Roles" @ok="handleRoleSubmit" width="600px">
      <Form layout="vertical" :model="roleForm" class="mt-4">
        <Form.Item label="Select Roles (Transfer)">
          <Transfer
            v-model:target-keys="roleForm.roles"
            :data-source="mockRoles"
            :render="item => item.title"
            :titles="['Available Roles', 'Assigned Roles']"
          />
        </Form.Item>
        <Form.Item label="Role Expiration (DatePicker)">
          <DatePicker v-model:value="roleForm.expiration" class="w-full" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- Modal 2 -->
    <Modal v-model:open="isMfaModalVisible" title="Reset MFA Device" @ok="handleMfaSubmit">
      <Alert message="Warning: Resetting MFA will invalidate the user's current authenticator app." type="warning" show-icon class="mb-4" />
      <Form layout="vertical" :model="mfaForm">
        <Form.Item label="Admin Password Verification (Input.Password)">
          <Input.Password v-model:value="mfaForm.password" placeholder="Enter your admin password to confirm" />
        </Form.Item>
        <Form.Item label="New MFA Method (Select)">
          <Select v-model:value="mfaForm.method" :options="[{value: 'authenticator', label: 'Authenticator App'}, {value: 'sms', label: 'SMS Token'}]" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
