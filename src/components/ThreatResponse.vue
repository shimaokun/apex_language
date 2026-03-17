<script setup lang="ts">
import { ref } from 'vue';
import { Card, Row, Col, Table, Tag, Button, Space, Modal, message, Switch } from 'ant-design-vue';
import { StopOutlined, ApiOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';

const columns = [
  { title: '事件 ID', dataIndex: 'id', key: 'id' },
  { title: '告警内容', dataIndex: 'title', key: 'title' },
  { title: '影响资产', dataIndex: 'asset', key: 'asset' },
  { title: '响应状态', dataIndex: 'status', key: 'status' },
  { title: '建议动作', key: 'actions', align: 'right' },
];

const data = ref([
  { id: 'INC-2026-001', title: '检测到挖矿木马通信', asset: 'Server-DB-01', status: '待响应' },
  { id: 'INC-2026-002', title: '异常的海外 IP 登录成功', asset: 'VPN-Gateway', status: '处置中' },
  { id: 'INC-2026-003', title: '终端触发勒索软件诱饵', asset: 'Desktop-HR-05', status: '待响应' },
]);

const handleAction = (action: string, record: any) => {
  Modal.confirm({
    title: `确认执行: ${action}?`,
    content: `将对资产 ${record.asset} 执行 ${action} 操作。`,
    onOk() {
      message.success(`已成功下发指令: ${action}`);
      record.status = '已处置';
    }
  });
};
</script>

<template>
  <div class="p-6 flex-1 flex flex-col min-h-0 h-full">
    <Row :gutter="16" class="mb-6 shrink-0">
      <Col :span="12">
        <Card title="自动化响应剧本 (Playbooks)" :bordered="false" class="shadow-sm rounded-xl h-full">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ApiOutlined class="text-lg" />
                </div>
                <div>
                  <div class="font-bold text-slate-800">暴力破解自动封禁</div>
                  <div class="text-sm text-slate-500 mt-1">失败超过 5 次自动封禁源 IP 24 小时</div>
                </div>
              </div>
              <Switch checked />
            </div>
            <div class="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <SafetyCertificateOutlined class="text-lg" />
                </div>
                <div>
                  <div class="font-bold text-slate-800">勒索软件主机自动隔离</div>
                  <div class="text-sm text-slate-500 mt-1">检测到勒索特征立即断开网络连接</div>
                </div>
              </div>
              <Switch checked />
            </div>
          </div>
        </Card>
      </Col>
      <Col :span="12">
        <Card title="响应效率指标" :bordered="false" class="shadow-sm rounded-xl h-full">
           <div class="flex justify-around items-center h-full py-8">
             <div class="text-center">
               <div class="text-4xl font-black text-indigo-600 mb-2">5.2<span class="text-base font-normal text-slate-500 ml-1">分钟</span></div>
               <div class="text-slate-500 font-medium">平均响应时间 (MTTA)</div>
             </div>
             <div class="w-px h-16 bg-slate-200"></div>
             <div class="text-center">
               <div class="text-4xl font-black text-emerald-600 mb-2">18.4<span class="text-base font-normal text-slate-500 ml-1">分钟</span></div>
               <div class="text-slate-500 font-medium">平均处置时间 (MTTR)</div>
             </div>
           </div>
        </Card>
      </Col>
    </Row>

    <Card title="待响应事件" :bordered="false" class="shadow-sm rounded-xl flex-table-wrapper" :body-style="{ padding: 0 }">
      <Table class="flex-table" :columns="columns" :data-source="data" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <Tag :color="record.status === '待响应' ? 'red' : record.status === '处置中' ? 'orange' : 'green'">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.key === 'actions'">
            <Space>
              <Button size="small" danger @click="handleAction('隔离主机', record)" :disabled="record.status === '已处置'">
                <template #icon><StopOutlined /></template> 隔离主机
              </Button>
              <Button size="small" type="primary" ghost @click="handleAction('封禁 IP', record)" :disabled="record.status === '已处置'">
                封禁 IP
              </Button>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
