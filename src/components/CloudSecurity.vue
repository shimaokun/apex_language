<script setup lang="ts">
import { Card, Row, Col, Typography, List, Tag, Button } from 'ant-design-vue';
import { CloudOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

const { Title } = Typography;

const cloudAssets = [
  { name: 'AWS 生产环境', type: 'AWS', status: 'secure', issues: 0 },
  { name: '阿里云测试环境', type: 'Aliyun', status: 'warning', issues: 3 },
  { name: '腾讯云备份库', type: 'Tencent', status: 'danger', issues: 1 },
];

const misconfigs = [
  { title: 'S3 存储桶公开访问未关闭', env: 'AWS 生产环境', severity: 'High' },
  { title: 'RDS 数据库开放了公网访问 (0.0.0.0/0)', env: '阿里云测试环境', severity: 'Critical' },
  { title: 'IAM 用户未使用多因素认证 (MFA)', env: '腾讯云备份库', severity: 'Medium' },
];
</script>

<template>
  <div class="p-6">
    <Row :gutter="16" class="mb-6">
      <Col :span="8" v-for="cloud in cloudAssets" :key="cloud.name">
        <Card :bordered="false" class="shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                <CloudOutlined />
              </div>
              <div>
                <h3 class="font-medium text-lg m-0">{{ cloud.name }}</h3>
                <span class="text-slate-400 text-sm">{{ cloud.type }}</span>
              </div>
            </div>
            <CheckCircleOutlined v-if="cloud.status === 'secure'" class="text-2xl text-emerald-500" />
            <ExclamationCircleOutlined v-else-if="cloud.status === 'warning'" class="text-2xl text-orange-500" />
            <ExclamationCircleOutlined v-else class="text-2xl text-red-500" />
          </div>
          <div class="text-slate-600">
            发现配置风险: <strong :class="cloud.issues > 0 ? 'text-red-500' : 'text-emerald-500'">{{ cloud.issues }}</strong> 项
          </div>
        </Card>
      </Col>
    </Row>

    <Card title="云配置风险检测 (CSPM)" :bordered="false" class="shadow-sm rounded-xl">
      <template #extra><Button type="link">重新扫描</Button></template>
      <List item-layout="horizontal" :data-source="misconfigs">
        <template #renderItem="{ item }">
          <List.Item>
            <List.Item.Meta :description="`所属环境: ${item.env}`">
              <template #title>
                <span class="font-medium">{{ item.title }}</span>
              </template>
            </List.Item.Meta>
            <template #actions>
              <Tag :color="item.severity === 'Critical' ? 'purple' : item.severity === 'High' ? 'red' : 'orange'">
                {{ item.severity }}
              </Tag>
              <Button size="small">一键修复</Button>
            </template>
          </List.Item>
        </template>
      </List>
    </Card>
  </div>
</template>
