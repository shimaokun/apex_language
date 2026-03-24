<script setup lang="ts">
import { ref } from 'vue';
import { 
  Card, Avatar, Badge, Calendar, Carousel, Collapse, 
  Descriptions, Empty, Image, List, Popover, Segmented, 
  Statistic, Tabs, Tag, Timeline, Tooltip, Tree, Row, Col, Space
} from 'ant-design-vue';
import { UserOutlined, AntDesignOutlined, ArrowUpOutlined } from '@ant-design/icons-vue';

const activeKey = ref(['1']);
const listData = ['Racing car sprays burning fuel into crowd.', 'Japanese princess to wed commoner.', 'Australian walks 100km after outback crash.'];
const segmentedValue = ref('Map');
const treeData = [
  { title: 'parent 1', key: '0-0', children: [{ title: 'parent 1-0', key: '0-0-0', disabled: true, children: [{ title: 'leaf', key: '0-0-0-0', disableCheckbox: true }, { title: 'leaf', key: '0-0-0-1' }] }, { title: 'parent 1-1', key: '0-0-1', children: [{ key: '0-0-1-0', title: 'sss' }] }] },
];
</script>

<template>
  <div class="p-6 h-full overflow-y-auto bg-slate-50">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800 m-0">数据展示 (Data Display)</h2>
      <p class="text-slate-500 mt-2">Ant Design Vue 数据展示组件全集展示</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Avatar & Badge -->
      <Card title="头像 & 徽标 (Avatar & Badge)" class="rounded-xl shadow-sm">
        <Space size="large" align="center">
          <Avatar :size="64">
            <template #icon><UserOutlined /></template>
          </Avatar>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <Avatar style="background-color: #f56a00">U</Avatar>
          <Badge count="5">
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge dot>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge status="success" text="Success" />
        </Space>
      </Card>

      <!-- Tag & Tooltip & Popover -->
      <Card title="标签 & 提示 (Tag, Tooltip, Popover)" class="rounded-xl shadow-sm">
        <Space direction="vertical" size="middle">
          <Space>
            <Tag color="magenta">magenta</Tag>
            <Tag color="red">red</Tag>
            <Tag color="volcano">volcano</Tag>
            <Tag color="orange">orange</Tag>
          </Space>
          <Space>
            <Tooltip title="prompt text">
              <span>Tooltip will show on mouse enter.</span>
            </Tooltip>
            <Popover title="Title" trigger="click">
              <template #content>
                <p>Content</p>
                <p>Content</p>
              </template>
              <a-button>Click me</a-button>
            </Popover>
          </Space>
        </Space>
      </Card>

      <!-- Statistic & Segmented -->
      <Card title="统计 & 分段控制器 (Statistic & Segmented)" class="rounded-xl shadow-sm">
        <Space direction="vertical" size="large" class="w-full">
          <Row :gutter="16">
            <Col :span="12">
              <Statistic title="Active Users" :value="112893" />
            </Col>
            <Col :span="12">
              <Statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
            </Col>
          </Row>
          <Segmented v-model:value="segmentedValue" :options="['Map', 'Transit', 'Satellite']" />
        </Space>
      </Card>

      <!-- Collapse & Timeline -->
      <Card title="折叠面板 & 时间轴 (Collapse & Timeline)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Collapse v-model:activeKey="activeKey">
            <Collapse.Panel key="1" header="This is panel header 1">
              <p>A dog is a type of domesticated animal.</p>
            </Collapse.Panel>
            <Collapse.Panel key="2" header="This is panel header 2">
              <p>Known for its loyalty and faithfulness.</p>
            </Collapse.Panel>
          </Collapse>
          <Timeline class="mt-4">
            <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
            <Timeline.Item color="green">Technical testing 2015-09-01</Timeline.Item>
          </Timeline>
        </Space>
      </Card>

      <!-- List & Empty -->
      <Card title="列表 & 空状态 (List & Empty)" class="rounded-xl shadow-sm">
        <Tabs>
          <Tabs.TabPane key="1" tab="List">
            <List size="small" bordered :data-source="listData">
              <template #renderItem="{ item }">
                <List.Item>{{ item }}</List.Item>
              </template>
            </List>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="Empty">
            <Empty />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <!-- Tree & Image -->
      <Card title="树形 & 图片 (Tree & Image)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Tree checkable :tree-data="treeData" :default-expanded-keys="['0-0-0', '0-0-1']" :default-selected-keys="['0-0-0', '0-0-1']" :default-checked-keys="['0-0-0', '0-0-1']" />
          <Image :width="100" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
        </Space>
      </Card>

      <!-- Descriptions -->
      <Card title="描述列表 (Descriptions)" class="rounded-xl shadow-sm md:col-span-2 xl:col-span-3">
        <Descriptions title="User Info" bordered>
          <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
          <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
          <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
          <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
          <Descriptions.Item label="Usage Time" :span="2">2019-04-24 18:00:00</Descriptions.Item>
          <Descriptions.Item label="Status" :span="3"><Badge status="processing" text="Running" /></Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  </div>
</template>
