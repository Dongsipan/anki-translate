<script setup>
import { app, BrowserWindow, dialog } from 'electron'
import { ref } from 'vue'

import fs from 'fs'

const options = {}

const preContent = ref('')
const quillPreEditorRef = ref(null)
const handlePreFormat = () => {
  let delta = quillPreEditorRef.value.getText()
  // 删除每一行的序号（数字和随后的中文顿号）
  delta = delta.replace(/^\d+、/gm, '');
  // 删除所有行以P开头后跟数字的文字
  delta = delta.replace(/P\d+/gm, '');

  // 删除特定的文本内容
  delta = delta.replace(/电话.*3$/gm, '');
  delta = delta.replace(/电话：/gm, '');
  delta = delta.replace(/400-623-6833/gm, '');
  delta = delta.replace(/学习.*机会$/gm, '');// /学.*会$/
  delta = delta.replace(/学习改变命运，/gm, '');// /学.*会$/
  delta = delta.replace(/努力就有机会/gm, '');// /学.*会$/
  delta = delta.replace(/网址.*cn$/gm, '');
  delta = delta.replace(/网址.*com$/gm, '');
  delta = delta.replace(/网址：www.xkpx.cn/gm, '');
  delta = delta.replace(/内.*料$/gm, '');
  delta = delta.replace(/第+\d+页，共\d+页/gm, '');
  delta = delta.replace(/侵.*究$/gm, '');

  // 将\n处理成富文本的换行符<br>
  delta = delta.replace(/\n\s*\n/g, '\n');


  quillPreEditorRef.value.setContents(delta)
}

const blockContent = ref('')
const quillBlockEditorRef = ref(null)
const handleBlockTranslate = () => {
  let delta = quillBlockEditorRef.value.getContents()
  // 正则表达式匹配<strong>标签内的内容
  const regex = /<strong>(.*?)<\/strong>/g;
  // 使用replace函数进行替换，并且去掉<strong>标签
  delta = delta.replace(regex, '{{c1::$1}}');
  quillBlockEditorRef.value.setContents(delta)
}

const downloadBlockTextFile = () => {
  app.whenReady().then(createWindow);
}


function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 当窗口准备好时，可以调用保存文件的方法
  win.webContents.on('did-finish-load', () => {
    saveFile(win);
  });
}

function saveFile(window) {
  // 显示保存对话框
  dialog.showSaveDialog(window, {
    title: '保存文件',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'Text Files', extensions: ['txt'] }
    ]
  }).then(result => {
    if (!result.canceled) {
      // 用户选择了保存路径，现在写入文件
      const filePath = result.filePath;
      const content = quillBlockEditorRef.value.getText();

      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error('写入文件时出错:', err);
          return;
        }
        console.log('文件已保存:', filePath);
      });
    }
  }).catch(err => {
    console.error('显示保存对话框时出错:', err);
  });
}

</script>

<template>
  <main class="container flex flex-col">
    <el-tabs type="border-card">
      <el-tab-pane label="预处理">
        <quill-editor
          ref="quillPreEditorRef"
          v-model:content="preContent"
          v-bind:options="options"
          contentType="html"
        />
        <div class="container flex justify-end mt-4">
          <el-button type="primary" @click="handlePreFormat">预处理</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="选择填空">
        <quill-editor
          ref="quillBlockEditorRef"
          v-model:content="blockContent"
          v-bind:options="options"
          contentType="html"
        />
        <div class="container flex justify-end mt-4">
          <el-button type="primary" @click="handleBlockTranslate">转译</el-button>
          <el-button type="primary" @click="downloadBlockTextFile">下载</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="正反面">简答</el-tab-pane>
    </el-tabs>
  </main>
</template>
