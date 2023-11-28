import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "./store/hooks";
import type { MenuProps, } from 'antd';
import { AlertOutlined, GlobalOutlined, } from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, Switch, theme } from 'antd';
import { createBrowserRouter, RouterProvider, Link, } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

import { toggleDark } from './store/theme';

import "./App.scss";
import { saveSettings } from './store/settings';
dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

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
  const { t } = useTranslation();
  const themeSetting = useAppSelector((state) => state.theme);
  const settings = useAppSelector((state) => state.settings);
  const [current, setCurrent] = useState('mail');

  const changeTheme = (value: boolean) => {
    dispatch(toggleDark());
  };

  const onClick: MenuProps['onClick'] = (e) => {

    if (e.key.startsWith("settings")) {
      const [key, value] = e.key.split(":")
      dispatch(saveSettings({ key, value }))
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
        <div className="demo-logo" />
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
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            ),
            key: 'alipay',
          },
        ]} />
      </Header>


      <Content style={{ padding: '0 50px' }}>
        <RouterProvider router={router} />
      </Content>


      <Footer style={{ textAlign: 'center' }}>Coin X ©2023 &nbsp;|&nbsp;
        <a className="menu__link" target="_blank" href="https://coinx.trade/about">@coinx99</a> &nbsp;|&nbsp;
        <a className="menu__link" target="_blank" href="https://coinx.trade">coinx.trade</a> &nbsp;|&nbsp;
        All Rights Reserved</Footer>
    </Layout>
  </ConfigProvider>);
};

export default App;

function dispatch(arg0: { payload: undefined; type: "theme/toggleDark"; }) {
  throw new Error('Function not implemented.');
}
