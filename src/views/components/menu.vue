<template>
  <div class="menu-wrap">
    <div class="category__list" :class="{ 'fixed': isFixed }">

      <div class="category__list__item" :class="currentMenu===item.id?'active':''" v-for="item in menuData"
           @click="handleNav(item.id)">{{ item.label }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { BASE_URL } from "/@/store/constants";
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

let currentMenu = ref('')

let menuData = reactive([
  { label: '首页', id: 'index' },
  { label: '电影', id: 'dianying' },
  {label: '电视剧', id: 'dianshiju'},
  // {label: '综艺', id: 'zongyi'},
  // {label: '动漫', id: 'dongman'},
  // {label: '专题', id: 'zhuanti'},
])

let isFixed = ref(false); // 初始状态设为 false

// 监听地址栏路由
watch(() => route.name, (newName, oldName) => {
  currentMenu.value = route.name
}, { immediate: true });

// 监听滚动事件，判断是否需要将菜单栏固定在顶部
window.addEventListener('scroll', () => {
  isFixed.value = window.scrollY > 64; // 64是菜单栏距离顶部的距离，根据实际情况调整
});

const data = reactive(['', '', '', '', '', '', '', ''])

const handleNav = (name) => {
  router.push({ name: name })
  currentMenu.value = name
}


</script>

<style scoped lang="less">
.menu-wrap {
  margin-top: 64px;
  padding: 20px 0 0;

  .category__list {
    width: 100%;
    margin-bottom: 39px;
    font-size: 0;
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 20px;

    .category__list__item {
      display: inline-block;
      cursor: pointer;
      font-size: 16px;
      line-height: 22px;
      color: #606266;
      text-align: center;
      white-space: nowrap;
    }

    .active {
      color: #0c0d0f;
      font-weight: 500;
      position: relative;
    }

    .active:after {
      position: absolute;
      top: 34px;
      content: " ";
      width: 20px;
      left: 50%;
      transform: translateX(-50%);
      height: 3px;
      background-color: #0c0d0f;
    }

    li {
      list-style: none;
    }
  }

  .category__list:after {
    content: " ";
    display: block;
    height: 1px;
    background-color: rgba(12, 13, 15, .06);
    position: absolute;
    top: 37px;
    left: 0;
    right: 0;
  }

  // 根据 isFixed 的状态设置固定样式
  &.fixed {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: white; /* 可根据需要调整菜单栏背景色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 可根据需要添加阴影效果 */
    z-index: 1000; /* 保证菜单栏在最上层 */
  }
}
</style>
