<script setup lang="ts">
import { ref } from 'vue';
import { Card, Tree, Table, Upload, Dropdown, Menu, Button, Input, Space, Tag, message } from 'ant-design-vue';
import { UploadOutlined, DownOutlined, SearchOutlined, ClusterOutlined } from '@ant-design/icons-vue';

const menuItems = [
  { key: 'export', label: '导出资产' },
  { key: 'scan', label: '批量扫描' }
];

const treeData = ref([
  { title: '总部', key: '0-0', children: [
    { title: '研发部', key: '0-0-0' },
    { title: '市场部', key: '0-0-1' },
  ]},
  { title: '分公司', key: '0-1', children: [
    { title: '销售部', key: '0-1-0' },
  ]}
]);

const selectedKeys = ref(['0-0-0']);
const onSelect = (keys: any) => {
  selectedKeys.value = keys;
  message.info(`已切换至部门: ${keys[0]}`);
};

const columns = [
  { title: '资产名称', dataIndex: 'name' },
  { title: 'IP 地址', dataIndex: 'ip' },
  { title: '状态', dataIndex: 'status' },
  { title: '操作', key: 'action' }
];

const data = ref([
  { key: '1', name: 'Web Server 01', ip: '192.168.1.10', status: '运行中' },
  { key: '2', name: 'DB Server 01', ip: '192.168.1.20', status: '离线' },
  { key: '3', name: 'Cache Server 01', ip: '192.168.1.30', status: '运行中' },
]);

const handleUpload = () => {
  message.success('文件上传成功');
};

const handleMenuClick = (e: any) => {
  message.success(`执行批量操作: ${e.key}`);
};
</script>
<template>
  <div class="p-6 flex-1 flex gap-6 min-h-0 h-full">
    <Card class="w-64 shrink-0 overflow-y-auto shadow-sm rounded-xl" title="组织架构 (Tree)" :bordered="false">
      <Tree :tree-data="treeData" v-model:selectedKeys="selectedKeys" @select="onSelect" defaultExpandAll>
        <template #icon><ClusterOutlined /></template>
      </Tree>
    </Card>
    <div class="flex-1 flex flex-col min-h-0">
      <div class="flex justify-between mb-4 shrink-0">
        <Space>
          <Input placeholder="搜索资产..." class="w-64"><template #prefix><SearchOutlined /></template></Input>
          <Dropdown>
            <template #overlay>
              <Menu @click="handleMenuClick" :items="menuItems" />
            </template>
            <Button>批量操作 (Dropdown) <DownOutlined /></Button>
          </Dropdown>
        </Space>
        <Upload :showUploadList="false" :customRequest="handleUpload">
          <Button type="primary"><UploadOutlined /> 导入资产 (Upload)</Button>
        </Upload>
      </div>
      <Card :bordered="false" class="shadow-sm rounded-xl flex-table-wrapper" :body-style="{ padding: 0 }">
        <Table class="flex-table" :columns="columns" :dataSource="data" :pagination="{ pageSize: 10 }">
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="record.status === '运行中' ? 'green' : 'red'">{{ record.status }}</Tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <Button type="link" @click="message.info('查看详情')">详情</Button>
            </template>
            <template v-else>
              {{ text }}
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </div>
</template>
