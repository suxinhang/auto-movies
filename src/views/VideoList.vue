<template>
  <div>
    <div class="header">
      <h3>{{ title }}</h3>
      <a class="more" href="/dianying">更多</a>
    </div>
    <div class="lvideo-list">
      <a class="video-item" :href="handleDetail(item.id)" v-for="item in data" :key="item.id" @click="handleItemClick(item)">
        <div class="cover-wrap">
          <img :src="item.cover_image_medium" />
          <div class="title">{{ item.name }}</div>
          <div class="remarks">{{ item.score }}</div>
          <div class="meta-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="info">{{ item.period }} 更新</div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  data: Array
});

const handleDetail = (vod_id) => `/detail/${vod_id}`;

const handleItemClick = (item) => {
  console.log('点击了:', item);
  // 处理点击事件
};

</script>

<style scoped>
.header {
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
h3 {
  line-height: 30px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0;
}
.more {
  cursor: pointer;
}
}

.lvideo-list {
  min-height: 160px;
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.video-item {
  width: calc((100% - 3 * 16px) / 4 );
  aspect-ratio: 3/5;
  min-height: 90px;
  position: relative;

.cover-wrap {
  width: 100%;
  height: 95%;
  overflow: hidden;
  position: relative;

img {
  border-radius: 6px;
  overflow: hidden;
  background-color: #e6f2f5;
  width: 100%;
  height: 100%;
  background-size: cover;
  object-fit: cover;
  transition: transform 0.7s ease-in-out;
}

.remarks {
  position: absolute;
  right: 3px;
  bottom: 30px;
  color: #ff9933;
  font-size: 20px;
}
}

.meta-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

.title, .info, .name {
  color: #ffffff;
}

.name {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}
}

.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  padding: 3px;
  box-sizing: border-box;
  font-size: 14px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
}

&:hover .cover-wrap img {
   transform: scale(1.1);
 }

&:hover .meta-wrap {
   opacity: 1;
 }
}
</style>
