<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Table, Button, Modal, Form, DatePicker, Select, Slider, Radio, Textarea, Upload, message, Tag, Space } from 'ant-design-vue';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';

const data = ref([
  { id: 'CVE-2023-1234', name: 'Apache Log4j RCE', severity: 'Critical', status: 'Open', date: '2023-10-01', desc: 'A critical remote code execution vulnerability in Apache Log4j.' },
  { id: 'CVE-2023-5678', name: 'Nginx Buffer Overflow', severity: 'High', status: 'In Progress', date: '2023-10-05', desc: 'Buffer overflow in Nginx worker process.' },
  { id: 'CVE-2023-9012', name: 'OpenSSL Memory Leak', severity: 'Medium', status: 'Resolved', date: '2023-10-10', desc: 'Memory leak in OpenSSL handling specific certificates.' },
]);

const columns = [
  { title: 'CVE ID', dataIndex: 'id', key: 'id' },
  { title: 'Vulnerability Name', dataIndex: 'name', key: 'name' },
  { 
    title: 'Severity', 
    dataIndex: 'severity', 
    key: 'severity',
    filters: [
      { text: 'Critical', value: 'Critical' },
      { text: 'High', value: 'High' },
      { text: 'Medium', value: 'Medium' },
    ],
    onFilter: (value: string, record: any) => record.severity.indexOf(value) === 0,
  },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Publish Date', dataIndex: 'date', key: 'date', sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime() },
  { title: 'Action', key: 'action' },
];

const selectedRowKeys = ref<string[]>([]);
const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys;
};

// Modal 1: New Scan Task
const isScanModalVisible = ref(false);
const scanForm = reactive({
  dateRange: [],
  targets: [],
  intensity: 50
});
const handleScanSubmit = () => {
  message.success('New scan task created successfully');
  isScanModalVisible.value = false;
};

// Modal 2: Ignore Vulnerability
const isIgnoreModalVisible = ref(false);
const ignoreForm = reactive({
  reason: 'false_positive',
  justification: '',
  evidence: []
});
const handleIgnoreSubmit = () => {
  message.success('Vulnerability ignored');
  isIgnoreModalVisible.value = false;
};
</script>

<template>
  <div class="p-6 flex flex-col h-full">
    <div class="mb-4 flex justify-between items-center shrink-0">
      <h2 class="text-xl font-bold m-0">Vulnerability Scanning</h2>
      <Space>
        <Button @click="isIgnoreModalVisible = true" :disabled="selectedRowKeys.length === 0">Ignore Selected</Button>
        <Button type="primary" @click="isScanModalVisible = true">
          <template #icon><PlusOutlined /></template>
          New Scan Task
        </Button>
      </Space>
    </div>

    <div class="bg-white rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
      <Table
        :columns="columns"
        :data-source="data"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        class="flex-1 overflow-y-auto"
        :pagination="{ pageSize: 10 }"
      >
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">{{ record.desc }}</p>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'severity'">
            <Tag :color="text === 'Critical' ? 'purple' : text === 'High' ? 'red' : 'orange'">{{ text }}</Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" size="small">View Details</Button>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </Table>
    </div>

    <!-- Modal 1 -->
    <Modal v-model:open="isScanModalVisible" title="Create New Scan Task" @ok="handleScanSubmit">
      <Form layout="vertical" :model="scanForm" class="mt-4">
        <Form.Item label="Scan Window (RangePicker)">
          <DatePicker.RangePicker v-model:value="scanForm.dateRange" class="w-full" />
        </Form.Item>
        <Form.Item label="Target Assets (Select Multiple)">
          <Select
            v-model:value="scanForm.targets"
            mode="multiple"
            placeholder="Select target servers or IP ranges"
            :options="[{value: 'web-cluster', label: 'Web Cluster'}, {value: 'db-servers', label: 'Database Servers'}]"
          />
        </Form.Item>
        <Form.Item label="Scan Intensity (Slider)">
          <Slider v-model:value="scanForm.intensity" :marks="{ 0: 'Low', 50: 'Normal', 100: 'Aggressive' }" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- Modal 2 -->
    <Modal v-model:open="isIgnoreModalVisible" title="Ignore Vulnerability" @ok="handleIgnoreSubmit">
      <Form layout="vertical" :model="ignoreForm" class="mt-4">
        <Form.Item label="Reason (Radio Group)">
          <Radio.Group v-model:value="ignoreForm.reason">
            <Radio value="false_positive">False Positive</Radio>
            <Radio value="accepted_risk">Accepted Risk</Radio>
            <Radio value="mitigating_control">Mitigating Control Exists</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Justification (Textarea)">
          <Textarea v-model:value="ignoreForm.justification" :rows="4" placeholder="Provide detailed reasoning..." />
        </Form.Item>
        <Form.Item label="Evidence Upload (Upload)">
          <Upload action="/api/upload" :file-list="ignoreForm.evidence">
            <Button>
              <template #icon><UploadOutlined /></template>
              Upload Document
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>
