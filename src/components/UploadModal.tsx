import React, { useState } from 'react';
import { 
  Modal, 
  Upload, 
  Form, 
  Input, 
  Radio, 
  Button, 
  Space, 
  App,
  Typography,
  Alert
} from 'antd';
import { 
  InboxOutlined, 
  FileDoneOutlined, 
  FileExcelOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useI18n } from '../contexts/I18nContext';

const { Dragger } = Upload;
const { Text } = Typography;

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useI18n();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning(t('upload.error.no_file', '请先选择文件'));
      return;
    }

    const values = await form.validateFields();
    const file = fileList[0].originFileObj || fileList[0];
    
    setUploading(true);
    setError(null);

    try {
      let data: Record<string, string> = {};

      if (file.name.endsWith('.json')) {
        const text = await file.text();
        try {
          data = JSON.parse(text);
          // Flatten if nested
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
        const workbook = XLSX.read(buffer);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(firstSheet);
        
        // Expecting columns: key, value
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
          code: values.code,
          name: values.name || values.code,
          data,
          updateType: values.updateType,
        }),
      });

      if (!res.ok) throw new Error(t('upload.error.failed', '上传失败'));

      message.success(t('upload.success', '上传成功'));
      onSuccess();
      onClose();
      form.resetFields();
      setFileList([]);
    } catch (err: any) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Modal
      title={
        <Space>
          <CloudUploadOutlined className="text-indigo-600" />
          <span>{t('upload.title', '上传语言包')}</span>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('button.cancel', '取消')}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={uploading} 
          onClick={handleUpload}
          disabled={fileList.length === 0}
        >
          {uploading ? t('upload.status.uploading', '上传中...') : t('button.confirm_upload', '确认上传')}
        </Button>
      ]}
      width={600}
      centered
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          code: 'en-US',
          updateType: 'incremental'
        }}
        className="mt-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="code"
            label={t('upload.label.code', '语言编码 (Code)')}
            rules={[{ required: true, message: t('form.error.code', '请输入语言编码') }]}
          >
            <Input placeholder="如: en-US" />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('upload.label.name', '语言名称 (Name)')}
            rules={[{ required: true, message: t('form.error.name', '请输入语言名称') }]}
          >
            <Input placeholder="如: English" />
          </Form.Item>
        </div>

        <Form.Item
          name="updateType"
          label={t('upload.label.mode', '更新模式')}
        >
          <Radio.Group>
            <Radio value="incremental">{t('upload.mode.incremental', '增量更新')}</Radio>
            <Radio value="full">{t('upload.mode.full', '全量覆盖')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('upload.dropzone.hint', '语言包文件')}>
          <Dragger {...uploadProps as any}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('upload.dropzone.hint', '点击或拖拽文件到此处')}</p>
            <p className="ant-upload-hint">
              {t('upload.dropzone.support', '支持 .json, .xlsx 格式')}
            </p>
          </Dragger>
          <div className="mt-2 text-right">
            <a href="/template.json" download="template.json" className="text-indigo-600 hover:text-indigo-800 text-sm">
              {t('upload.download_template', '下载语言包模板 (JSON)')}
            </a>
          </div>
        </Form.Item>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mt-4"
          />
        )}
      </Form>
    </Modal>
  );
};
