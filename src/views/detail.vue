<template>
  <main class="detail">
    <Header/>

    <div class="containervideo">
      <div class="video-placeholder" v-if="!videoLoaded">
        <!-- 黑色背景 -->
      </div>
      <div class="video-player" v-if="videoLoaded">
        <!-- 视频播放器 -->
        <iframe ref="videoIframe" frameborder="0" allowfullscreen :src="finalVideoUrl"
                style="width: 100%; height: 100%;"></iframe>
      </div>
    </div>

    <div class="container">

      <section class="meta-wrap">
        <article v-if="tData.dianshijujiData && tData.dianshijujiData.length > 0" class="section-content">

          <div>
            <h3 class="section-heading">
              <span class="line"></span> <!-- Red vertical line -->
              选集 <span class="scrolling-text">{{ noad }}</span>
              <span style="font-size: smaller;">{{ name }}</span>
            </h3>

            <div class="p-list">
              <div class="p-item" :class="{ active: currentLink === item.id }" v-for="item in tData.dianshijujiData"
                   :key="item.id" @click="startPlay(item.play_url, item.id)">
                <span class="item-number">{{ item.number }}</span>
              </div>
            </div>
          </div>
        </article>

        <div class="section-content">
          <div>
            <h3 class="section-heading">
              <span class="line"></span> <!-- Red vertical line -->
              当前播放：<span style="font-size: smaller;">{{ getCurrentName() }}</span>
            </h3>
            <div class="infosys">
              <img :src="getCurrentcover_image()">
              <div class="info-text">
                <p v-if="getCurrentdircategories()"><strong>| </strong><span>{{ getCurrentcover_video_episode() }}</span></p>
                <p v-if="getCurrentdircategories()"><strong>| </strong><span>{{ getCurrentdircategories() }}</span></p>
                <p v-if="getCurrentLeadingActor()"><strong>| </strong><span>{{ getCurrentLeadingActor() }}</span></p>
                <p v-if="getCurrentdirector()"><strong>| </strong><span>{{ getCurrentdirector() }}</span></p>

              </div>
            </div>
          </div>
        </div>

          <div>
            <h3 class="section-heading">
              <span class="line"></span> <!-- Red vertical line -->
              内容详情
            </h3>
            <p>{{ getCurrentdetails() }}</p>
          </div>

          <div>
            <h3 class="section-heading">
              <span class="line"></span> <!-- Red vertical line -->
              为你推荐
            </h3>
            <!-- Add your recommendation content here -->
          </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';
import Header from '/@/views/components/header.vue';
import axios from 'axios';

let finalVideoUrlBase = "https://jx.xmflv.com/?url=";
let storedFinalVideoUrl = ref("");
let noad = ref("请勿点击视频中的广告");
let currentLink = ref('');
let videoLoaded = ref(true);
let vodId = ref('');
let finalVideoUrl = ref(finalVideoUrlBase);
let tData = ref({
  detailData: {},
  playData: [],
  recommendData: [],
  dianshijujiData: [],
  dianshijujiDatainfo: []
});
const route = useRoute();
const handleLoad = () => {
  videoLoaded.value = true;
};

const startPlay = (playUrl: string, id: string) => {
  finalVideoUrl.value = finalVideoUrlBase + playUrl;
  console.error('debug123', finalVideoUrl.value);
  videoLoaded.value = true;
  currentLink.value = id;
};

onMounted(async () => {

  if (route.params && route.params.id) {
    vodId.value = route.params.id;
  }
  // Fetch data
  getData();

  // Fetch recommendation data
  // await getTuiJianData();

  // Fetch movie data
  console.log('reurl2 ', types)
  if (types === '2') {
    await getjj();
  }
  console.log('reurl2 ', types)
  if (types === '1') {
    await getdy();
  }


  // Push data
  // await pushMD();
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('load', handleLoad);
  }
});

