<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';
import { Table, Tag, Button, Drawer, Descriptions, Badge, Space, message } from 'ant-design-vue';
import { h } from 'vue';

const columns = [
  { title: '威胁 ID', dataIndex: 'id' },
  { title: '威胁类型', dataIndex: 'type' },
  { title: '严重程度', dataIndex: 'severity' },
  { title: '状态', dataIndex: 'status' },
  { title: '操作', key: 'action' }
];

const data = ref([
  { key: '1', id: 'TH-001', type: 'SQL 注入', severity: '高危', status: '未处理', desc: '在 /api/login 接口检测到 SQL 注入攻击尝试。' },
  { key: '2', id: 'TH-002', type: 'XSS 攻击', severity: '中危', status: '已拦截', desc: '在留言板页面检测到反射型 XSS。' },
  { key: '3', id: 'TH-003', type: '异常登录', severity: '低危', status: '未处理', desc: '用户 admin 在异地登录成功。' },
]);

const selectedRowKeys = ref([]);
const onSelectChange = (keys: any) => {
  selectedRowKeys.value = keys;
};

const drawerVisible = ref(false);
const activeRecord = ref<any>(null);

const getDescriptionItems = () => {
  if (!activeRecord.value) return [];
  return [
    { label: '威胁 ID', children: activeRecord.value.id },
    { label: '类型', children: activeRecord.value.type },
    { 
      label: '严重程度', 
      children: h(Tag, { color: 'red' }, () => activeRecord.value.severity) 
    }
  ];
};

const showDetails = (record: any) => {
  activeRecord.value = record;
  drawerVisible.value = true;
};

const handleBatchProcess = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择威胁事件');
    return;
  }
  message.success(`成功批量处理 ${selectedRowKeys.value.length} 个事件`);
  selectedRowKeys.value = [];
};
</script>
<template>
  <div class="p-6 flex-1 flex flex-col min-h-0 h-full">
    <div class="flex justify-between mb-4 shrink-0">
      <Space>
        <Button type="primary" @click="handleBatchProcess">批量处理 (Row Selection)</Button>
        <Button @click="message.info('导出成功')">导出报告</Button>
      </Space>
    </div>
    <div class="flex-table-wrapper bg-white rounded-xl shadow-sm overflow-hidden">
      <Table 
        class="flex-table" 
        :columns="columns" 
        :dataSource="data" 
        :rowSelection="{ selectedRowKeys, onChange: onSelectChange }"
        :expandRowByClick="true"
      >
        <template #expandedRowRender="{ record }">
          <p style="margin: 0" class="text-slate-500">详细描述 (Expandable Row): {{ record.desc }}</p>
        </template>
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.dataIndex === 'severity'">
            <Tag :color="record.severity === '高危' ? 'red' : record.severity === '中危' ? 'orange' : 'blue'">{{ record.severity }}</Tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <Badge :status="record.status === '未处理' ? 'error' : 'success'" :text="record.status" />
          </template>
          <template v-else-if="column.key === 'action'">
            <Button type="link" @click.stop="showDetails(record)">深度分析 (Drawer)</Button>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </Table>
    </div>

    <Drawer v-model:open="drawerVisible" title="威胁深度分析报告" placement="right" width="500">
      <template v-if="activeRecord">
        <Descriptions title="基本信息 (Descriptions)" bordered :column="1" :items="getDescriptionItems()" />
        <div class="mt-6">
          <h3 class="font-bold mb-4">处置建议</h3>
          <p class="text-slate-600">建议立即封禁源 IP，并检查相关应用代码是否存在漏洞。</p>
          <Button type="primary" class="mt-4" @click="message.success('已下发封禁指令'); drawerVisible = false">一键封禁</Button>
        </div>
      </template>
    </Drawer>
  </div>
</template>
