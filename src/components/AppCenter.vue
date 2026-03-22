<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, Card, Rate, Switch, Modal, Form, Slider, Radio, Avatar, Row, Col, message, Empty } from 'ant-design-vue';
import { SettingOutlined, EditOutlined, EllipsisOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';

const activeTab = ref('all');
const tabItems = [
  { key: 'all', label: '全部应用 (Tabs)' },
  { key: 'network', label: '网络安全' },
  { key: 'host', label: '主机安全' }
];
const isModalVisible = ref(false);

const apps = ref([
  { id: 1, name: 'WAF 防火墙', desc: 'Web 应用防护', rating: 4.5, enabled: true },
  { id: 2, name: 'HIDS 主机安全', desc: '服务器入侵检测', rating: 5, enabled: false },
  { id: 3, name: '数据库审计', desc: 'SQL 注入与脱敏', rating: 4, enabled: true },
]);

const handleSetting = () => {
  isModalVisible.value = true;
};

const handleSave = () => {
  message.success('配置已保存生效');
  isModalVisible.value = false;
};
</script>
<template>
  <div class="p-6 flex flex-col h-full">
    <Tabs v-model:activeKey="activeTab" :items="tabItems" class="mb-6" />

    <div class="flex-1 overflow-y-auto">
      <Row :gutter="[16, 16]" v-if="activeTab === 'all'">
        <Col :span="8" v-for="app in apps" :key="app.id">
          <Card class="rounded-xl shadow-sm hover:shadow-md transition-all h-full flex flex-col">
            <template #actions>
              <SettingOutlined key="setting" @click="handleSetting" />
              <EditOutlined key="edit" @click="message.info('编辑描述')" />
              <EllipsisOutlined key="ellipsis" @click="message.info('更多操作')" />
            </template>
            <Card.Meta :title="app.name" :description="app.desc">
              <template #avatar>
                <Avatar class="bg-indigo-500"><SafetyCertificateOutlined /></Avatar>
              </template>
            </Card.Meta>
            <div class="mt-6 flex justify-between items-center mt-auto">
              <Rate :value="app.rating" disabled class="text-sm" />
              <Switch v-model:checked="app.enabled" @change="message.success(app.enabled ? '已启用' : '已停用')" />
            </div>
          </Card>
        </Col>
      </Row>
      <div v-else class="bg-white rounded-xl shadow-sm p-12 flex items-center justify-center h-64">
        <Empty :description="`暂无${activeTab === 'network' ? '网络' : '主机'}安全应用`" />
      </div>
    </div>

    <Modal v-model:open="isModalVisible" title="应用高级配置 (Modal & Form)" @ok="handleSave">
      <Form layout="vertical" class="mt-4">
        <Form.Item label="防护等级 (Slider)">
          <Slider :marks="{ 0: '宽松', 50: '中等', 100: '严格' }" :default-value="50" />
        </Form.Item>
        <Form.Item label="拦截模式 (Radio)">
          <Radio.Group default-value="block">
            <Radio.Button value="observe">观察模式</Radio.Button>
            <Radio.Button value="block">阻断模式</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
:deep(.ant-tabs-content-holder) {
  display: none;
}
</style>
