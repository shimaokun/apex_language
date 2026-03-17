<script setup lang="ts">
import { ref } from 'vue';
import { Table, Tag, Input, Button, Space, Typography } from 'ant-design-vue';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons-vue';

const { Title } = Typography;

const searchQuery = ref('');

const columns = [
  { title: '威胁 ID', dataIndex: 'id', key: 'id' },
  { title: '威胁类型', dataIndex: 'type', key: 'type' },
  { title: '严重程度', dataIndex: 'severity', key: 'severity' },
  { title: '源地址', dataIndex: 'source', key: 'source' },
  { title: '目标资产', dataIndex: 'target', key: 'target' },
  { title: '发现时间', dataIndex: 'time', key: 'time' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'actions', align: 'right' },
];

const data = ref([
  { id: 'TH-2026-001', type: 'SQL 注入', severity: 'High', source: '185.15.x.x', target: 'Web Server 01', time: '2026-03-14 10:23:11', status: '未处理' },
  { id: 'TH-2026-002', type: '暴力破解', severity: 'Medium', source: '112.45.x.x', target: 'SSH Gateway', time: '2026-03-14 09:15:42', status: '已阻断' },
  { id: 'TH-2026-003', type: '跨站脚本 (XSS)', severity: 'Low', source: '203.11.x.x', target: 'Customer Portal', time: '2026-03-13 16:44:09', status: '已处理' },
  { id: 'TH-2026-004', type: '勒索软件活动', severity: 'Critical', source: '未知', target: 'File Server B', time: '2026-03-13 11:05:22', status: '调查中' },
]);

const getSeverityColor = (severity: string) => {
  const map: Record<string, string> = {
    'Critical': 'purple',
    'High': 'red',
    'Medium': 'orange',
    'Low': 'blue'
  };
  return map[severity] || 'default';
};
</script>

<template>
  <div class="p-6 flex-1 flex flex-col min-h-0 h-full">
    <div class="flex justify-between mb-4 shrink-0">
      <Space>
        <Input v-model:value="searchQuery" placeholder="搜索威胁 ID 或类型..." class="w-64">
          <template #prefix><SearchOutlined /></template>
        </Input>
        <Button><FilterOutlined /> 筛选</Button>
      </Space>
      <Button type="primary" danger>导出报告</Button>
    </div>

    <Table :columns="columns" :data-source="data" class="flex-table bg-white rounded-xl shadow-sm overflow-hidden" :pagination="{ pageSize: 10 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'severity'">
          <Tag :color="getSeverityColor(record.severity)">{{ record.severity }}</Tag>
        </template>
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === '已阻断' || record.status === '已处理' ? 'success' : record.status === '调查中' ? 'processing' : 'error'">
            {{ record.status }}
          </Tag>
        </template>
        <template v-if="column.key === 'actions'">
          <Button type="link" size="small">详情分析</Button>
        </template>
      </template>
    </Table>
  </div>
</template>
