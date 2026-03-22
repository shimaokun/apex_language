<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Table, Button, Modal, Form, Checkbox, Cascader, Switch, TreeSelect, InputNumber, Mentions, message, Space } from 'ant-design-vue';
import { FileDoneOutlined, PlusOutlined } from '@ant-design/icons-vue';

const data = ref([
  { key: '1', standard: 'ISO 27001', control: 'A.9.1.1', desc: 'Access Control Policy', status: 'Compliant', score: 100 },
  { key: '2', standard: 'ISO 27001', control: 'A.9.2.1', desc: 'User Registration', status: 'Non-Compliant', score: 60 },
  { key: '3', standard: 'GDPR', control: 'Art. 32', desc: 'Security of Processing', status: 'Partial', score: 85 },
]);

const columns = [
  {
    title: 'Compliance Standard',
    children: [
      { title: 'Standard', dataIndex: 'standard', key: 'standard', width: 150, fixed: 'left' as const },
      { title: 'Control ID', dataIndex: 'control', key: 'control', width: 150 },
    ],
  },
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 150 },
  { title: 'Audit Score', dataIndex: 'score', key: 'score', width: 120 },
  { title: 'Action', key: 'action', width: 120, fixed: 'right' as const },
];

// Modal 1: Generate Report
const isReportModalVisible = ref(false);
const reportForm = reactive({
  sections: ['summary', 'findings'],
  department: [],
  sendEmail: true
});
const cascaderOptions = [
  { value: 'engineering', label: 'Engineering', children: [{ value: 'frontend', label: 'Frontend' }, { value: 'backend', label: 'Backend' }] },
  { value: 'hr', label: 'Human Resources' }
];
const handleReportSubmit = () => {
  message.success('Report generation started');
  isReportModalVisible.value = false;
};

// Modal 2: Add Policy
const isPolicyModalVisible = ref(false);
const policyForm = reactive({
  category: undefined,
  penalty: 0,
  notify: ''
});
const treeData = [
  { title: 'Access Control', value: 'access', children: [{ title: 'Password Policy', value: 'pwd' }] },
  { title: 'Data Protection', value: 'data' }
];
const handlePolicySubmit = () => {
  message.success('New policy added');
  isPolicyModalVisible.value = false;
};
</script>

<template>
  <div class="p-6 flex flex-col h-full">
    <div class="mb-4 flex justify-between items-center shrink-0">
      <h2 class="text-xl font-bold m-0">Compliance Audit</h2>
      <Space>
        <Button @click="isReportModalVisible = true">
          <template #icon><FileDoneOutlined /></template>
          Generate Report
        </Button>
        <Button type="primary" @click="isPolicyModalVisible = true">
          <template #icon><PlusOutlined /></template>
          Add Policy
        </Button>
      </Space>
    </div>

    <div class="bg-white rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
      <Table
        :columns="columns"
        :data-source="data"
        :scroll="{ x: 1000, y: 'calc(100vh - 300px)' }"
        class="flex-1"
        :pagination="false"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'action'">
            <Button type="link" size="small">Audit</Button>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template #summary>
          <Table.Summary.Row>
            <Table.Summary.Cell :index="0" :colSpan="4">Total Average Score</Table.Summary.Cell>
            <Table.Summary.Cell :index="1">
              <span class="font-bold text-lg">81.6</span>
            </Table.Summary.Cell>
            <Table.Summary.Cell :index="2"></Table.Summary.Cell>
          </Table.Summary.Row>
        </template>
      </Table>
    </div>

    <!-- Modal 1 -->
    <Modal v-model:open="isReportModalVisible" title="Generate Audit Report" @ok="handleReportSubmit">
      <Form layout="vertical" :model="reportForm" class="mt-4">
        <Form.Item label="Include Sections (Checkbox Group)">
          <Checkbox.Group v-model:value="reportForm.sections" :options="[{label: 'Executive Summary', value: 'summary'}, {label: 'Detailed Findings', value: 'findings'}, {label: 'Remediation Plan', value: 'plan'}]" />
        </Form.Item>
        <Form.Item label="Target Department (Cascader)">
          <Cascader v-model:value="reportForm.department" :options="cascaderOptions" placeholder="Please select" />
        </Form.Item>
        <Form.Item label="Send via Email (Switch)">
          <Switch v-model:checked="reportForm.sendEmail" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- Modal 2 -->
    <Modal v-model:open="isPolicyModalVisible" title="Add Compliance Policy" @ok="handlePolicySubmit">
      <Form layout="vertical" :model="policyForm" class="mt-4">
        <Form.Item label="Policy Category (TreeSelect)">
          <TreeSelect
            v-model:value="policyForm.category"
            :tree-data="treeData"
            placeholder="Please select category"
            tree-default-expand-all
          />
        </Form.Item>
        <Form.Item label="Penalty Score (InputNumber)">
          <InputNumber v-model:value="policyForm.penalty" :min="0" :max="100" class="w-full" />
        </Form.Item>
        <Form.Item label="Notify Auditors (Mentions)">
          <Mentions v-model:value="policyForm.notify" placeholder="Use @ to mention auditors">
            <Mentions.Option value="alice">Alice</Mentions.Option>
            <Mentions.Option value="bob">Bob</Mentions.Option>
          </Mentions>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
