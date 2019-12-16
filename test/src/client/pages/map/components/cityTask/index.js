import React, { useEffect, useState, useContext, useReducer } from 'react';
import echarts from 'echarts';
import { StageContext } from '../..';
import { Axios } from '@utils/tool';
import './index.less';
import mockData from '@mocks/map/getOrgTask';
import getNowFormatDate from '@utils/transformTime'



let myChart;
let cityInterval;

const CityTask = () => {
    const [data, setData] = useState([]);

    // 获取上下文
    const ctx = useContext(StageContext);
    // console.log('ctx',ctx.stageState)

    // 初始化地图
    useEffect(() => {
        myChart = echarts.init(document.getElementById('city-bar'));
    }, [])

    // 数据改变更新地图
    useEffect(() => {
        const option = createOption(data);
        myChart.setOption(option);
    }, [data])

    // 监听数据
    useEffect(() => {
        ajax()
    }, [ctx.stageState]);

    const createOption = (data) => {
        let xdata = [];
        let ydata = [];
        if (!data || data.length === 0) {
            return {};
        }
        data.forEach((item) => {
            xdata.push(item.allnum);
            ydata.push(item.orgname);
        })
        return {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '2%',
                right: '3%',
                bottom: '0',
                top: '0',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value',
                    show: false,
                }

            ],
            yAxis: [
                {
                    type: 'category',
                    data: ydata,
                    inverse:true,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        color: '#fff'
                    },
                    splitLine: {
                        show: false,
                    }
                }
            ],
            series: [
                {
                    name: '任务总数',
                    type: 'bar',
                    barWidth: '60%',
                    data: xdata,
                    barMaxWidth:40,
                    label: {
                        show: true,
                        position: 'right',
                        color: '#008CFF'
                    },
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0, color: '#0050FF' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#00ADFF' // 100% 处的颜色
                        }])
                    }
                }
            ]
        };
    }

    const getData = async () => {
        const time = getNowFormatDate();
        const stagecode = ctx.stageState ? ctx.stageState.stagecode : '1';
        const res = await Axios.post('/track/getOrgTask', { time, stagecode });
        if (!res) {
            console.log('后台请求失败');
            message.error('后台请求失败');
            setData(mockData.data);
        } else {
            setData(res);
        }
    }

    // 发起数据请求
    const ajax = () => {
        clearInterval(cityInterval)
        if (!ctx.stageState) {
            return;
        }
        getData();
        cityInterval = setInterval(async () => {
            getData()
        }, 1000 * 30);
    }

    return (
        <section className="city-container">
            <h2>各地市任务总数</h2>
            <div id="city-bar"></div>
        </section>
    )
}

export default CityTask;