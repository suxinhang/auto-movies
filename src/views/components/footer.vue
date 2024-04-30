<template>
  <div class="footer-view">
    <div class="foot-link-box flex-view">
<!--      <a href="/" class="foot-link" target="_blank">在线留言</a>-->
<!--      <div class="link-split"></div>-->
<!--      <a href="/" class="foot-link" target="_blank">排行榜</a>-->
<!--      <div class="link-split"></div>-->
<!--      <a href="/" class="foot-link" target="_blank">网站地图</a>-->
    </div>
    <div class="footer-infos">
      <span>
        <a style="color: #828a92;padding: 0 20px;">免责声明：数据均来自三方平台，请移步观看正版；本站收录视频如有侵权，请联系 apehunting2023@163.com  (以回复为准)</a>
      </span>
    </div>
    <div class="address">2024-2025 © 毛驴追剧 · All Rights Reserved</div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="less">
.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.footer-view {
  width: 100%;
  margin: 0 auto;
  padding: 24px 0 20px 0px;
  background-color: #2a2a32;

  .foot-link-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    margin: 24px auto 16px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;

    .foot-link {
      font-size: 12px;
      margin: 0 16px;
      color: #fff;
    }

    .link-split {
      display: inline-block;
      width: 1px;
      height: 13.5px;
      background-color: #828a92;
    }

    a {
      background-color: transparent;
      text-decoration: none;
      color: #fff;
    }
  }

  .footer-infos {
    font-size: 12px;
    color: #828a92;
    margin-top: 16px;
    text-align: center;
  }

  .address {
    text-align: center;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #828a92;
    margin-top: 8px;
  }
}
</style>