const getData = () => {
  storedFinalVideoUrl.value = localStorage.getItem('play_url') || "";
  finalVideoUrl.value += storedFinalVideoUrl.value;
  // name = localStorage.getItem('name');
  // daoyan = localStorage.getItem('director');
  // zhuyan = localStorage.getItem('leading_actor');
  // xiangqing = localStorage.getItem('details');
  // shichang = localStorage.getItem('duration');
  types = localStorage.getItem('type');
  classification = localStorage.getItem('classification');
  console.log('reurl1 ', types);
};

const getTuiJianData = async () => {
  try {
    const params = {
      page: 1,
      page_size: 20,
      name: "",
      category_id: 7,
      sort: ""
    };

    const res = await axios.get('https://video.lieyuan.cc/api/moviev2/movies', {params});
    tData.value.recommendData = res.data.data.records;
    console.error(' debug  返回 :', tData.value.recommendData);
  } catch (error) {
    console.error('获取电影数据时出错:', error);
  }
};

const pushMD = async () => {
  try {
    const data = {
      userID: "mlys",
      event: classification,
      time: Date.now(),
      other: JSON.stringify({classification, name})
    };

    await axios.post('https://s.lieyuan.cc/api/info/track', data);
  } catch (error) {
    console.error('上报错误:', error);
  }
};
const getjj = async () => {
  try {
    const params = {
      id: vodId.value
    };

    const res = await axios.get('https://video.lieyuan.cc/api/videov2/getEpisodeList', {params});
    tData.value.dianshijujiData = res.data.data.video_episode;
    tData.value.dianshijujiDatainfo = res.data.data.info;
    console.error('获取电影数据时出错:', res.data.data.info);
  } catch (error) {
    console.error('获取电影数据时出错:', error);
  }
};
//
const getdy = async () => {
  try {
    const params = {
      id: vodId.value
    };

    const res = await axios.get('https://video.lieyuan.cc/api/moviev2/info', {params});
    tData.value.dianshijujiDatainfo = [res.data.data];
    console.error('获取电影数据时出错:', [res.data.data]);
  } catch (error) {
    console.error('获取电影数据时出错:', error);

  }
};

const getCurrentName = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].name;
  }
  return "";
};
//主演
const getCurrentLeadingActor = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].leading_actor;
  }
  return "";
};
//类型
const getCurrentdircategories = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].categories;
  }
  return "";
};
//导演
const getCurrentdirector = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].director;
  }
  return "";
};
//内容详情
const getCurrentdetails = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].details;
  }
  return "";
};
//图片
const getCurrentcover_image = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].cover_image;
  }
  return "";
};

//更新
const getCurrentcover_video_episode = () => {
  if (tData.value.dianshijujiDatainfo.length > 0) {
    return tData.value.dianshijujiDatainfo[0].video_episode;
  }
  return "";
};


let types = ref("");
let classification = ref("");






</script>

<style scoped lang="less">
.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media screen and (min-width: 769px) {
  .container {
    display: flex;
    flex-direction: column;
    //align-items: center;
    max-width: 100%;
    width: 60%;
    padding-left: auto; /* 左侧留白 */
    padding-right: auto; /* 右侧留白 */
  }

  .containervideo {
    max-width: calc(100% - 50px); /* 减去左右留白的总和 */
    width: 60%;
    margin-left: auto; /* 自动左侧留白 */
    margin-right: auto; /* 自动右侧留白 */
  }
  .video-placeholder, .video-player {
    margin-top: 65px;
    background-color: black;
    width: 100%;
    height: 550px; /* 设置默认高度 */
  }
}


.video-placeholder, .video-player {
  margin-top: 65px;
  background-color: black;
  width: 100%;
  height: 550px; /* 设置默认高度 */
}


.content-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.meta-wrapmeta-wrapmeta-wrap {
  display: flex;
  flex-direction: column;
  //align-items: center; /* 垂直居中对齐 */
  margin-top: 18px; /* 距离顶部 10px */
}


