<script setup lang="ts">
import { ref, computed, onMounted, watch, h, reactive } from 'vue';
import { 
  Layout, 
  Menu, 
  Button, 
  Input, 
  Table, 
  Card, 
  Switch, 
  Space, 
  ConfigProvider, 
  Tag,
  Tooltip,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Popconfirm,
  App as AntdApp,
  theme
} from 'ant-design-vue';
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
  SafetyOutlined,
  EditOutlined,
  DeleteOutlined,
  ScanOutlined,
  FileDoneOutlined,
  UserSwitchOutlined,
  LockOutlined,
  ApiOutlined,
  FormOutlined,
  DesktopOutlined,
  MessageOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { format } from 'date-fns';
import { zhCN as dateZhCN, enUS as dateEnUS } from 'date-fns/locale';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import { useI18nStore, Language } from './stores/i18n';
import UploadModal from './components/UploadModal.vue';
import AssetTable from './components/AssetTable.vue';
import SecurityMonitoring from './components/SecurityMonitoring.vue';
import ThreatAnalysis from './components/ThreatAnalysis.vue';
import ThreatResponse from './components/ThreatResponse.vue';
import RiskManagement from './components/RiskManagement.vue';
import CloudSecurity from './components/CloudSecurity.vue';
import AppCenter from './components/AppCenter.vue';
import VulnScanning from './components/VulnScanning.vue';
import ComplianceAudit from './components/ComplianceAudit.vue';
import IdentityAccess from './components/IdentityAccess.vue';
import DataLeakage from './components/DataLeakage.vue';
import ApiSecurity from './components/ApiSecurity.vue';
import UIDataEntry from './components/UIDataEntry.vue';
import UIDataDisplay from './components/UIDataDisplay.vue';
import UIFeedback from './components/UIFeedback.vue';

const { Header, Sider, Content } = Layout;

const i18n = useI18nStore();
const { state, t, refreshLanguages, toggleLanguage, deleteLanguage, updateLanguage, fetchDefaultTranslations, fetchTranslations } = i18n;

const activeMenu = ref('config_management');
const isUploadOpen = ref(false);
const searchQuery = ref('');
const isEditOpen = ref(false);
const editingLang = ref<Language | null>(null);
const editFormRef = ref();
const editFormState = reactive({
  name: '',
  version: ''
});

onMounted(async () => {
  await refreshLanguages();
  await fetchDefaultTranslations();
  await fetchTranslations(state.locale);
});

watch(() => state.locale, (newLocale) => {
  fetchTranslations(newLocale, true);
  localStorage.setItem('app_locale', newLocale);
});

const handleMenuClick = (e: any) => {
  activeMenu.value = e.key;
};

const userMenuItems = computed(() => [
  { key: 'profile', label: t('user.profile', '个人中心') },
  { key: 'logout', label: t('user.logout', '退出登录'), danger: true }
]);

const handleUserMenuClick = ({ key }: { key: string }) => {
  if (key === 'logout') {
    message.success(t('user.logoutSuccess', '已退出登录'));
  } else {
    message.info(`点击了: ${key}`);
  }
};

const handleEdit = (record: Language) => {
  editingLang.value = record;
  editFormState.name = record.name;
  editFormState.version = record.version;
  isEditOpen.value = true;
};

const handleUpdate = async () => {
  try {
    await editFormRef.value.validate();
    if (editingLang.value) {
      await updateLanguage(editingLang.value.code, editFormState.name, editFormState.version);
      message.success(t('message.update_success', '更新成功'));
      isEditOpen.value = false;
    }
  } catch (err) {
    console.error('Update failed', err);
  }
};

const handleDelete = async (code: string) => {
  await deleteLanguage(code);
  message.success(t('message.delete_success', '删除成功'));
};

