<script setup lang="ts">
import { ref } from 'vue';
import { Table, Tag, Button, Typography, Progress, Card, Row, Col } from 'ant-design-vue';

const { Title } = Typography;

const columns = [
  { title: '漏洞编号 (CVE)', dataIndex: 'cve', key: 'cve' },
  { title: '漏洞名称', dataIndex: 'name', key: 'name' },
  { title: '影响资产数', dataIndex: 'assets', key: 'assets' },
  { title: 'CVSS 评分', dataIndex: 'score', key: 'score' },
  { title: '修复状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'actions', align: 'right' },
];

const data = ref([
  { cve: 'CVE-2023-44487', name: 'HTTP/2 Rapid Reset 漏洞', assets: 12, score: 7.5, status: '修复中' },
  { cve: 'CVE-2021-44228', name: 'Log4Shell 远程代码执行', assets: 3, score: 10.0, status: '未修复' },
  { cve: 'CVE-2024-21626', name: 'runc 容器逃逸漏洞', assets: 25, score: 8.6, status: '已修复' },
]);

const getScoreColor = (score: number) => {
  if (score >= 9.0) return '#cf1322';
  if (score >= 7.0) return '#fa8c16';
  if (score >= 4.0) return '#fadb14';
  return '#52c41a';
};
</script>

<template>
  <div class="p-6 flex-1 flex flex-col min-h-0 h-full">
    <Row :gutter="16" class="mb-6 shrink-0">
      <Col :span="12">
        <Card title="整体风险评分" :bordered="false" class="shadow-sm rounded-xl h-full">
          <div class="flex items-center gap-6">
            <Progress type="dashboard" :percent="78" :stroke-color="'#fa8c16'" />
            <div>
              <h3 class="text-lg font-medium">中等风险</h3>
              <p class="text-slate-500">您的系统存在一些需要关注的漏洞。建议优先修复 CVSS 评分大于 7.0 的高危漏洞。</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :span="12">
        <Card title="风险分布" :bordered="false" class="shadow-sm rounded-xl h-full">
          <div class="flex flex-col gap-3">
            <div class="flex items-center"><span class="w-16 text-slate-500">高危</span><Progress :percent="15" stroke-color="#cf1322" class="flex-1" /></div>
            <div class="flex items-center"><span class="w-16 text-slate-500">中危</span><Progress :percent="45" stroke-color="#fa8c16" class="flex-1" /></div>
            <div class="flex items-center"><span class="w-16 text-slate-500">低危</span><Progress :percent="40" stroke-color="#fadb14" class="flex-1" /></div>
          </div>
        </Card>
      </Col>
    </Row>

    <Card title="漏洞列表" :bordered="false" class="shadow-sm rounded-xl flex-table-wrapper" :body-style="{ padding: 0 }">
      <Table class="flex-table" :columns="columns" :data-source="data" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'score'">
            <Tag :color="getScoreColor(record.score)" class="font-bold">{{ record.score }}</Tag>
          </template>
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === '已修复' ? 'success' : record.status === '修复中' ? 'processing' : 'error'">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.key === 'actions'">
            <Button type="link" size="small">查看详情</Button>
            <Button type="link" size="small" class="text-emerald-600">创建修复工单</Button>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
