<template>
  <div class="layout-content">

    <div class="category-layout">

      <div class="category__line">
        <li class="category__first-ele">类型</li>
        <ul class="category__list category__sub">
          <li
              class="category__list__item category__sub__item"
              :class="{ 'active': currentClass === item.name }"
              @click="handleClickClass(item.name)"
              v-for="item in categoryData.vodClassData"
              :key="item.id"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="category__line">
        <li class="category__first-ele">地区</li>
        <ul class="category__list category__sub">
          <li
              class="category__list__item category__sub__item"
              :class="{ 'active': currentArea === item.name }"
              @click="handleClickArea(item.name)"
              v-for="item in categoryData.vodAreaData"
              :key="item.id"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>



      <!--      <div class="category__line">-->
      <!--        <li class="category__first-ele">语种</li>-->
      <!--        <ul class="category__list category__sub">-->
      <!--          <li class="category__list__item category__sub__item" :class="currentlanguage === item.id ? 'active' : ''"-->
      <!--              @click="handleClicklanguage(item.id)"-->
      <!--              v-for="item in categoryData.vodlanguageData">{{ item.name }}-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->


      <!--      <div class="category__line">-->
      <!--        <li class="category__first-ele">年份</li>-->
      <!--        <ul class="category__list category__sub">-->
      <!--          <li class="category__list__item category__sub__item" :class="currentYear===item? 'active':''"-->
      <!--              @click="handleClickYear(item)"-->
      <!--              v-for="item in categoryData.vodYearData">{{ item }}-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->

    </div>

    <!-- 展示影片列表 -->
    <div class="lvideo-list" >
      <a class="video-item" :href="handleDetail(item.id)" v-for="item in tData.vodData" :key="item.id"  @click="handleItemClick(item)">

        <div class="cover-wrap">
          <img :src="item.cover_image_medium"/>
          <span class="remarks">{{ item.name }}</span>
        </div>
        <div class="meta-wrap">
          <div class="title">{{ item.name }}</div>
          <div class="info">{{ item.period }} 更新</div>
        </div>
      </a>
    </div>

  </div>

</template>
<script setup>
import axios from 'axios';

const debounceDelay = 500; // 设置延迟时间，单位为毫秒
let debounceTimer = null; // 声明一个延迟器的计时器变量
const currentClass = ref([])
const currentArea = ref([])
const currentlanguage = ref([])
const currentYear = ref('全部')



const vodlanguageData = ref([]);
const vodAreaData = ref([]);


// 定义一个 ref 来存储分类数据
const vodClassData = ref([]);


const handleDetail = (vod_id) => {
  return '/detail/' + vod_id;
};


const handleItemClick = (item) => {
  goToDetailPage(item); // 调用进一步处理点击事件的函数
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
  localStorage.setItem('classification',"电影"); //埋点上报分类
};

// 从接口获取分类数据的函数
const fetchVodClassData = async () => {
  try {
    const response = await axios.get('https://video.lieyuan.cc/api/moviev2/catrgories');

    const data = response.data.data;
    vodClassData.value = data.类型;
    vodAreaData.value = data.地区;
    vodlanguageData.value = data.language;

  } catch (error) {
    console.error('获取分类数据失败:', error);
  }
};


// 在组件挂载时获取分类数据
onMounted(() => {
  fetchVodClassData();
});


const categoryData = reactive({
  vodClassData,
  vodAreaData,
  // vodYearData,
  vodlanguageData,
})

const tData = reactive({
  vodData: []
})

const handleClickClass = (item) => {
  console.error('debug111',item)
  currentClass.value = item
  tData.vodData = [] // 清空已有数据
  getData(item)
}
const handleClickArea = (item) => {
  currentArea.value = item
  tData.vodData = [] // 清空已有数据
  getData(item)
}


const handleClicklanguage = (item) => {
  currentlanguage.value = item
  tData.vodData = [] // 清空已有数据
  getData(item)
}


const handleClickYear = (item) => {
  currentYear.value = item
  tData.vodData = [] // 清空已有数据
  getData(item)
}

onMounted(() => {
  getData()
})


const getData = function (categoryID) {
  const filterDict = {
    name: '',
    categories: categoryID,
    sort: null,
    page: tData.vodData.length / 20 + 1,
    page_size: 20,
  };

  axios.get('https://video.lieyuan.cc/api/moviev2/movies', {
    params: filterDict
  })
      .then(response => {
        tData.vodData.push(...response.data.data.records);
      })
      .catch(error => {
        console.error('请求出错：', error);
      });
};


const handleScroll = () => {
  clearTimeout(debounceTimer); // 每次滚动时清除之前的计时器

  debounceTimer = setTimeout(() => { // 创建新的计时器
    const scrollTop = window.scrollY; // 滚动的垂直距离
    const windowHeight = window.innerHeight; // 前视口的高度
    const documentHeight = document.documentElement.scrollHeight; // 整个文档的高度
    const scrollBottom = documentHeight - scrollTop - windowHeight; // 计算底部距离

    // 当滚动到页面底部时加载更多数据
    if (scrollBottom <= 555) { // 判断是否已经到达或超过底部
      getData(); // 触发加载更多数据
    }
  }, debounceDelay);
};

// 监听滚动事件
window.addEventListener('scroll', handleScroll);

// 添加滚动事件监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});


</script>

<style scoped lang="less">

@media screen and (min-width: 1px) and (max-width: 768px) {
  .video-item {
    width: calc((100% - 2 * 16px) / 3) !important;
  }

  .category__list {
    white-space: nowrap !important;
    overflow-x: auto !important;
  }
}


.layout-content {
  width: 100%;
  padding: 1px 0px;

  .category-layout {
    .category__line {
      display: flex;
      font-size: 14px;

      .category__first-ele {
        line-height: 32px;
        height: 32px;
        flex-shrink: 0;
        padding-right: 12px;
        border-radius: 2px;
      }

      li {
        list-style: none;
      }

      .category__sub {
        line-height: normal;
        margin-bottom: 12px;
      }

      .category__list {
        font-size: 0;
        position: relative;


        .category__list__item {
          display: inline-block;
          cursor: pointer;
          font-size: 16px;
          line-height: 22px;
          color: #606266;
        }

        .category__sub__item {
          font-size: 14px;
          line-height: 32px;
          margin-bottom: 2px;
          color: #0c0d0f;
          padding: 0 8px;
          border-radius: 2px;
        }

        .active {
          background-color: rgba(0, 0, 0, 0.04);
          color: #fe3355;
          font-weight: 500;
        }
      }

      .category__list::-webkit-scrollbar {
        display: none;
      }
    }
  }


  .lvideo-list {
    min-height: 200px;
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .video-item {
      width: calc((100% - 3 * 16px) / 4);
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
          background: url(../images/load.gif) no-repeat;
          // background-color: #e6f2f5;
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

      .meta-wrap {
        .title {
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .info {
          display: none;
        }

      }

    }
  }

  .page-wrap {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

    .page-item {
      user-select: none;
      cursor: pointer;
      padding: 0 16px;
      height: 30px;
      line-height: 30px;
      border-radius: 4px;
      background-color: #eee;
      color: #000;
      font-size: 12px;
      text-align: center;
    }

    .disable {
      color: grey;
    }
  }

}
</style>
