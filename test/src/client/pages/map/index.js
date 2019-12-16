import React, { useEffect, useReducer, useState } from 'react';
import MapApi from '@utils/mapAPI';
import { Axios } from '@utils/tool';
import './style.less';
import Header from './components/header';
import TaskTotal from './components/taskTotal';
import CityTask from './components/cityTask';
import StepsComp from './components/steps';
import mockData from '@mocks/map/getTrackInfo'
import stageReducer from '@models/stageReducer';
import getNowFormatDate from '@utils/transformTime'
import echarts from 'echarts';
import AMap from 'AMap';
require('echarts-amap');


let myChart;
const gdMap = new MapApi();
let mapInterval;
let map, layer;
// 定义不同状态的线颜色
const colorMap = {
    '1': '#1DBF60',
    '2': '#F5A623',
    '3': '#F8E71C',
    '4': '#F5A623',
};

export const StageContext = React.createContext(null);

const Map = () => {
    const [data, setData] = useState([]);
    const [stageState, stageDispatch] = useReducer(stageReducer);

    useEffect(() => {
        const mapConfig = {
            boxID: 'map',
            mapStyle: 'amap://styles/d84ecc4a9bf4156edce587e9b88e6e40',
            resizeEnable: true, // 是否监控地图容器尺寸变化
            zoom: 8, // 设置当前地图级别
        };
        let initMap = gdMap.init(mapConfig);

        myChart = echarts.init(document.getElementById('map'));
        myChart.setOption({
            amap: {
                maxPitch: 60,
                pitch: 10, //45 俯仰角
                viewMode: '3D',
                zoom: 8,
                expandZoomRange: true,
                zooms: [3, 20],
                mapStyle: 'amap://styles/d84ecc4a9bf4156edce587e9b88e6e40', //地图主题
                center: [119.775565, 36.42862], //中心点
                rotation: 0,  //顺时针旋转角度
                resizeEnable: true,
            },
            tooltip: {
                show: true,
                trigger: 'item',
                padding: [15, 25],
                backgroundColor: 'rgb(31,37,44)',
                borderColor: 'rgb(63,64,72)',
                borderWidth: 2,
                borderRadius: 3,
                formatter: (params, ticket, callback) => {
                    const { seriesName, data } = params;
                    const r = `<p class="echarts-map-tool-p">${seriesName}</p><p>起点：${data.fromName}</p><p>终点：${data.toName}</p>`
                    let res = `${seriesName}<br/>起点：${data.fromName}<br/>终点：${data.toName}`
                    return r;
                }
            },
            animation: false,
            series: []
        });
        map = myChart.getModel().getComponent('amap').getAMap();
        layer = myChart.getModel().getComponent('amap').getLayer();

        /* AMap.plugin(["AMap.ControlBar"], function () {
            let bar = new AMap.ControlBar();
            map.addControl(bar);
        }) */

        /*  AMap.plugin(["AMap.ToolBar"], function () {
             map.addControl(new AMap.ToolBar());
         }); */

        /* AMap.event.addListener(map, 'zoomend', function () {
            console.log('当前缩放级别：' + map.getZoom());
            console.log('俯视视角' + map.getPitch());
            console.log('俯视视角' + map.getPitch());
        }); */


    }, [])

    useEffect(() => {
        transformData(data);
    }, [data])

    useEffect(() => {
        ajax();
    }, [stageState])

    // 轮询请求
    const ajax = () => {
        clearInterval(mapInterval);
        if (!stageState) {
            return;
        }
        getData();
        mapInterval = setInterval(async () => {
            getData();
        }, 1000 * 30);
    }

    // 获取数据
    const getData = async () => {
        const time = getNowFormatDate();
        const stagecode = stageState ? stageState.stagecode : '1';
        const res = await Axios.post('/track/getTrackInfo', { time, stagecode });
        if (!res) {
            message.error('后台请求失败');
            console.log('后台请求失败');
            setData(mockData.data);
        } else {
            setData(res);
        }
    }

    // 将获取的数据插入到地图中
    const test = (transData) => {
        const series = makeSeries(transData);
        myChart.setOption({
            series: series
        });

        //下面是确保高德地图渲染的时候，echarts同时也需要再次渲染一次，保持位置的同步
        // layer.render = function () {
        //     // let series = myChart.getOption().seriesIndexes;
        //     // myChart.setOption({
        //     //     series: []
        //     // });
        //     myChart.setOption({
        //         series: series
        //     });
        //     /* 
        //                 console.log('当前缩放级别：' + map.getZoom());
        //                 console.log('俯视视角：' + map.getPitch());
        //                 console.log('顺时针：' + map.getRotation()); */
        // }
    }

    const transformData = (data) => {
        if (!data || data.length === 0) {
            return [];
        }
        let res = [];
        AMap.plugin('AMap.Geocoder', () => {
            var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: '中国'
            })
            let a = 0;
            for (let i = 0; i < data.length; i++) {
                const {
                    tracktaskid,
                    tracktaskname,
                    qddz,
                    zddz,
                    qdlng,
                    qdlat,
                    zdlng,
                    zdlat,
                    orgcode,
                    status,
                    escortname,
                    carnumber
                } = data[i];
                let start, end;
                if (!qdlng || !qdlat || qdlng === '0.0' || qdlat === '0.0' || !zdlng || !zdlat || zdlng === '0.0' || zdlat === '0.0') {
                    geocoder.getLocation([qddz, zddz], function (state, result) {
                        if (state === 'complete' && result.info === 'OK') {
                            // result中对应详细地理坐标信息
                            if (result.geocodes[0] && result.geocodes[1]) {
                                a++;
                                start = [result.geocodes[0].location.lng, result.geocodes[0].location.lat];
                                end = [result.geocodes[1].location.lng, result.geocodes[1].location.lat];
                                res.push({
                                    tracktaskid,
                                    tracktaskname,
                                    orgcode,
                                    status,
                                    qddz,
                                    zddz,
                                    escortname,
                                    carnumber,
                                    path: [start, end]
                                })
                                if (res.length === data.length) {
                                    console.log(res)
                                    console.log(a)
                                    test(res);
                                }
                            } else {
                                res.push({
                                    tracktaskid,
                                    tracktaskname,
                                    orgcode,
                                    status,
                                    qddz,
                                    zddz,
                                    escortname,
                                    carnumber,
                                    path: [['0.0', '0.0'], ['0.0', '0.0']]
                                })
                                message.warn(`${tracktaskname}任务地址有误，请查询`)
                                console.warn(`${tracktaskname}任务地址有误，请查询`);
                            }
                        } else {
                            message.warn(`高德拒绝了服务`)
                            console.warn('高德拒绝了服务')
                        }
                    })
                } else {
                    start = [qdlng, qdlat];
                    end = [zdlng, zdlat];
                    res.push({
                        tracktaskid,
                        tracktaskname,
                        orgcode,
                        status,
                        qddz,
                        zddz,
                        escortname,
                        carnumber,
                        path: [start, end]
                    })
                    if (res.length === data.length) {
                        console.log(a)
                        test(res);
                    }
                }
            }
        })
    }

    // 批量生成路线
    const makeSeries = (data) => {
        if (!data || data.length === 0) {
            return null;
        }
        let series = [];
        data.forEach((item, index) => {
            const { tracktaskname, qddz, zddz, path, status } = item;
            series.push({
                "name": tracktaskname,
                "coordinateSystem": "amap",
                "type": "lines",
                "zlevel": 1,
                "effect": {
                    "show": true,
                    "period": 6,
                    "trailLength": 0.7,
                    "color": "#fff",
                    "symbolSize": 3
                },
                "lineStyle": {
                    "normal": {
                        "color": colorMap[status],
                        "width": 0,
                        "curveness": 0.2
                    }
                },
                large: true,
                "data": [
                    {
                        "fromName": qddz,
                        "toName": zddz,
                        "coords": path,
                    }
                ]
            },
                {
                    "name": tracktaskname,
                    "coordinateSystem": "amap",
                    "type": "lines",
                    "zlevel": 2,
                    "symbol": [
                        "none",
                        "circle"
                    ],
                    large: true,
                    "symbolSize": 10,
                    "lineStyle": {
                        "normal": {
                            "color": colorMap[status],
                            "width": 2,
                            "opacity": 0.6,
                            "curveness": 0.2
                        }
                    },
                    "data": [
                        {
                            "fromName": qddz,
                            "toName": zddz,
                            "coords": path,
                        }
                    ]
                },
                // 画起终点的圆
                {
                    "name": tracktaskname,
                    "type": "effectScatter",
                    "coordinateSystem": "amap",
                    "zlevel": 2,
                    large: true,
                    "rippleEffect": {
                        "brushType": "stroke"
                    },
                    "label": {
                        "normal": {
                            "show": true,
                            "position": "bottom",
                            "formatter": "{b}"
                        }
                    },
                    "itemStyle": {
                        "normal": {
                            "color": "#rgb(248,232,41)"
                        }
                    },
                    "data": [
                        {
                            "fromName": qddz,
                            "toName": zddz,
                            "value": path[0]
                        },
                        {
                            "fromName": qddz,
                            "toName": zddz,
                            "value": path[1],
                        }
                    ]
                });
        });
        return series;
    }

    return (
        <StageContext.Provider value={{ stageState, dispatch: stageDispatch }}>
            <div id="map" />
            <Header />
            <TaskTotal />
            <CityTask />
            <StepsComp />
        </StageContext.Provider>
    );
}
export default Map
