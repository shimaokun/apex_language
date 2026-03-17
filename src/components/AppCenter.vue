<script setup lang="ts">
import { ref } from 'vue';
import { Card, Row, Col, Typography, Switch, Avatar, Input } from 'ant-design-vue';
import { 
  SafetyCertificateOutlined, 
  ApiOutlined, 
  DatabaseOutlined, 
  GlobalOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';

const { Title } = Typography;

const apps = ref([
  { id: 1, name: 'Web 应用防火墙 (WAF)', desc: '防御 OWASP Top 10 漏洞及恶意 Bot 攻击。', icon: GlobalOutlined, color: 'bg-blue-500', enabled: true },
  { id: 2, name: '主机入侵检测 (HIDS)', desc: '监控服务器内部的异常行为、后门和提权操作。', icon: SafetyCertificateOutlined, color: 'bg-emerald-500', enabled: true },
  { id: 3, name: '数据库审计 (DBA)', desc: '记录并分析数据库操作，防止敏感数据泄露。', icon: DatabaseOutlined, color: 'bg-orange-500', enabled: false },
  { id: 4, name: 'API 安全网关', desc: '保护 API 接口免受滥用、重放攻击和数据爬取。', icon: ApiOutlined, color: 'bg-purple-500', enabled: false },
]);

const searchQuery = ref('');
</script>

<template>
  <div class="p-6">
    <div class="flex justify-end items-center mb-6">
      <Input v-model:value="searchQuery" placeholder="搜索应用..." class="w-64 rounded-lg">
        <template #prefix><SearchOutlined class="text-slate-400" /></template>
      </Input>
    </div>

    <Row :gutter="[16, 16]">
      <Col :span="8" v-for="app in apps" :key="app.id">
        <Card :bordered="false" class="shadow-sm rounded-xl h-full hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-4">
            <Avatar :size="48" :class="[app.color, 'text-white']">
              <template #icon><component :is="app.icon" /></template>
            </Avatar>
            <Switch v-model:checked="app.enabled" />
          </div>
          <h3 class="text-lg font-bold mb-2">{{ app.name }}</h3>
          <p class="text-slate-500 text-sm leading-relaxed">{{ app.desc }}</p>
          
          <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
            <span :class="app.enabled ? 'text-emerald-500' : 'text-slate-400'" class="text-sm font-medium">
              {{ app.enabled ? '运行中' : '已停用' }}
            </span>
            <a v-if="app.enabled" class="text-indigo-600 text-sm hover:text-indigo-800">配置规则 &rarr;</a>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
