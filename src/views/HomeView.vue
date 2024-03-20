<script setup>
import { ref } from 'vue'
const content = ref('')
const options = {}

const handleTranslate = () => {
  console.log(content.value)
}
</script>

<template>
  <main class="container flex flex-col">
    <quill-editor
      ref="QuillEditor"
      v-model:content="content"
      v-bind:options="options"
      contentType="html"
    />
    <div class="container flex justify-end mt-4">
      <el-button type="primary" @click="handleTranslate">转换</el-button>
    </div>
  </main>
</template>
