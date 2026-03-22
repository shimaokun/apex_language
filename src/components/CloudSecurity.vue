<script setup lang="ts">
import { ref } from 'vue';
import { Collapse, List, Avatar, Progress, Popover, Skeleton, Empty, Button, message } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';

const activeKey = ref(['1']);
const loading = ref(false);

const listData = [
  {
    title: 'S3 公开访问风险',
    description: "S3 存储桶 'company-public-assets' 允许匿名读取权限。",
    type: 'red',
    action: 'fix'
  },
  {
    title: '数据库公网暴露',
    description: "RDS 实例 'prod-db-01' 安全组开放了 0.0.0.0/0 的 3306 端口。",
    type: 'orange',
    action: 'ignore'
  }
];

const handleFix = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success('云配置风险已自动修复');
  }, 1500);
};
</script>
<template>
  <div class="p-6">
    <div class="grid grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
        <Progress type="circle" :percent="85" :size="80" stroke-color="#52c41a" />
        <div>
          <h3 class="text-lg font-bold m-0">AWS 环境</h3>
          <p class="text-slate-500 m-0">合规得分 (Progress)</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
        <Progress type="circle" :percent="62" :size="80" stroke-color="#faad14" />
        <div>
          <h3 class="text-lg font-bold m-0">阿里云环境</h3>
          <p class="text-slate-500 m-0">合规得分</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
        <Progress type="circle" :percent="100" :size="80" />
        <div>
          <h3 class="text-lg font-bold m-0">私有云环境</h3>
          <p class="text-slate-500 m-0">合规得分</p>
        </div>
      </div>
    </div>

    <Collapse v-model:activeKey="activeKey" class="bg-white rounded-xl shadow-sm">
      <Collapse.Panel key="1" header="高危配置项 (AWS) - Collapse & List">
        <Skeleton :loading="loading" active avatar>
          <List item-layout="horizontal" :data-source="listData">
            <template #renderItem="{ item }">
              <List.Item>
                <template #actions>
                  <template v-if="item.action === 'fix'">
                    <Popover title="修复建议 (Popover)" content="点击一键修复将自动修改 S3 Bucket 策略为私有。">
                      <Button type="primary" size="small" @click="handleFix">一键修复</Button>
                    </Popover>
                  </template>
                  <template v-else>
                    <Button size="small" @click="message.info('已忽略该风险')">忽略</Button>
                  </template>
                </template>
                <List.Item.Meta :description="item.description">
                  <template #title><span :class="`text-${item.type}-500 font-bold`">{{ item.title }}</span></template>
                  <template #avatar><Avatar :class="`bg-${item.type}-100 text-${item.type}-500`"><WarningOutlined /></Avatar></template>
                </List.Item.Meta>
              </List.Item>
            </template>
          </List>
        </Skeleton>
      </Collapse.Panel>
      <Collapse.Panel key="2" header="合规检查项 (私有云) - Empty">
        <Empty description="当前环境配置完全合规，未发现风险项。" />
      </Collapse.Panel>
    </Collapse>
  </div>
</template>
