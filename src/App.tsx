import React, { useState } from 'react';
import { I18nProvider, useI18n, Language } from './contexts/I18nContext';
import { UploadModal } from './components/UploadModal';
import { 
  Layout, 
  Menu, 
  Button, 
  Input, 
  Table, 
  Card, 
  Statistic, 
  Switch, 
  Space, 
  ConfigProvider, 
  theme,
  Tag,
  Tooltip,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Popconfirm,
  App as AntdApp
} from 'antd';
import { 
  GlobalOutlined, 
  PlusOutlined, 
  ReloadOutlined, 
  SettingOutlined, 
  SearchOutlined,
  DashboardOutlined,
  SecurityScanOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  DeploymentUnitOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
  UserOutlined,
  HomeOutlined,
  DownOutlined,
  TranslationOutlined,
  ClockCircleOutlined,
  KeyOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { 
  zhCN as dateZhCN, 
  enUS as dateEnUS 
} from 'date-fns/locale';
import zh_CN from 'antd/es/locale/zh_CN';
import en_US from 'antd/es/locale/en_US';
import { motion } from 'motion/react';

const { Header, Sider, Content } = Layout;
const AntdCard = Card as any;

const Dashboard = () => {
  const { 
    languages, 
    loading, 
    refreshLanguages, 
    locale, 
    setLocale, 
    t,
    toggleLanguage,
    deleteLanguage,
    updateLanguage
  } = useI18n();

  console.log(`[Dashboard] Rendering with locale: ${locale}, languages count: ${languages.length}`);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  const handleEdit = (record: Language) => {
    setEditingLang(record);
    form.setFieldsValue({
      name: record.name,
      version: record.version,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (editingLang) {
        await updateLanguage(editingLang.code, values.name, values.version);
        message.success(t('message.update_success', '更新成功'));
        setIsEditOpen(false);
      }
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDelete = async (code: string) => {
    await deleteLanguage(code);
    message.success(t('message.delete_success', '删除成功'));
  };

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = React.useMemo(() => [
    { key: 'monitoring', icon: <DashboardOutlined />, label: t('menu.monitoring', '安全监控') },
    { key: 'threat_analysis', icon: <SecurityScanOutlined />, label: t('menu.threat_analysis', '威胁分析') },
    { key: 'threat_response', icon: <AlertOutlined />, label: t('menu.threat_response', '威胁响应') },
    { key: 'risk_management', icon: <SafetyCertificateOutlined />, label: t('menu.risk_management', '风险管理') },
    { key: 'asset_center', icon: <DeploymentUnitOutlined />, label: t('menu.asset_center', '资产中心') },
    { key: 'cloud_security', icon: <CloudServerOutlined />, label: t('menu.cloud_security', '云安全中心') },
    { key: 'config_management', icon: <SettingOutlined />, label: t('menu.config_management', '配置管理') },
    { key: 'app_center', icon: <AppstoreOutlined />, label: t('menu.app_center', '应用中心') },
  ], [t]);

  const columns = React.useMemo(() => [
    {
      title: t('table.header.info', '语言信息'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <Avatar shape="square" icon={<TranslationOutlined />} className="bg-slate-100 text-slate-500" />
          <span className="font-semibold text-slate-900">{text}</span>
        </Space>
      ),
    },
    {
      title: t('table.header.code', '编码'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: t('table.header.version', '版本'),
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => (
        <span className="text-slate-600">{version}</span>
      ),
    },
    {
      title: t('table.header.updated', '更新时间'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => (
        <span className="text-slate-500 text-sm">
          {format(new Date(date), 'yyyy-MM-dd HH:mm', { locale: getDateLocale() })}
        </span>
      ),
    },
    {
      title: t('table.header.status', '状态'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: number, record: Language) => (
        <Tooltip title={status === 1 ? t('status.active', '当前已激活') : t('status.inactive', '点击激活')}>
          <Switch 
            checked={status === 1} 
            onChange={() => {
              if (status !== 1) {
                toggleLanguage(record.code).then(() => {
                  // The message will be shown in the context or after locale update
                });
              }
            }}
            className={status === 1 ? 'bg-emerald-500' : ''}
          />
        </Tooltip>
      ),
    },
    {
      title: t('table.header.actions', '操作'),
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Language) => (
        <Popconfirm
          title={t('modal.delete.title', '确认删除')}
          description={t('modal.delete.content', `确定要删除语言包 ${record.name} 吗？`).replace('{name}', record.name)}
          onConfirm={() => handleDelete(record.code)}
          okText={t('button.confirm', '确定')}
          cancelText={t('button.cancel', '取消')}
          okButtonProps={{ danger: true }}
          disabled={record.status === 1}
        >
          <Tooltip title={record.status === 1 ? t('delete.disabled', '激活状态无法删除') : ''}>
            <Button 
              type="link" 
              disabled={record.status === 1}
              className="px-0"
            >
              {t('button.delete', '删除')}
            </Button>
          </Tooltip>
        </Popconfirm>
      ),
    },
  ], [t, locale]);

  const getAntdLocale = () => {
    if (locale.startsWith('zh')) return zh_CN;
    if (locale.startsWith('en')) return en_US;
    // Default to English for other languages like French for now, 
    // unless we import more Antd locales
    return en_US;
  };

  const getDateLocale = () => {
    if (locale.startsWith('zh')) return dateZhCN;
    if (locale.startsWith('en')) return dateEnUS;
    return dateEnUS;
  };

  return (
    <ConfigProvider
      key={locale}
      locale={getAntdLocale()}
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        components: {
          Layout: {
            siderBg: '#1E222D',
            headerBg: '#ffffff',
          },
          Menu: {
            darkItemBg: '#1E222D',
            darkItemColor: '#94a3b8',
            darkItemSelectedBg: 'rgba(255, 255, 255, 0.1)',
            darkItemSelectedColor: '#ffffff',
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-[#F8FAFC]">
        <Sider width={256} className="overflow-hidden flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">{t('sidebar.title', 'APEX 安全防护')}</span>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['config_management']}
            items={menuItems}
            className="flex-1 py-4 border-none"
          />

          <div className="p-4 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-around text-slate-400">
              <Button type="text" icon={<AppstoreOutlined className="text-slate-400" />} className="hover:text-white" />
              <Button type="text" icon={<UserOutlined className="text-slate-400" />} className="hover:text-white" />
              <Button type="text" icon={<HomeOutlined className="text-slate-400" />} className="hover:text-white" />
            </div>
            
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: t('user.profile', '个人中心') },
                  { key: 'logout', label: t('user.logout', '退出登录'), danger: true },
                ]
              }}
              trigger={['click']}
            >
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl group cursor-pointer hover:bg-white/10 transition-all">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} className="bg-cyan-500" />
                  <span className="text-sm font-medium text-white">{t('user.admin', 'admin')}</span>
                </Space>
                <DownOutlined className="text-xs text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </Dropdown>
          </div>
        </Sider>

        <Layout>
          <Header className="px-8 border-b border-slate-200 flex items-center h-16 sticky top-0 z-30">
            <h2 className="text-sm font-bold text-slate-700 m-0">{t('header.title', '语言包管理')}</h2>
          </Header>

          <Content className="p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <Input
                  placeholder={t('search.placeholder', '搜索语言名称或编码...')}
                  prefix={<SearchOutlined className="text-slate-400" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-96 h-11 rounded-xl border-slate-200"
                />
                <Space size="middle" className="w-full sm:w-auto">
                  <Tooltip title={t('button.refresh', '刷新列表')}>
                    <Button 
                      icon={<ReloadOutlined spin={loading} />} 
                      onClick={() => refreshLanguages()}
                      className="h-11 w-11 flex items-center justify-center rounded-xl"
                    />
                  </Tooltip>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsUploadOpen(true)}
                    className="h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-200"
                  >
                    {t('button.upload', '上传语言包')}
                  </Button>
                </Space>
              </div>

              {/* Language Table */}
              <AntdCard variant="borderless" className="shadow-sm rounded-2xl overflow-hidden" styles={{ body: { padding: 0 } }}>
                <Table
                  columns={columns}
                  dataSource={filteredLanguages}
                  rowKey="code"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    className: 'px-6 py-4',
                  }}
                  locale={{
                    emptyText: (
                      <div className="py-12 flex flex-col items-center gap-2">
                        <SearchOutlined className="text-slate-200 text-5xl" />
                        <p className="text-slate-500 font-medium">{t('empty.no_results', '未找到匹配的语言包')}</p>
                      </div>
                    )
                  }}
                />
              </AntdCard>
            </div>
          </Content>
        </Layout>
      </Layout>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={() => refreshLanguages()} 
      />

      <Modal
        title={t('modal.edit.title', '编辑语言包')}
        open={isEditOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditOpen(false)}
        okText={t('button.save', '保存')}
        cancelText={t('button.cancel', '取消')}
        className="rounded-2xl overflow-hidden"
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            name="name"
            label={t('form.label.name', '语言名称')}
            rules={[{ required: true, message: t('form.error.name', '请输入语言名称') }]}
          >
            <Input placeholder={t('form.placeholder.name', '例如：简体中文')} className="rounded-xl h-11" />
          </Form.Item>
          <Form.Item
            name="version"
            label={t('form.label.version', '版本号')}
            rules={[{ required: true, message: t('form.error.version', '请输入版本号') }]}
          >
            <Input placeholder={t('form.placeholder.version', '例如：1.0.0')} className="rounded-xl h-11" />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default function App() {
  return (
    <AntdApp>
      <I18nProvider>
        <Dashboard />
      </I18nProvider>
    </AntdApp>
  );
}
