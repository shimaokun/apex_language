<script setup lang="ts">
import { ref, reactive } from 'vue';
import { 
  Card, Input, InputNumber, Select, Cascader, TreeSelect, 
  DatePicker, TimePicker, Switch, Slider, Rate, Radio, 
  Checkbox, Upload, Button, Form, Mentions, AutoComplete, Space
} from 'ant-design-vue';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons-vue';

// AutoComplete
const autoValue = ref('');
const autoOptions = ref<{ value: string }[]>([]);
const onSearch = (searchText: string) => {
  autoOptions.value = !searchText ? [] : [
    { value: searchText },
    { value: searchText + searchText },
    { value: searchText + searchText + searchText },
  ];
};

// Cascader
const cascaderValue = ref<string[]>([]);
const cascaderOptions = [
  { value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou' }] },
  { value: 'jiangsu', label: 'Jiangsu', children: [{ value: 'nanjing', label: 'Nanjing' }] },
];

// TreeSelect
const treeValue = ref<string>();
const treeData = [
  { label: 'Node 1', value: '0-0', children: [{ label: 'Child Node 1', value: '0-0-0' }] },
  { label: 'Node 2', value: '0-1' },
];

// Form
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => console.log('Success:', values);

// Mentions
const mentionsValue = ref('@afc163');
</script>

<template>
  <div class="p-6 h-full overflow-y-auto bg-slate-50">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800 m-0">数据录入 (Data Entry)</h2>
      <p class="text-slate-500 mt-2">Ant Design Vue 数据录入组件全集展示</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Input & Textarea -->
      <Card title="输入框 (Input & Textarea)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Input placeholder="Basic usage" />
          <Input addon-before="Http://" addon-after=".com" default-value="mysite" />
          <Input.Search placeholder="input search text" enter-button />
          <Input.Password placeholder="input password" />
          <Input.TextArea placeholder="Autosize textarea" :auto-size="{ minRows: 2, maxRows: 5 }" />
        </Space>
      </Card>

      <!-- Select & AutoComplete -->
      <Card title="选择器 (Select & AutoComplete)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Select default-value="lucy" class="w-full" :options="[{value: 'jack', label: 'Jack'}, {value: 'lucy', label: 'Lucy'}]" />
          <Select mode="multiple" placeholder="Please select" class="w-full" :options="[{value: 'a', label: 'Apples'}, {value: 'b', label: 'Bananas'}]" />
          <AutoComplete
            v-model:value="autoValue"
            :options="autoOptions"
            class="w-full"
            placeholder="Input to search"
            @search="onSearch"
          />
        </Space>
      </Card>

      <!-- Cascader & TreeSelect -->
      <Card title="级联 & 树选择 (Cascader & TreeSelect)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Cascader v-model:value="cascaderValue" :options="cascaderOptions" placeholder="Please select" class="w-full" />
          <TreeSelect
            v-model:value="treeValue"
            show-search
            class="w-full"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="Please select"
            allow-clear
            tree-default-expand-all
            :tree-data="treeData"
          />
        </Space>
      </Card>

      <!-- Date & Time Picker -->
      <Card title="日期 & 时间 (Date & Time Picker)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <DatePicker class="w-full" />
          <DatePicker.RangePicker class="w-full" />
          <TimePicker class="w-full" />
          <TimePicker.TimeRangePicker class="w-full" />
        </Space>
      </Card>

      <!-- Radio, Checkbox, Switch -->
      <Card title="单选/多选/开关 (Radio, Checkbox, Switch)" class="rounded-xl shadow-sm">
        <Space direction="vertical" size="large" class="w-full">
          <Radio.Group default-value="a">
            <Radio.Button value="a">Hangzhou</Radio.Button>
            <Radio.Button value="b">Shanghai</Radio.Button>
            <Radio.Button value="c">Beijing</Radio.Button>
          </Radio.Group>
          <Checkbox.Group :options="['Apple', 'Pear', 'Orange']" :default-value="['Apple']" />
          <Space>
            <Switch default-checked />
            <Switch checked-children="开" un-checked-children="关" />
          </Space>
        </Space>
      </Card>

      <!-- Slider, Rate, InputNumber -->
      <Card title="滑动/评分/数字 (Slider, Rate, Number)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Slider :default-value="30" />
          <Slider range :default-value="[20, 50]" />
          <Rate :default-value="2.5" allow-half />
          <InputNumber :min="1" :max="10" :default-value="3" class="w-full" />
        </Space>
      </Card>

      <!-- Upload -->
      <Card title="上传 (Upload)" class="rounded-xl shadow-sm">
        <Space direction="vertical" class="w-full">
          <Upload action="/upload.do">
            <Button><UploadOutlined /> Click to Upload</Button>
          </Upload>
          <Upload.Dragger name="file" action="/upload.do">
            <p class="ant-upload-drag-icon"><InboxOutlined /></p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
          </Upload.Dragger>
        </Space>
      </Card>

      <!-- Mentions & Form -->
      <Card title="提及 & 表单 (Mentions & Form)" class="rounded-xl shadow-sm md:col-span-2 xl:col-span-2">
        <Row :gutter="24">
          <Col :span="12">
            <Mentions v-model:value="mentionsValue" :options="[{value: 'afc163', label: 'afc163'}, {value: 'zombieJ', label: 'zombieJ'}]" placeholder="Mention someone" />
          </Col>
          <Col :span="12">
            <Form :model="formState" name="basic" autocomplete="off" @finish="onFinish" layout="vertical">
              <Form.Item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
                <Input v-model:value="formState.username" />
              </Form.Item>
              <Form.Item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
                <Input.Password v-model:value="formState.password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" html-type="submit">Submit</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>
