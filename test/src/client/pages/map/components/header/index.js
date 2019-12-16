import React, {useEffect, useState} from 'react';
import './index.less';
import { Axios } from '@utils/tool';


const Header = () => {
    const [title, setTitle] = useState('');
    const ajax = async () => {
        const res = await Axios.post('/track/getExamTask');
        setTitle(res);
    }
    useEffect(() => {
        ajax();
    }, []);
    return <section className="header-container">{title}</section>
}

export default Header;