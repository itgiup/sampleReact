import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps, MenuTheme } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, ConfigProvider, Layout, Menu, Switch, theme } from 'antd';
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link, } from "react-router-dom";

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

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
    element: <div>Hello world!</div>,
  },
  {
    path: "/check",
    element: <div>check</div>,
  },
]);

const App: React.FC = () => {
  const [theme, setTheme] = useState<MenuTheme>('dark');
  const themeSetting = useAppSelector((state) => state.theme);
  const [current, setCurrent] = useState('mail');

  const changeTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (<ConfigProvider
    theme={{
      algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
    }}>

    <Layout>

      <Header>
        <div className="demo-logo" />
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={[
          {
            label: "Signals",
            key: 'signals',
            icon: <MailOutlined />,
          },
          {
            label: (
              <Switch
                checked={theme === 'dark'}
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




      <Footer style={{ textAlign: 'center' }}>Coin X ©2023 |
        <a className="menu__link" target="_blank" href="https://coinx.trade/about">@coinx99</a> |
        <a className="menu__link" target="_blank" href="https://coinx.trade">coinx.trade</a>
        | All Rights Reserved</Footer>
    </Layout>
  </ConfigProvider>);
};

export default App;