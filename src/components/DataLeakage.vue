<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Table, Button, Modal, Form, Input, Select, Descriptions, Rate, Space, Tag, message } from 'ant-design-vue';
import { MinusCircleOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';

const data = ref([
  { key: '1', rule: 'Credit Card Numbers', matches: 15, source: 'Email', status: 'Blocked' },
  { key: '2', rule: 'Source Code (Java)', matches: 3, source: 'Git Push', status: 'Alerted' },
  { key: '3', rule: 'SSN', matches: 42, source: 'Cloud Storage', status: 'Blocked' },
]);

const columns = [
  { title: 'Triggered Rule', dataIndex: 'rule', key: 'rule' },
  { title: 'Match Count', dataIndex: 'matches', key: 'matches' },
  { title: 'Data Source', dataIndex: 'source', key: 'source' },
  { title: 'Action Taken', dataIndex: 'status', key: 'status' },
  { title: 'Action', key: 'action' },
];

// Modal 1: Create Rule
const isRuleModalVisible = ref(false);
const dynamicForm = reactive({
  ruleName: '',
  action: 'block',
  patterns: [{ value: '' }]
});
const removePattern = (item: any) => {
  const index = dynamicForm.patterns.indexOf(item);
  if (index !== -1) {
    dynamicForm.patterns.splice(index, 1);
  }
};
const addPattern = () => {
  dynamicForm.patterns.push({ value: '' });
};
const handleRuleSubmit = () => {
  message.success('DLP Rule created');
  isRuleModalVisible.value = false;
};

// Modal 2: Incident Details
const isIncidentModalVisible = ref(false);
const incidentForm = reactive({
  severity: 3
});
const handleIncidentSubmit = () => {
  message.success('Incident updated');
  isIncidentModalVisible.value = false;
};
</script>

<template>
  <div class="p-6 flex flex-col h-full">
    <div class="mb-4 flex justify-between items-center shrink-0">
      <h2 class="text-xl font-bold m-0">Data Leakage Prevention</h2>
      <Button type="primary" @click="isRuleModalVisible = true">
        <template #icon><PlusOutlined /></template>
        Create DLP Rule
      </Button>
    </div>

    <div class="bg-white rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
      <Table
        :columns="columns"
        :data-source="data"
        :scroll="{ y: 'calc(100vh - 300px)' }"
        class="flex-1"
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'rule'">
            <span class="text-indigo-600 font-bold">
              {{ column.title }} (Custom Header)
            </span>
          </template>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'status'">
            <Tag :color="text === 'Blocked' ? 'red' : 'orange'">{{ text }}</Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" size="small" @click="isIncidentModalVisible = true">Investigate</Button>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </Table>
    </div>

    <!-- Modal 1 -->
    <Modal v-model:open="isRuleModalVisible" title="Create DLP Rule" @ok="handleRuleSubmit">
      <Form layout="vertical" :model="dynamicForm" class="mt-4">
        <Form.Item label="Rule Name">
          <Input v-model:value="dynamicForm.ruleName" placeholder="e.g., Detect PII" />
        </Form.Item>
        <Form.Item label="Action (Select)">
          <Select v-model:value="dynamicForm.action" :options="[{value: 'block', label: 'Block & Alert'}, {value: 'alert', label: 'Alert Only'}]" />
        </Form.Item>
        
        <div class="mb-2 font-medium">Regex Patterns (Dynamic Form Items)</div>
        <Space v-for="(pattern, index) in dynamicForm.patterns" :key="index" style="display: flex; margin-bottom: 8px" align="baseline">
          <Form.Item
            :name="['patterns', index, 'value']"
            :rules="{ required: true, message: 'Missing pattern' }"
            class="mb-0"
          >
            <Input v-model:value="pattern.value" placeholder="Regex pattern" />
          </Form.Item>
          <MinusCircleOutlined @click="removePattern(pattern)" class="text-red-500 hover:text-red-700 cursor-pointer" />
        </Space>
        <Form.Item class="mt-2">
          <Button type="dashed" block @click="addPattern">
            <PlusOutlined /> Add Pattern
          </Button>
        </Form.Item>
      </Form>
    </Modal>

    <!-- Modal 2 -->
    <Modal v-model:open="isIncidentModalVisible" title="Incident Investigation" @ok="handleIncidentSubmit">
      <Descriptions title="Incident Summary (Descriptions)" bordered :column="1" class="mb-6 mt-4">
        <Descriptions.Item label="Time">2023-10-22 14:05:12</Descriptions.Item>
        <Descriptions.Item label="User">john.doe@example.com</Descriptions.Item>
        <Descriptions.Item label="Matched Content">****-****-****-1234</Descriptions.Item>
      </Descriptions>
      
      <Form layout="vertical" :model="incidentForm">
        <Form.Item label="Override Severity (Rate)">
          <Rate v-model:value="incidentForm.severity" />
        </Form.Item>
        <Form.Item label="Evidence">
          <Button type="dashed">
            <template #icon><DownloadOutlined /></template>
            Download Encrypted Payload
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