.title {
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  margin-bottom: 20px; /* Reduced margin for better spacing */
  align-self: center; /* 水平居中 */
}


.section-heading {
  height: 40px;
  border-bottom: 2px solid rgba(2, 0, 0, 0.04);
  margin-top: 8px;
  position: relative; /* Added */
}

.section-heading .line {
  position: absolute;
  left: -15px; /* Adjust as needed */
  top: 50%;
  transform: translateY(-50%);
  width: 4px; /* Adjust line width */
  height: 100%;
  background-color: red; /* Red color */
}

.section-recommend {
  margin-top: 20px; /* Add margin-top for better separation */
}

.p-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.p-item {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #ccc; /* 添加外边框 */
  justify-content: center;
  flex-basis: calc((100% - 6 * 10px) / 11); /* 调整每个项目的宽度，减去间距的宽度 */
  padding: 10px;
  margin-right: 10px; /* 项目之间的间距 */
  margin-bottom: 8px; /* 行之间的间距 */
  /* 添加背景色条件 */
  background-color: rgba(0, 0, 0, 0.1);
}

/* 当前选中的剧集 */
.p-item.active {
  background-color: rgba(255, 255, 255, 1); /* 当前选中的剧集背景色为白色 */
}

/* 在样式中定义从下向上滚动文本的样式 */
.scrolling-text {
  color: red; /* 设置文本颜色 */
  animation: scroll 1s linear infinite; /* 定义滚动动画 */
}

@keyframes scroll {
  0% {
    transform: translateY(100%);
  }
  /* 初始位置：文本位于容器下方 */
  100% {
    transform: translateY(0);
  }
  /* 滚动结束位置：文本位于容器顶部 */
}


.video-item {
  width: calc((100% - 3 * 16px) / 6);
  aspect-ratio: 3/5;
  min-height: 120px;

  .cover-wrap {
    position: relative;
    width: 100%;
    height: 85%;

    img {
      border-radius: 4px;
      overflow: hidden;
      // todo 修改默认图
      background-color: #e6f2f5;
      width: 100%;
      height: 100%;
      background-size: cover;
      object-fit: cover;
    }

    .remarks {
      position: absolute;
      right: 4px;
      bottom: 1px;
      color: #fff;
      font-size: 12px;
    }
  }

}


.section-content {

  margin-bottom: 10px;
  margin-left: 10px;
}

.infosys {
  display: flex;
  align-items: flex-start; /* 使得导演和主演信息各占一行 */
}

.infosys img {
  border-radius: 4px; /* 添加圆角 */
  width: 80px;
  height: 120px;
  margin-right: 20px; /* 调整图片和文字之间的间距 */
}

.info-text p {
  margin: 0; /* 清除段落默认的上下外边距 */
}


@media screen and (max-width: 768px) {
  .video-placeholder, .video-player {
    margin-left: 0px;
    margin-top: 60px;
    width: 100%;
    height: 300px;
  }

  .p-list {
    /* 修改为水平排列 */
    display: flex;
    flex-wrap: nowrap; /* 防止剧集项目换行 */
    overflow-x: auto; /* 横向滚动 */
    padding-bottom: 10px; /* 底部留白 */
    margin-bottom: -8px; /* 取消底部间距 */
  }

  .p-item {
    flex: 0 0 auto;
    margin-right: 10px;
    margin-bottom: 0px;
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc; /* 添加外边框 */
    border-radius: 4px; /* 圆角边框 */
    padding: 8px; /* 调整内边距 */
    flex-basis: calc((100% - 6 * 10px) / 8); /* 计算每个项目的宽度，使它们等宽 */
  }

  .container {
    display: flex;
    flex-direction: column;
    max-width: 40%;
    max-width: 100%;
    width: 100%;
    padding-left: 5px;
    padding-right: 2px;
  }

  .containervideo {
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
  }
}


</style>
