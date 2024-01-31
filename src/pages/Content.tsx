import React, { useEffect, useRef, useState } from 'react';
import { useStoreDispatch, useStore } from "../store/hooks";
import type { MenuProps, } from 'antd';
import { AlertOutlined, GlobalOutlined, } from '@ant-design/icons';
import { } from 'antd';
import i18n from '../services/i18n';



import { change, loadSettings, } from '../store/settings';


const { log, error, warn } = console




type Props = {
    [name: string]: any
}


const Content: React.FC<Props> = () => {
    const dispatch = useStoreDispatch();
    const { t } = i18n
    const settings = useStore((state) => state.settings);
    const mounted = useRef(false);

    useEffect(() => {
        // do componentDidMount logic
        if (!mounted.current) {

        }
        mounted.current = true;
    }, []);


    const onClick: MenuProps['onClick'] = (e) => {

    };

    return (<>
        Content
    </>);
};

export default Content;
