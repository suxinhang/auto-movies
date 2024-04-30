import { get, post } from '/@/utils/http/axios';
import { UserState } from '/@/store/modules/user/types';
import axios from 'axios';
import {BASE_URL} from "/@/store/constants";

enum URL {
    home = '/api/movie/movies',
    list = '/api/movie/movies',
    detail = '/myapp/vod/detail',
    recommend = '/myapp/vod/recommend'
}

const homeApi = async (params) => {
    const url = `${BASE_URL}${URL.home}?category_id=${params.category_id}`;

    try {
        const response = await axios.get(url);

        return response.data.data.records; // 返回接口响应的数据部分
    } catch (error) {
        console.error('请求接口时出错:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

const listApi = async (params: any) => get<any>({ url: URL.list, params: params, data: {}, headers: {} });
const detailApi = async (params: any) => get<any>({ url: URL.detail, params: params, headers: {} });
const recommendApi = async (params: any) => get<any>({ url: URL.recommend, params: params, headers: {} });

export { homeApi, listApi, detailApi, recommendApi };
