import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from "./store/hooks";
import type { MenuProps, } from 'antd';
import { AlertOutlined, GlobalOutlined, } from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, Switch, theme } from 'antd';
import { createBrowserRouter, RouterProvider, Link, } from "react-router-dom";
import i18n from './i18n';

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

import { toggleDark } from './store/theme';

import "./App.scss";
import { change, loadSettings, } from './store/settings';
import { useTranslation } from 'react-i18next';
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
const { log, error, warn } = console

const { Header, Content, Footer, Sider } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!iIlL</div>,
  },
  {
    path: "/login",
    element: <div>login</div>,
  },
]);









const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = i18n
  const themeSetting = useAppSelector((state) => state.theme);
  const settings = useAppSelector((state) => state.settings);
  const [current, setCurrent] = useState('signals');
  const mounted = useRef(false);

  useEffect(() => {
    // do componentDidMount logic
    if (!mounted.current) {
      dispatch(loadSettings()).then(({ payload }) => {
        if (payload && payload.lang)
          i18n.changeLanguage(payload.lang)
      })
      mounted.current = true;

    } else {
      // do componentDidUpdate logic

    }
  });

  const changeTheme = (value: boolean) => {
    dispatch(toggleDark());
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key.startsWith("settings")) {
      const [key, value] = e.key.split(":")
      dispatch(change({ key: key.replace("settings.", ""), value }))
      // log(settings)
    } else
      setCurrent(e.key);

  };

  return (<ConfigProvider
    theme={{
      algorithm: [
        themeSetting.isDark ? darkAlgorithm : defaultAlgorithm
      ],
      token: {
        colorPrimary: themeSetting.colorPrimary,
        borderRadius: themeSetting.borderRadius,
        colorTextBase: themeSetting.colorTextBase,
        fontFamily: "Consolas, 'Courier New', monospace",
      }
    }}>

    <Layout>

      <Header>
        <div className="logo" />
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={[
          {
            label: "Signals",
            key: 'signals',
            icon: <AlertOutlined />,
          },
          {
            label: t(settings.lang),
            key: 'lang',
            icon: <GlobalOutlined />,
            children: [
              {
                label: 'English',
                key: 'settings.lang:en',
              },
              {
                label: 'Việt Nam',
                key: 'settings.lang:vi',
              },
            ]
          },
          {
            label: (
              <Switch
                checked={themeSetting.isDark}
                onChange={changeTheme}
                checkedChildren="☀️"
                unCheckedChildren="🌙"
              />
            ),
            key: 'alipay',
          },
        ]} />
      </Header>


      <Content style={{ padding: '10px', color: themeSetting.colorTextBase }}>
        <RouterProvider router={router} />
      </Content>


      <Footer style={{ textAlign: 'center' }}>Coin X ©2023 |&nbsp;
        <a className="menu__link" target="_blank" href="https://coinx.trade/about">@coinx99</a> |&nbsp;
        <a className="menu__link" target="_blank" href="https://coinx.trade">coinx.trade</a> |&nbsp;
        All Rights Reserved</Footer>
    </Layout>
  </ConfigProvider>);
};

export default App;

function dispatch(arg0: { payload: undefined; type: "theme/toggleDark"; }) {
  throw new Error('Function not implemented.');
}
