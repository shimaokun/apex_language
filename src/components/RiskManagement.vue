<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Steps, Form, Input, Select, InputNumber, Checkbox, Result, Button, Card, message } from 'ant-design-vue';

const currentStep = ref(0);
const stepItems = [
  { title: '基础配置', description: '设置评估参数' },
  { title: '策略选择', description: '选择扫描策略' },
  { title: '完成', description: '提交任务' }
];

const riskLevelOptions = [
  { value: 'high', label: '高危及以上' },
  { value: 'medium', label: '中危及以上' },
  { value: 'all', label: '所有风险' }
];
const formState = reactive({
  taskName: '',
  riskLevel: 'high',
  assetCount: 10,
  notify: true
});

const next = () => {
  if (currentStep.value === 0 && !formState.taskName) {
    message.error('请输入任务名称');
    return;
  }
  currentStep.value++;
};
const prev = () => currentStep.value--;
const finish = () => {
  message.success('评估任务已提交');
  currentStep.value++;
};
const reset = () => {
  currentStep.value = 0;
  formState.taskName = '';
};
</script>
<template>
  <div class="p-6 flex flex-col gap-6 h-full overflow-y-auto">
    <Card class="rounded-xl shadow-sm shrink-0">
      <Steps :current="currentStep" :items="stepItems" class="max-w-3xl mx-auto" />
    </Card>

    <Card 
      class="rounded-xl shadow-sm flex-1 flex flex-col" 
      :body-style="{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }"
    >
      <div v-if="currentStep === 0" class="w-full max-w-md">
        <h2 class="text-xl font-bold mb-6 text-center">创建风险评估任务 (Form)</h2>
        <Form layout="vertical" :model="formState">
          <Form.Item label="任务名称" required>
            <Input v-model:value="formState.taskName" placeholder="例如：Q3 核心资产风险评估" />
          </Form.Item>
          <Form.Item label="关注风险等级">
            <Select v-model:value="formState.riskLevel" :options="riskLevelOptions" />
          </Form.Item>
          <Form.Item label="最大并发扫描数">
            <InputNumber v-model:value="formState.assetCount" :min="1" :max="100" class="w-full" />
          </Form.Item>
          <Form.Item>
            <Checkbox v-model:checked="formState.notify">任务完成后发送邮件通知</Checkbox>
          </Form.Item>
        </Form>
      </div>

      <div v-else-if="currentStep === 1" class="w-full max-w-md text-center">
        <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
          <h3 class="font-bold text-lg mb-2">已选策略：全面深度扫描</h3>
          <p class="text-slate-500">包含 OWASP Top 10、主机漏洞、弱口令检测等 150+ 项检查。</p>
        </div>
      </div>

      <div v-else-if="currentStep === 2" class="w-full">
        <Result
          status="success"
          title="风险评估任务创建成功！(Result)"
          sub-title="任务编号：RSK-20260317-001，系统将在后台自动执行扫描。"
        >
          <template #extra>
            <Button type="primary" @click="reset">创建新任务</Button>
            <Button @click="message.info('跳转至任务列表')">查看进度</Button>
          </template>
        </Result>
      </div>

      <div class="mt-8 flex gap-4" v-if="currentStep < 2">
        <Button v-if="currentStep > 0" @click="prev">上一步</Button>
        <Button v-if="currentStep < 1" type="primary" @click="next">下一步</Button>
        <Button v-if="currentStep === 1" type="primary" @click="finish">提交任务</Button>
      </div>
    </Card>
  </div>
</template>
