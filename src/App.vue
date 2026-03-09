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
  DeleteOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { format } from 'date-fns';
import { zhCN as dateZhCN, enUS as dateEnUS } from 'date-fns/locale';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import { useI18nStore, Language } from './stores/i18n';
import UploadModal from './components/UploadModal.vue';

const { Header, Sider, Content } = Layout;

const i18n = useI18nStore();
const { state, t, refreshLanguages, toggleLanguage, deleteLanguage, updateLanguage, fetchDefaultTranslations, fetchTranslations } = i18n;

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
  { key: 'config_management', icon: () => h(SettingOutlined), label: t('menu.config_management', '配置管理') },
  { key: 'app_center', icon: () => h(AppstoreOutlined), label: t('menu.app_center', '应用中心') },
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
          headerBg: '#ffffff',
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
      <Layout class="min-h-screen bg-[#F8FAFC]">
        <Sider :width="256" class="overflow-hidden flex flex-col">
          <div class="p-6 flex items-center gap-3 border-b border-white/5">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <SafetyOutlined class="text-xl text-white" />
            </div>
            <span class="text-lg font-bold text-white tracking-tight">{{ t('sidebar.title', 'APEX 安全防护') }}</span>
          </div>
          
          <Menu
            theme="dark"
            mode="inline"
            :selectedKeys="['config_management']"
            :items="menuItems"
            class="flex-1 py-4 border-none"
          />

          <div class="p-4 border-t border-white/5 space-y-4">
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
                <Menu>
                  <Menu.Item key="profile">{{ t('user.profile', '个人中心') }}</Menu.Item>
                  <Menu.Item key="logout" danger>{{ t('user.logout', '退出登录') }}</Menu.Item>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </Sider>

        <Layout>
          <Header class="px-8 border-b border-slate-200 flex items-center h-16 sticky top-0 z-30">
            <h2 class="text-sm font-bold text-slate-700 m-0">{{ t('header.title', '语言包管理') }}</h2>
          </Header>

          <Content class="p-8 overflow-y-auto">
            <div class="max-w-7xl mx-auto">
              <!-- Toolbar -->
              <div class="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
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
              <Card :bordered="false" class="shadow-sm rounded-2xl overflow-hidden" :body-style="{ padding: 0 }">
                <Table
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
                  </template>
                  <template #emptyText>
                    <div class="py-12 flex flex-col items-center gap-2">
                      <SearchOutlined class="text-slate-200 text-5xl" />
                      <p class="text-slate-500 font-medium">{{ t('empty.no_results', '未找到匹配的语言包') }}</p>
                    </div>
                  </template>
                </Table>
              </Card>
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
</style>
