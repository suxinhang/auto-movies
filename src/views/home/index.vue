<template>
  <div>
<!--    <div class="banner">-->
<!--      &lt;!&ndash; 左侧 &ndash;&gt;-->
<!--      <div class="prev-banner-item">-->
<!--        <img :src="prevCoverImage" />-->
<!--      </div>-->

<!--      &lt;!&ndash; Banner &ndash;&gt;-->
<!--      <div class="banner-container" ref="bannerContainer">-->
<!--        <div class="banner-item" v-for="(movie, index) in tData.hdianying" :key="movie.id" :class="{ active: currentIndex === index }">-->
<!--          <img v-if="movie && movie.cover_image_medium" :src="movie.cover_image_medium" />-->
<!--          <div class="banner-info"></div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 右侧 &ndash;&gt;-->
<!--      <div class="next-banner-item">-->
<!--        <img :src="nextCoverImage" />-->
<!--      </div>-->
<!--    </div>-->
  </div>





    <!-- 最热电视剧 -->
    <div class="header">
      <h3>电视剧</h3>
      <a class="more" href="/dianshiju">更多</a>
    </div>

    <div class="lvideo-list">
      <a class="video-item" :href="handleDetail(item.id)" v-for="item in tData.dsjnew" :key="item.id" @click="handleItemClick(item)">
        <div class="cover-wrap">
          <img :src="item.cover_image_medium" />
          <div class="title">{{ item.name }}</div> <!-- 新增的名称展示 -->
          <div class="remarksdsj">{{ item.video_episode }}</div>
          <div class="meta-wrap">
            <div class="name">{{ item.name }}</div> <!-- 添加影片名字 -->
            <div class="info">{{ item.period }} 更新</div>

          </div>
        </div>
      </a>
    </div>

    <!-- 最热电影 -->
    <div class="header">
      <h3>评分最高</h3>
      <a class="more" href="/dianying">更多</a>
    </div>

    <div class="lvideo-list">
      <a class="video-item" :href="handleDetail(item.id)" v-for="item in tData.hdianying" :key="item.id" @click="handleItemClick(item)">
        <div class="cover-wrap">
          <img :src="item.cover_image_medium" />
          <div class="title">{{ item.name }}</div> <!-- 新增的名称展示 -->
          <div class="remarks">{{ item.score }}</div>
          <div class="meta-wrap">
            <div class="name">{{ item.name }}</div> <!-- 添加影片名字 -->
            <div class="info">{{ item.period }} 更新</div>

          </div>
        </div>
      </a>
    </div>


    <!-- 最新电影 -->
    <div class="header">
      <h3>最新电影</h3>
      <a class="more" href="/dianying">更多</a>
    </div>

    <div class="lvideo-list">

      <a class="video-item" :href="handleDetail(item.id)" v-for="(item) in tData.dianying" :key="item.id" @click="handleItemClick(item)">

        <div class="cover-wrap">
          <img :src="item.cover_image_medium" />

          <div class="title">{{ item.name }}</div> <!-- 新增的名称展示 -->
          <div class="remarks">{{ item.score }}</div>
          <div class="meta-wrap">
            <div class="name">{{ item.name }}</div> <!-- 添加影片名字 -->
            <div class="info">{{ item.period }} 更新</div>

          </div>
        </div>
      </a>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // 导入 axios


let currentIndex = 0;

const tData = ref({
  dianying: [],
  hdianying:[],
  dsjnew:[]
});


const handleDetail = (vod_id) => {
  return '/detail/' + vod_id;
};

onMounted(async () => {
  await Promise.all([
      getMovieData(),
      fetchSecondAPI(),
      dianshijuNewAPI()
      ]);
  startBannerAutoPlay(); // 启动轮播
});

const getMovieData = async () => {
  try {
    const params = {
      page: 1,
      page_size: 8,
      name: "",
      category_id: null,
      sort: 2
    };
    //地址服务开源，跪求大神不要压测
    const res = await axios.get('https://video.lieyuan.cc/api/moviev2/movies', { params });
    tData.value.dianying = res.data.data.records;

  } catch (error) {
    console.error('获取电影数据时出错:', error);
  }
};

const fetchSecondAPI = async () => {
  try {
    const params = {
      page: 1,
      page_size: 6,
      name: "",
      category_id: null,
      sort: 1
    };
    //地址服务开源，跪求大神不要压测
    const res = await axios.get('https://video.lieyuan.cc/api/moviev2/movies', { params });
    tData.value.hdianying = res.data.data.records;
    console.error('re 111',tData.value.hdianying);

  } catch (error) {
    console.error('获取电影数据时出错:', error);
  }
};

