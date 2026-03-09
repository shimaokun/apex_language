<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { 
  Modal, 
  Upload, 
  Form, 
  Input, 
  Radio, 
  Button, 
  Space, 
  Typography,
  Alert,
  message
} from 'ant-design-vue';
import { 
  InboxOutlined, 
  CloudUploadOutlined
} from '@ant-design/icons-vue';
import * as XLSX from 'xlsx';
import { useI18nStore } from '../stores/i18n';

const { Dragger } = Upload;
const { Text } = Typography;

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'success']);

const { t } = useI18nStore();
const formRef = ref();
const fileList = ref<any[]>([]);
const uploading = ref(false);
const error = ref<string | null>(null);

const formState = reactive({
  code: 'en-US',
  name: '',
  updateType: 'incremental'
});

const handleUpload = async () => {
  if (fileList.value.length === 0) {
    message.warning(t('upload.error.no_file', '请先选择文件'));
    return;
  }

  try {
    await formRef.value.validate();
    const file = fileList.value[0].originFileObj || fileList.value[0];
    
    uploading.value = true;
    error.value = null;

    let data: Record<string, string> = {};

    if (file.name.endsWith('.json')) {
      const text = await file.text();
      try {
        data = JSON.parse(text);
        const flatten = (obj: any, prefix = ''): Record<string, string> => {
          return Object.keys(obj).reduce((acc: any, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
              Object.assign(acc, flatten(obj[k], pre + k));
            } else {
              acc[pre + k] = String(obj[k]);
            }
            return acc;
          }, {});
        };
        data = flatten(data);
      } catch (e) {
        throw new Error(t('upload.error.invalid_json', '无效的 JSON 格式'));
      }
    } else {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(firstSheet);
      
      rows.forEach(row => {
        const key = row.key || row.Key || row.ID || row.id;
        const value = row.value || row.Value || row.Text || row.text;
        if (key && value) {
          data[key] = String(value);
        }
      });
    }

    if (Object.keys(data).length === 0) {
      throw new Error(t('upload.error.no_keys', '文件中未找到有效的翻译键值'));
    }

    const res = await fetch('/api/languages/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: formState.code,
        name: formState.name || formState.code,
        data,
        updateType: formState.updateType,
      }),
    });

    if (!res.ok) throw new Error(t('upload.error.failed', '上传失败'));

    message.success(t('upload.success', '上传成功'));
    emit('success');
    emit('close');
    formRef.value.resetFields();
    fileList.value = [];
  } catch (err: any) {
    error.value = err.message;
    message.error(err.message);
  } finally {
    uploading.value = false;
  }
};

const beforeUpload = (file: any) => {
  fileList.value = [file];
  return false;
};

const handleRemove = () => {
  fileList.value = [];
};
</script>

<template>
  <Modal
    :open="isOpen"
    @cancel="emit('close')"
    :width="600"
    centered
    destroy-on-close
  >
    <template #title>
      <Space>
        <CloudUploadOutlined class="text-indigo-600" />
        <span>{{ t('upload.title', '上传语言包') }}</span>
      </Space>
    </template>

    <template #footer>
      <Button key="cancel" @click="emit('close')">
        {{ t('button.cancel', '取消') }}
      </Button>
      <Button 
        key="submit" 
        type="primary" 
        :loading="uploading" 
        @click="handleUpload"
        :disabled="fileList.length === 0"
      >
        {{ uploading ? t('upload.status.uploading', '上传中...') : t('button.confirm_upload', '确认上传') }}
      </Button>
    </template>

    <Form
      ref="formRef"
      :model="formState"
      layout="vertical"
      class="mt-6"
    >
      <div class="grid grid-cols-2 gap-4">
        <Form.Item
          name="code"
          :label="t('upload.label.code', '语言编码 (Code)')"
          :rules="[{ required: true, message: t('form.error.code', '请输入语言编码') }]"
        >
          <Input v-model:value="formState.code" placeholder="如: en-US" />
        </Form.Item>
        <Form.Item
          name="name"
          :label="t('upload.label.name', '语言名称 (Name)')"
          :rules="[{ required: true, message: t('form.error.name', '请输入语言名称') }]"
        >
          <Input v-model:value="formState.name" placeholder="如: English" />
        </Form.Item>
      </div>

      <Form.Item
        name="updateType"
        :label="t('upload.label.mode', '更新模式')"
      >
        <Radio.Group v-model:value="formState.updateType">
          <Radio value="incremental">{{ t('upload.mode.incremental', '增量更新') }}</Radio>
          <Radio value="full">{{ t('upload.mode.full', '全量覆盖') }}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item :label="t('upload.dropzone.hint', '语言包文件')">
        <Dragger
          :file-list="fileList"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          :max-count="1"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">{{ t('upload.dropzone.hint', '点击或拖拽文件到此处') }}</p>
          <p class="ant-upload-hint">
            {{ t('upload.dropzone.support', '支持 .json, .xlsx 格式') }}
          </p>
        </Dragger>
        <div class="mt-2 text-right">
          <a href="/template.json" download="template.json" class="text-indigo-600 hover:text-indigo-800 text-sm">
            {{ t('upload.download_template', '下载语言包模板 (JSON)') }}
          </a>
        </div>
      </Form.Item>

      <Alert
        v-if="error"
        :message="error"
        type="error"
        show-icon
        class="mt-4"
      />
    </Form>
  </Modal>
</template>
