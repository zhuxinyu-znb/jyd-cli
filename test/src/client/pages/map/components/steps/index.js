import React, { useState, useEffect, useContext } from 'react';
import { Steps, Icon } from 'antd';
import { StageContext } from '../..';
import './index.less';
import { Axios } from '@utils/tool';
import mockData from '@mocks/map/getTrackStage';
import getNowFormatDate from '@utils/transformTime'
const { Step } = Steps;



const StepsComp = () => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState([]);

    // 获取上下文
    const ctx = useContext(StageContext);

    // 调用数据请求方法
    useEffect(() => {
        ajax();
    }, []);

    // 创建step组件
    const createSteps = (data) => {
        if (!data || data.length === 0) {
            return null;
        }
        let res = [];
        data.forEach((item, index) => {
            const { status, stagename } = item;
            res.push(<Step key={index} title={stagename} icon={status === 0 ? <Icon type="check-circle" theme="twoTone" /> : null} />)
        })
        return res;
    }

    // 获取当前阶段
    const getStage = (data) => {
        if (!data || data.length === 0) {
            return {
                stagecode: '1',
                index: 0
            };
        }
        let res = {}
        data.forEach((item, index) => {
            if (item.status === '2') {
                res['stagecode'] = item.stagecode;
                res['index'] = index;
            }
        })
        return res;
    }

    // 获取数据
    const getData = async () => {
        const time = getNowFormatDate();
        const res = await Axios.post('/track/getTrackStage', { time });
        if (!res) {
            console.log('后台请求失败');
            message.error('后台请求失败');
            dealData(mockData.data);
        } else {
            dealData(res);
        }
    }

    // 处理数据
    const dealData = (param) => {
        const data = getStage(param);
        ctx.dispatch({
            type: 'STAGE_DATA',
            stagecode: data.stagecode
        })
        setStep(data.index);
        setData(param);

    }
    // 发起数据请求
    const ajax = () => {
        getData();
        setInterval(() => {
            getData();
        }, 1000 * 30)
    }

    return (
        <Steps className="steps-container" labelPlacement="vertical" size="small" current={step}>
            {createSteps(data)}
        </Steps>
    )
}

export default StepsComp;