const filteredLanguages = computed(() => {
  return state.languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    lang.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const menuItems = computed(() => [
  { key: 'monitoring', icon: () => h(DashboardOutlined), label: t('menu.monitoring', '安全监控') },
  { key: 'threat_analysis', icon: () => h(SecurityScanOutlined), label: t('menu.threat_analysis', '威胁分析') },
  { key: 'threat_response', icon: () => h(AlertOutlined), label: t('menu.threat_response', '威胁响应') },
  { key: 'risk_management', icon: () => h(SafetyCertificateOutlined), label: t('menu.risk_management', '风险管理') },
  { key: 'asset_center', icon: () => h(DeploymentUnitOutlined), label: t('menu.asset_center', '资产中心') },
  { key: 'cloud_security', icon: () => h(CloudServerOutlined), label: t('menu.cloud_security', '云安全中心') },
  { key: 'vuln_scanning', icon: () => h(ScanOutlined), label: t('menu.vuln_scanning', '漏洞扫描') },
  { key: 'compliance_audit', icon: () => h(FileDoneOutlined), label: t('menu.compliance_audit', '合规审计') },
  { key: 'identity_access', icon: () => h(UserSwitchOutlined), label: t('menu.identity_access', '身份与访问') },
  { key: 'data_leakage', icon: () => h(LockOutlined), label: t('menu.data_leakage', '数据防泄漏') },
  { key: 'api_security', icon: () => h(ApiOutlined), label: t('menu.api_security', 'API 安全') },
  { key: 'config_management', icon: () => h(SettingOutlined), label: t('menu.config_management', '配置管理') },
  { key: 'app_center', icon: () => h(AppstoreOutlined), label: t('menu.app_center', '应用中心') },
  {
    key: 'ui_components',
    icon: () => h(AppstoreOutlined),
    label: 'Antd 组件库展示',
    children: [
      { key: 'ui_data_entry', icon: () => h(FormOutlined), label: '数据录入' },
      { key: 'ui_data_display', icon: () => h(DesktopOutlined), label: '数据展示' },
      { key: 'ui_feedback', icon: () => h(MessageOutlined), label: '反馈组件' },
    ]
  }
]);

const getDateLocale = () => {
  if (state.locale.startsWith('zh')) return dateZhCN;
  if (state.locale.startsWith('en')) return dateEnUS;
  return dateEnUS;
};

const columns = [
  {
    title: t('table.header.info', '语言信息'),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: t('table.header.code', '编码'),
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: t('table.header.version', '版本'),
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: t('table.header.updated', '更新时间'),
    dataIndex: 'updated_at',
    key: 'updated_at',
  },
  {
    title: t('table.header.status', '状态'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: t('table.header.actions', '操作'),
    key: 'actions',
    align: 'right',
  },
];

const getAntdLocale = computed(() => {
  if (state.locale.startsWith('zh')) return zhCN;
  if (state.locale.startsWith('en')) return enUS;
  return enUS;
});

const currentMenuTitle = computed(() => {
  let found = menuItems.value.find(m => m.key === activeMenu.value);
  if (!found) {
    // Check children
    for (const item of menuItems.value) {
      if (item.children) {
        const child = item.children.find(c => c.key === activeMenu.value);
        if (child) return child.label;
      }
    }
  }
  return found ? found.label : t('header.title', '语言包管理');
});
</script>

<template>
  <ConfigProvider
    :locale="getAntdLocale"
    :theme="{
      token: {
        colorPrimary: '#4f46e5',
        borderRadius: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      components: {
        Layout: {
          siderBg: '#1E222D',
          headerBg: '#1E222D',
        },
        Menu: {
          darkItemBg: '#1E222D',
          darkItemColor: '#94a3b8',
          darkItemSelectedBg: 'rgba(255, 255, 255, 0.1)',
          darkItemSelectedColor: '#ffffff',
        },
      },
    }"
  >
    <AntdApp>
      <Layout class="h-screen overflow-hidden bg-[#F8FAFC]">
        <Sider :width="256" class="h-full">
          <div class="h-full flex flex-col">
            <div class="p-6 flex items-center gap-3 border-b border-white/5 shrink-0">
              <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <SafetyOutlined class="text-xl text-white" />
              </div>
              <span class="text-lg font-bold text-white tracking-tight">{{ t('sidebar.title', 'APEX 安全防护') }}</span>
            </div>
            
            <Menu
              theme="dark"
              mode="inline"
              :selectedKeys="[activeMenu]"
              :items="menuItems"
              @click="handleMenuClick"
              class="flex-1 min-h-0 py-4 border-none overflow-y-auto overflow-x-hidden custom-scrollbar"
            />

            <div class="p-4 border-t border-white/5 space-y-4 shrink-0">
              <div class="flex items-center justify-around text-slate-400">
                <Button type="text" class="hover:text-white">
                  <template #icon><AppstoreOutlined class="text-slate-400" /></template>
                </Button>
                <Button type="text" class="hover:text-white">
                  <template #icon><UserOutlined class="text-slate-400" /></template>
                </Button>
                <Button type="text" class="hover:text-white">
                  <template #icon><HomeOutlined class="text-slate-400" /></template>
                </Button>
              </div>
              
              <Dropdown trigger="click">
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl group cursor-pointer hover:bg-white/10 transition-all">
                  <Space>
                    <Avatar size="small" class="bg-cyan-500">
                      <template #icon><UserOutlined /></template>
                    </Avatar>
                    <span class="text-sm font-medium text-white">{{ t('user.admin', 'admin') }}</span>
                  </Space>
                  <DownOutlined class="text-xs text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <template #overlay>
                  <Menu @click="handleUserMenuClick" :items="userMenuItems" />
                </template>
              </Dropdown>
            </div>
          </div>
        </Sider>

        <Layout class="flex flex-col h-full">
          <Header class="px-8 flex items-center justify-start h-16 shrink-0 z-30 bg-[#1E222D] shadow-md">
            <h2 class="text-lg font-bold text-white m-0 tracking-wide">{{ currentMenuTitle }}</h2>
          </Header>

          <Content class="p-8 overflow-y-auto flex-1 flex flex-col min-h-0">
            <div class="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
              <template v-if="activeMenu === 'monitoring'">
                <SecurityMonitoring />
              </template>
              <template v-else-if="activeMenu === 'threat_analysis'">
                <ThreatAnalysis />
              </template>
              <template v-else-if="activeMenu === 'threat_response'">
                <ThreatResponse />
              </template>
              <template v-else-if="activeMenu === 'risk_management'">
                <RiskManagement />
              </template>
              <template v-else-if="activeMenu === 'cloud_security'">
                <CloudSecurity />
              </template>
              <template v-else-if="activeMenu === 'vuln_scanning'">
                <VulnScanning />
              </template>
              <template v-else-if="activeMenu === 'compliance_audit'">
                <ComplianceAudit />
              </template>
              <template v-else-if="activeMenu === 'identity_access'">
                <IdentityAccess />
              </template>
              <template v-else-if="activeMenu === 'data_leakage'">
                <DataLeakage />
              </template>
              <template v-else-if="activeMenu === 'api_security'">
                <ApiSecurity />
              </template>
              <template v-else-if="activeMenu === 'app_center'">
                <AppCenter />
              </template>
              <template v-else-if="activeMenu === 'ui_data_entry'">
                <UIDataEntry />
              </template>
              <template v-else-if="activeMenu === 'ui_data_display'">
                <UIDataDisplay />
              </template>
              <template v-else-if="activeMenu === 'ui_feedback'">
                <UIFeedback />
              </template>
              <template v-else-if="activeMenu === 'asset_center'">
                <AssetTable />
              </template>
              <template v-else-if="activeMenu === 'config_management'">
                <!-- Toolbar -->
                <div class="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 shrink-0">
                  <Input
                    :placeholder="t('search.placeholder', '搜索语言名称或编码...')"
                    v-model:value="searchQuery"
                    class="w-full sm:w-96 h-11 rounded-xl border-slate-200"
                  >
                    <template #prefix><SearchOutlined class="text-slate-400" /></template>
                  </Input>
                  <Space size="middle" class="w-full sm:w-auto">
                    <Tooltip :title="t('button.refresh', '刷新列表')">
                      <Button 
                        @click="refreshLanguages()"
                        class="h-11 w-11 flex items-center justify-center rounded-xl"
                      >
                        <template #icon><ReloadOutlined :spin="state.loading" /></template>
                      </Button>
                    </Tooltip>
                    <Button
                      type="primary"
                      @click="isUploadOpen = true"
                      class="h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-200"
                    >
                      <template #icon><PlusOutlined /></template>
                      {{ t('button.upload', '上传语言包') }}
                    </Button>
                  </Space>
                </div>

                <!-- Language Table -->
                <Card :bordered="false" class="shadow-sm rounded-2xl overflow-hidden flex-table-wrapper" :body-style="{ padding: 0 }">
                  <Table
                    class="flex-table"
                    :columns="columns"
                    :data-source="filteredLanguages"
                    row-key="code"
                    :loading="state.loading"
                    :pagination="{
                      pageSize: 10,
                      showSizeChanger: true,
                      class: 'px-6 py-4',
                    }"
                  >
                    <template #bodyCell="{ column, text, record }">
                      <template v-if="column.key === 'name'">
                        <Space>
                          <Avatar shape="square" class="bg-slate-100 text-slate-500">
                            <template #icon><TranslationOutlined /></template>
                          </Avatar>
                          <span class="font-semibold text-slate-900">{{ text }}</span>
                        </Space>
                      </template>
                      <template v-else-if="column.key === 'code'">
                        <Tag color="blue">{{ text }}</Tag>
                      </template>
                      <template v-else-if="column.key === 'version'">
                        <span class="text-slate-600">{{ text }}</span>
                      </template>
                      <template v-else-if="column.key === 'updated_at'">
                        <span class="text-slate-500 text-sm">
                          {{ format(new Date(text), 'yyyy-MM-dd HH:mm', { locale: getDateLocale() }) }}
                        </span>
                      </template>
                      <template v-else-if="column.key === 'status'">
                        <Tooltip :title="text === 1 ? t('status.active', '当前已激活') : t('status.inactive', '点击激活')">
                          <Switch 
                            :checked="text === 1" 
                            @change="() => {
                              if (text !== 1) {
                                toggleLanguage(record.code);
                              }
                            }"
                            :class="text === 1 ? 'bg-emerald-500' : ''"
                          />
                        </Tooltip>
                      </template>
                      <template v-else-if="column.key === 'actions'">
                        <Space>
                          <Button type="link" @click="handleEdit(record)" class="px-0">
                            {{ t('button.edit', '编辑') }}
                          </Button>
                          <Popconfirm
                            :title="t('modal.delete.title', '确认删除')"
                            :description="t('modal.delete.content', `确定要删除语言包 ${record.name} 吗？`).replace('{name}', record.name)"
                            @confirm="handleDelete(record.code)"
                            :ok-text="t('button.confirm', '确定')"
                            :cancel-text="t('button.cancel', '取消')"
                            :ok-button-props="{ danger: true }"
                            :disabled="record.status === 1"
                          >
                            <Tooltip :title="record.status === 1 ? t('delete.disabled', '激活状态无法删除') : ''">
                              <Button type="link" :disabled="record.status === 1" class="px-0">
                                {{ t('button.delete', '删除') }}
                              </Button>
                            </Tooltip>
                          </Popconfirm>
                        </Space>
                      </template>
                      <template v-else>
                        {{ text }}
                      </template>
                    </template>
                    <template #emptyText>
                      <div class="py-12 flex flex-col items-center gap-2">
                        <SearchOutlined class="text-slate-200 text-5xl" />
                        <p class="text-slate-500 font-medium">{{ t('empty.no_results', '未找到匹配的语言包') }}</p>
                      </div>
                    </template>
                  </Table>
                </Card>
              </template>
            </div>
          </Content>
        </Layout>
      </Layout>

      <UploadModal 
        :is-open="isUploadOpen" 
        @close="isUploadOpen = false" 
        @success="refreshLanguages()" 
      />

      <Modal
        :title="t('modal.edit.title', '编辑语言包')"
        :open="isEditOpen"
        @ok="handleUpdate"
        @cancel="isEditOpen = false"
        :ok-text="t('button.save', '保存')"
        :cancel-text="t('button.cancel', '取消')"
        class="rounded-2xl overflow-hidden"
      >
        <Form ref="editFormRef" :model="editFormState" layout="vertical" class="pt-4">
          <Form.Item
            name="name"
            :label="t('form.label.name', '语言名称')"
            :rules="[{ required: true, message: t('form.error.name', '请输入语言名称') }]"
          >
            <Input v-model:value="editFormState.name" :placeholder="t('form.placeholder.name', '例如：简体中文')" class="rounded-xl h-11" />
          </Form.Item>
          <Form.Item
            name="version"
            :label="t('form.label.version', '版本号')"
            :rules="[{ required: true, message: t('form.error.version', '请输入版本号') }]"
          >
            <Input v-model:value="editFormState.version" :placeholder="t('form.placeholder.version', '例如：1.0.0')" class="rounded-xl h-11" />
          </Form.Item>
        </Form>
      </Modal>
    </AntdApp>
  </ConfigProvider>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
}

.ant-layout-sider {
  background: #1E222D !important;
}

.ant-menu-dark {
  background: #1E222D !important;
}

/* Flex Table Styles */
.flex-table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}
.flex-table-wrapper > .ant-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0;
}
.flex-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 600px;
}
.flex-table-wrapper .flex-table {
  min-height: 0;
}
.flex-table .ant-table-wrapper,
.flex-table .ant-spin-nested-loading,
.flex-table .ant-spin-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.flex-table .ant-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.flex-table .ant-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.flex-table .ant-table-content {
  flex: 1;
  overflow-y: auto;
}
.flex-table .ant-table-thead > tr > th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fafafa;
}
.flex-table .ant-table-body {
  flex: 1;
  overflow-y: auto;
}

/* Custom Scrollbar for dark theme Sider */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
