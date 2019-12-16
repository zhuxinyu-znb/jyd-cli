import React, { useEffect, useState, useContext } from 'react';
import './index.less';
import { StageContext } from '../..';
import { Axios } from '@utils/tool';
import mockData from '@mocks/map/getTrackCount';
import getNowFormatDate from '@utils/transformTime'

let taskInterval;


const TaskTotal = () => {
    const [data, setData] = useState({
        "allnum": "0",
        "donenum": "0",
        "startednum": "0",
        "nostartednum": "0",
        "doneper": '0%',
        "startedper": '0%',
        "nostartedper": '0%',
        digit: "0",
        tenDigit: "0",
        hunDigit: "0",
    });

    // 获取上下文
    const ctx = useContext(StageContext);

    // 监听阶段变化
    useEffect(() => {
        ajax();
    }, [ctx.stageState]);

    // 计算百分比
    const calculate = (data) => {
        const {
            allnum,
            donenum,
            startednum,
        } = data;
        let doneper,
            startedper,
            nostartedper;
        doneper = Math.round(parseInt(donenum) / parseInt(allnum) * 100);
        startedper = Math.round(parseInt(startednum) / parseInt(allnum) * 100);
        nostartedper = 100 - doneper - startedper;
        return {
            ...data,
            doneper: `${doneper}%`,
            startedper: `${startedper}%`,
            nostartedper: `${nostartedper}%`
        }
    }
    // 计算每位数
    const calculateTotal = (data) => {
        const { allnum } = data;
        const digit = parseInt(allnum % 10).toString(); // 个位数
        const tenDigit = parseInt((allnum % 100) / 10).toString();  // 十位数
        const hunDigit = parseInt((allnum % 1000) / 100).toString(); // 百位数
        return {
            ...data,
            digit,
            tenDigit,
            hunDigit,
        }
    }

    // 获取数据
    const getData = async () => {
        const time = getNowFormatDate();
        const stagecode = ctx.stageState ? ctx.stageState.stagecode : '1';
        const res = await Axios.post('/track/getTrackCount', { time, stagecode });
        if (!res) {
            console.log('后台请求失败');
            message.error('后台请求失败');
            // setData(calculateTotal(calculate(mockData.data)));
        } else {
            setData(calculateTotal(calculate(res)));
        }
    }

    const ajax = () => {
        clearInterval(taskInterval);
        if (!ctx.stageState) {
            return;
        }
        getData();
        taskInterval = setInterval(async () => {
            getData();
        }, 1000 * 30);
    }

    return (
        <section className="task-container">
            <div className="task-title">任务总数</div>
            <div className="task-total-num">
                <div>{data.hunDigit}</div>
                <div>{data.tenDigit}</div>
                <div>{data.digit}</div>

            </div>
            <div className="task-option-container">
                <div className="task-option">
                    <div className="task-option-title">已完成</div>
                    <div>
                        <span className="task-option-num one">{data.donenum}</span>
                        <span className="task-option-per one">{data.doneper}</span>
                    </div>
                </div>
                <div className="task-option">
                    <div className="task-option-title">进行中</div>
                    <div>
                        <span className="task-option-num two">{data.startednum}</span>
                        <span className="task-option-per two">{data.startedper}</span>
                    </div>
                </div>
                <div className="task-option">
                    <div className="task-option-title">未开始</div>
                    <div>
                        <span className="task-option-num three">{data.nostartednum}</span>
                        <span className="task-option-per three">{data.nostartedper}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TaskTotal;