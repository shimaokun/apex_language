<script setup lang="ts">
import { ref } from 'vue';
import { Card, Row, Col, Statistic, List, Tag, Typography } from 'ant-design-vue';
import { 
  SafetyCertificateOutlined, 
  AlertOutlined, 
  BugOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue';

const { Title } = Typography;

const recentAlerts = ref([
  { id: 1, title: '检测到异常登录尝试', time: '10分钟前', type: 'warning', ip: '192.168.1.105' },
  { id: 2, title: '防御了一次 SQL 注入攻击', time: '1小时前', type: 'success', ip: '203.0.113.42' },
  { id: 3, title: '核心数据库 CPU 使用率过高', time: '2小时前', type: 'danger', ip: '10.0.0.5' },
  { id: 4, title: '发现未知恶意软件特征', time: '5小时前', type: 'danger', ip: '172.16.0.8' },
]);
</script>

<template>
  <div class="p-6">
    <Row :gutter="[16, 16]" class="mb-6">
      <Col :span="8">
        <Card :bordered="false" class="shadow-sm rounded-xl">
          <Statistic
            title="今日拦截攻击"
            :value="1284"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <SafetyCertificateOutlined />
            </template>
            <template #suffix>
              <span class="text-sm ml-2 text-emerald-500"><ArrowUpOutlined /> 12%</span>
            </template>
          </Statistic>
        </Card>
      </Col>
      <Col :span="8">
        <Card :bordered="false" class="shadow-sm rounded-xl">
          <Statistic
            title="活跃威胁告警"
            :value="23"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <AlertOutlined />
            </template>
            <template #suffix>
              <span class="text-sm ml-2 text-red-500"><ArrowUpOutlined /> 5%</span>
            </template>
          </Statistic>
        </Card>
      </Col>
      <Col :span="8">
        <Card :bordered="false" class="shadow-sm rounded-xl">
          <Statistic
            title="未修复漏洞"
            :value="9"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <BugOutlined />
            </template>
            <template #suffix>
              <span class="text-sm ml-2 text-green-500"><ArrowDownOutlined /> 3%</span>
            </template>
          </Statistic>
        </Card>
      </Col>
    </Row>

    <Card title="最新安全告警" :bordered="false" class="shadow-sm rounded-xl">
      <List item-layout="horizontal" :data-source="recentAlerts">
        <template #renderItem="{ item }">
          <List.Item>
            <List.Item.Meta :description="`源 IP: ${item.ip} | 时间: ${item.time}`">
              <template #title>
                <span class="font-medium">{{ item.title }}</span>
              </template>
              <template #avatar>
                <Tag :color="item.type === 'danger' ? 'red' : item.type === 'warning' ? 'orange' : 'green'" class="mr-0 py-1 px-2 rounded-lg">
                  <AlertOutlined v-if="item.type !== 'success'" />
                  <SafetyCertificateOutlined v-else />
                </Tag>
              </template>
            </List.Item.Meta>
            <template #actions>
              <a class="text-indigo-600 hover:text-indigo-800">查看详情</a>
            </template>
          </List.Item>
        </template>
      </List>
    </Card>
  </div>
</template>
