<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { 
  Table, Button, Input, Modal, Form, Select, message, Space, Popconfirm, Tag 
} from 'ant-design-vue';
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  owner: string;
  updated_at: string;
}

const assets = ref<Asset[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const isModalOpen = ref(false);
const editingAsset = ref<Asset | null>(null);
const formRef = ref();
const formState = reactive({ name: '', type: 'Server', status: 'Active', owner: '' });

const fetchAssets = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/assets');
    const data = await res.json();
    if (data.length === 0) {
      // Add mock data if empty
      const mockData = [
        { id: '1', name: 'Production Server A', type: 'Server', status: 'Active', owner: 'Admin', updated_at: new Date().toISOString() },
        { id: '2', name: 'Firewall B', type: 'Network', status: 'Active', owner: 'Security', updated_at: new Date().toISOString() },
        { id: '3', name: 'Backup Storage C', type: 'Server', status: 'Inactive', owner: 'IT', updated_at: new Date().toISOString() },
      ];
      for (const item of mockData) {
        await fetch('/api/assets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      assets.value = mockData;
    } else {
      assets.value = data;
    }
  } catch (err) {
    message.error('获取资产失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  editingAsset.value = null;
  formState.name = '';
  formState.type = 'Server';
  formState.status = 'Active';
  formState.owner = '';
  isModalOpen.value = true;
};

const handleEdit = (record: Asset) => {
  editingAsset.value = record;
  formState.name = record.name;
  formState.type = record.type;
  formState.status = record.status;
  formState.owner = record.owner;
  isModalOpen.value = true;
};

const handleDelete = async (id: string) => {
  await fetch(`/api/assets/${id}`, { method: 'DELETE' });
  message.success('删除成功');
  fetchAssets();
};

const handleSave = async () => {
  await formRef.value.validate();
  const url = editingAsset.value ? `/api/assets/${editingAsset.value.id}` : '/api/assets';
  const method = editingAsset.value ? 'PUT' : 'POST';
  
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formState),
  });
  
  message.success('保存成功');
  isModalOpen.value = false;
  fetchAssets();
};

const filteredAssets = computed(() => {
  return assets.value.filter(a => a.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const columns = [
  { title: '资产名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '所有者', dataIndex: 'owner', key: 'owner' },
  { title: '最后更新', dataIndex: 'updated_at', key: 'updated_at' },
  { title: '操作', key: 'actions', align: 'right' },
];

onMounted(fetchAssets);
</script>

<template>
  <div class="p-6 flex-1 flex flex-col min-h-0 h-full">
    <div class="flex justify-between mb-4 shrink-0">
      <Input v-model:value="searchQuery" placeholder="搜索资产..." class="w-64">
        <template #prefix><SearchOutlined /></template>
      </Input>
      <Button type="primary" @click="handleAdd"><PlusOutlined /> 新增资产</Button>
    </div>
    
    <Table class="flex-table bg-white rounded-xl shadow-sm overflow-hidden" :columns="columns" :data-source="filteredAssets" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="record.status === 'Active' ? 'success' : 'warning'">{{ record.status }}</Tag>
        </template>
        <template v-if="column.key === 'actions'">
          <Space>
            <Button type="link" @click="handleEdit(record)"><EditOutlined /></Button>
            <Popconfirm title="确定删除?" @confirm="handleDelete(record.id)">
              <Button type="link" danger><DeleteOutlined /></Button>
            </Popconfirm>
          </Space>
        </template>
      </template>
    </Table>

    <Modal v-model:open="isModalOpen" :title="editingAsset ? '编辑资产' : '新增资产'" @ok="handleSave">
      <Form ref="formRef" :model="formState" layout="vertical">
        <Form.Item name="name" label="名称" :rules="[{ required: true }]"><Input v-model:value="formState.name" /></Form.Item>
        <Form.Item name="type" label="类型"><Select v-model:value="formState.type"><Select.Option value="Server">Server</Select.Option><Select.Option value="Network">Network</Select.Option></Select></Form.Item>
        <Form.Item name="status" label="状态"><Select v-model:value="formState.status"><Select.Option value="Active">Active</Select.Option><Select.Option value="Inactive">Inactive</Select.Option></Select></Form.Item>
        <Form.Item name="owner" label="所有者"><Input v-model:value="formState.owner" /></Form.Item>
      </Form>
    </Modal>
  </div>
</template>
