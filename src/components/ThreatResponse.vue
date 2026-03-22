<script setup lang="ts">
import { ref } from 'vue';
import { Transfer, TreeSelect, Popconfirm, Button, Card, Row, Col, message } from 'ant-design-vue';

const mockData = Array.from({ length: 10 }).map((_, i) => ({
  key: i.toString(),
  title: `192.168.1.${100 + i}`,
  description: `可疑 IP 地址 ${i}`,
}));

const targetKeys = ref(['1', '3']);
const selectedKeys = ref(['0']);

const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
  targetKeys.value = nextTargetKeys;
  message.success(`成功移动 ${moveKeys.length} 个 IP`);
};

const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
};

const treeData = [
  { value: 'playbook-1', title: '勒索软件应急响应', children: [
    { value: 'pb-1-1', title: '断网隔离' },
    { value: 'pb-1-2', title: '进程查杀' },
  ]},
  { value: 'playbook-2', title: '挖矿木马处置' }
];
const selectedPlaybook = ref();

const executeResponse = () => {
  if (!selectedPlaybook.value) {
    message.warning('请先选择一个剧本');
    return;
  }
  message.loading({ content: '正在执行剧本...', key: 'exec' });
  setTimeout(() => {
    message.success({ content: '剧本执行完毕！', key: 'exec' });
  }, 1500);
};
</script>
<template>
  <div class="p-6 flex flex-col gap-6 h-full">
    <Row :gutter="16" class="flex-1">
      <Col :span="12">
        <Card title="批量 IP 封禁 (Transfer 组件)" class="rounded-xl shadow-sm h-full flex flex-col" :body-style="{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }">
          <Transfer
            :data-source="mockData"
            :titles="['发现的可疑 IP', '已加入黑名单']"
            :target-keys="targetKeys"
            :selected-keys="selectedKeys"
            :render="item => item.title"
            @change="handleChange"
            @selectChange="handleSelectChange"
          />
        </Card>
      </Col>
      <Col :span="12">
        <Card title="剧本下发 (TreeSelect & Popconfirm)" class="rounded-xl shadow-sm h-full">
          <div class="flex flex-col gap-6">
            <div>
              <div class="mb-2 text-slate-600 font-medium">选择要执行的响应剧本：</div>
              <TreeSelect
                v-model:value="selectedPlaybook"
                show-search
                class="w-full"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择响应剧本"
                allow-clear
                tree-default-expand-all
                :tree-data="treeData"
              />
            </div>
            <Popconfirm
              title="高危操作确认"
              description="执行剧本可能会导致业务中断，确定继续吗？"
              ok-text="确认执行"
              cancel-text="取消"
              @confirm="executeResponse"
            >
              <Button type="primary" danger size="large" class="w-full">立即执行响应</Button>
            </Popconfirm>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