const dianshijuNewAPI = async () => {
  try {
    const params = {
      page: 1,
      page_size: 20,
      name: "",
      category_id: null,
      sort: 2
    };
    //地址服务开源，跪求大神不要压测
    const res = await axios.get('https://video.lieyuan.cc/api/videov2/videos', { params });
    tData.value.dsjnew = res.data.data.records;
    console.error('re 111',tData.value.hdianying);

  } catch (error) {
    console.error('获取电影数据时出错:', error);
  }
};

const goToDetailPage = (item) => {

  localStorage.setItem('play_url', item.play_url);  //播放地址
  localStorage.setItem('name',item.name); //影片名称
  localStorage.setItem('director',item.director); //导演
  localStorage.setItem('leading_actor', item.leading_actor); //主演
  localStorage.setItem('details',item.details); //内筒详情
  localStorage.setItem('duration',item.duration); //影片时长
  localStorage.setItem('score',item.score); //评分
  localStorage.setItem('type',item.type); //类型 1-电影 2-电视剧
  localStorage.setItem('classification',"首页资源未区分"); //埋点上报分类

};

const handleItemClick = (item) => {
  console.log('re 222',item);
  goToDetailPage(item); // 调用进一步处理点击事件的函数
};

const bannerContainer = ref(null); // 将变量定义移至脚本顶部，确保全局可用
const startBannerAutoPlay = () => {
  if (bannerContainer.value) {
    setInterval(() => {
      const totalItems = tData.hdianying.length;
      currentIndex = (currentIndex + 1) % totalItems;
    }, 3000);
  }
};
const prevCoverImage = computed(() => {
  if (tData.hdianying && tData.hdianying.length > 0) {
    const prevIndex = (currentIndex === 0) ? tData.hdianying.length - 1 : currentIndex - 1;
    return tData.hdianying[prevIndex].cover_image_medium;
  }
  console.error('eeee')
  return '';
});

const nextCoverImage = computed(() => {
  if (tData.hdianying && tData.hdianying.length > 0) {
    const nextIndex = (currentIndex === tData.hdianying.length - 1) ? 0 : currentIndex + 1;
    return tData.hdianying[nextIndex].cover_image_medium;
  }
  return '';
});





</script>

<style scoped lang="less">
.banner {
  position: relative;
  overflow: hidden; /* 隐藏溢出部分 */
}

.banner-container {
  display: flex; /* 将子元素排列为一行 */
  justify-content: center; /* 子元素水平居中 */
}

.banner-item {
  flex-shrink: 0;
}

.banner-item img {

  width: 800px;
  height: 400px;
}

/* 左侧和右侧显示上一张和下一张图片的样式 */
.prev-banner-item,
.next-banner-item {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%; /* 与轮播图片宽度一半相同 */
  overflow: hidden; /* 隐藏溢出部分 */
}

.prev-banner-item img,
.next-banner-item img {
  width: 450px; /* 轮播图片宽度的一半 */
  height: 400px; /* 与轮播图片高度相同 */
  object-fit: cover; /* 裁剪图片以适应容器 */
}

.prev-banner-item {
  left: 0;
}

.next-banner-item {
  right: 0;
}

@media screen and (min-width: 1px) and (max-width: 768px) {
  .video-item {
    width: calc((100% - 2 * 16px) / 3 ) !important; /* 在移动设备上，每行显示两个视频项 */
  }

  .title {

    white-space: nowrap !important;
    font-size: 12px; /* 调整标题字体大小 */
    padding: 3px; /* 调整标题的内边距 */
    white-space: nowrap; /* 只显示一行 */
    overflow: hidden; /* 溢出部分隐藏 */
    text-overflow: ellipsis; /* 溢出部分以省略号显示 */
  }

  .cover-wrap {
    height: 100%; /* 在移动设备上撑满父容器高度 */
  }

  .remarks {
    bottom: 10px; /* 调整备注位置 */
  }
}

/* 原来的样式 */
.header {
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
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
  .video-item {
    width: calc((100% - 3 * 16px) / 4 );
    aspect-ratio: 3/5;
    min-height: 90px;
    .cover-wrap {//剩余部分展示名称
      position: relative;
      width: 100%;
      height: 95%;
      overflow: hidden;
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
      .remarksdsj {
        position: absolute;
        right: 1px;
        bottom: 30px;
        color: #ffffff;
        font-size: 14px;
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
      white-space: nowrap; /* 只显示一行 */
      overflow: hidden; /* 溢出部分隐藏 */
      text-overflow: ellipsis; /* 溢出部分以省略号显示 */
      position: absolute;
      bottom: -1px; /* 距离图片底部3px */
      left: 0; /* 水平居中 */
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
}


</style>
