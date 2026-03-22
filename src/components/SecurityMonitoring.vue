<script setup lang="ts">
import { ref } from 'vue';
import { Card, Row, Col, Statistic, Alert, Timeline, Spin, Button, Carousel, message } from 'ant-design-vue';
import { ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons-vue';

const loading = ref(false);
const timelineItems = [
  { color: 'red', children: '<p class="font-bold mb-1">10:00 - 发现恶意文件下载</p><p class="text-slate-500 text-sm">终端 PC-001 下载了未知可执行文件。</p>' },
  { color: 'orange', children: '<p class="font-bold mb-1">10:05 - 异常进程启动</p><p class="text-slate-500 text-sm">文件执行并尝试修改注册表。</p>' },
  { color: 'blue', children: '<p class="font-bold mb-1">10:06 - EDR 介入拦截</p><p class="text-slate-500 text-sm">进程被强制终止，文件已隔离。</p>' },
  { color: 'green', children: '<p class="font-bold mb-1">10:10 - 恢复正常</p><p class="text-slate-500 text-sm">系统扫描完成，未发现其他威胁。</p>' }
];
const refresh = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success('监控数据已刷新');
  }, 1000);
};
</script>
<template>
  <div class="p-6 flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold m-0 text-slate-800">实时态势感知</h2>
      <Button type="primary" :loading="loading" @click="refresh">
        <template #icon><ReloadOutlined /></template>刷新数据
      </Button>
    </div>
    <Spin :spinning="loading">
      <Row :gutter="16" class="mb-6">
        <Col :span="8">
          <Card hoverable class="rounded-xl shadow-sm">
            <Statistic title="今日拦截攻击" :value="112893" :value-style="{ color: '#3f8600' }">
              <template #prefix><ArrowUpOutlined /></template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="8">
          <Card hoverable class="rounded-xl shadow-sm">
            <Statistic title="活跃威胁告警" :value="42" :value-style="{ color: '#cf1322' }">
              <template #prefix><ArrowUpOutlined /></template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="8">
          <Card hoverable class="rounded-xl shadow-sm">
            <Statistic title="系统健康度" :value="98" suffix="%" :value-style="{ color: '#1677ff' }">
              <template #prefix><ArrowDownOutlined /></template>
            </Statistic>
          </Card>
        </Col>
      </Row>
      
      <Row :gutter="16">
        <Col :span="12">
          <Card title="最新安全通告 (Carousel & Alert)" class="rounded-xl shadow-sm h-full">
            <Carousel autoplay class="bg-slate-800 text-white rounded-lg overflow-hidden h-32">
              <div class="p-6 h-32 flex flex-col justify-center">
                <h3 class="text-white m-0 text-lg">高危漏洞预警: Apache Log4j2</h3>
                <p class="text-slate-300 mt-2">请尽快升级至 2.15.0 及以上版本。</p>
              </div>
              <div class="p-6 h-32 flex flex-col justify-center">
                <h3 class="text-white m-0 text-lg">系统维护通知</h3>
                <p class="text-slate-300 mt-2">本周六凌晨 2:00 将进行核心交换机升级。</p>
              </div>
            </Carousel>
            <div class="mt-6">
              <Alert message="检测到异常登录尝试" description="来源 IP: 192.168.1.100 尝试暴力破解 admin 账户。" type="error" show-icon closable @close="message.info('告警已忽略')" />
              <Alert message="防病毒库已更新" description="最新版本: v2026.03.17" type="success" show-icon class="mt-4" />
            </div>
          </Card>
        </Col>
        <Col :span="12">
          <Card title="攻击溯源时间线 (Timeline)" class="rounded-xl shadow-sm h-full">
            <Timeline :items="timelineItems">
              <template #label="{ label }">{{ label }}</template>
              <template #dot="{ dot }">{{ dot }}</template>
              <template #children="{ item }">
                <div v-html="item.children"></div>
              </template>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </Spin>
  </div>
</template>
