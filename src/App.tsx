import React, { useEffect, useRef, useState } from 'react';
import { useStoreDispatch, useStore } from "store/hooks";
import type { MenuProps, } from 'antd';
import { Col, ConfigProvider, FloatButton, Layout, Menu, message, Row, Switch, theme } from 'antd';
import { AlertOutlined, GlobalOutlined, ClearOutlined, DeleteOutlined, ReloadOutlined, } from '@ant-design/icons';
import { Outlet, useLocation, } from "react-router-dom";
import i18n from 'services/i18n';

import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

import { change, loadSettings, reset, } from 'store/settings';
import { toggleDark } from 'store/theme';

import "App.scss";

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
const { log, error, } = console

const { Header, Content, Footer, } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;


const App: React.FC = () => {
  const dispatch = useStoreDispatch();
  const { t } = i18n
  const themeSetting = useStore((state) => state.theme);
  const settings = useStore((state) => state.settings);
  const services = useStore((state) => state.services);


  const [current, setCurrent] = useState('signals');
  const mounted = useRef(false);

  const location = useLocation();
  useEffect(() => {
    // do componentDidMount logic
    if (!mounted.current) {
      dispatch(loadSettings()).then((s: any) => {
        if (s && s?.lang) {
          i18n.changeLanguage(s?.lang)
        }
      })
      setCurrent(location.pathname.slice(1))

      mounted.current = true;
    }
  }, []);

  useEffect(() => {
    i18n.changeLanguage(settings?.lang)
  }, [settings?.lang])

  const changeTheme = () => {
    dispatch(toggleDark());
  };

  const onClickMenu: MenuProps['onClick'] = (e) => {
    if (e.key.startsWith("settings")) {
      let [key, value] = e.key.split(":")
      key = key.replace("settings.", "")
      dispatch(change({ [key]: value }))

    } else if (e.key === "clean") {
      services?.altcoinSeason?.cleanData().then((r) => {
        message.success(t("Clean app success"))
        document.location.reload()
      });

    } else if (e.key === "reset") {
      dispatch(reset())
      services?.altcoinSeason?.reset().then((r) => {
        message.success(t("Reset app success"))
        document.location.reload()
      });
    }

    else if (e.key === "theme") { }
    else if (e.key === "reload") { document.location.reload() }

    else {
      setCurrent(e.key);
      document.location.href = "/" + e.key
    }
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
        <div className="logo"></div>
        <Menu onClick={onClickMenu} selectedKeys={[current]} mode="horizontal" items={[
          {
            label: <a href='/' target='_target'></a>,
            key: '',
            icon: <img src='/favicon.ico' style={{ width: "38px" }} />,// <HomeOutlined />,
          },
          {
            label: <a href='/content' target='_target'>content</a>,
            key: 'content',
            icon: <AlertOutlined />,
          },
          {
            label: "",
            key: 'reload',
            icon: <ReloadOutlined />,
          },
          {
            label: t("Clean data"),
            icon: <ClearOutlined />,
            key: 'clean',
          },
          {
            label: t("Reset app"),
            icon: <DeleteOutlined />,
            key: 'reset',
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
            key: 'theme',
          },
        ]} />
      </Header>


      <Content style={{ padding: '10px', color: themeSetting.colorTextBase }}>
        <Outlet />
      </Content>

      <FloatButton.BackTop />
      <Footer style={{ textAlign: 'center' }}>
        <Row justify="center" className='footer-row'>
          <Col>Coin X ©2023 </Col>
          <Col>
            <a className="menu__link" target="_blank" href="https://coinx.trade/about">@coinx99</a> |&nbsp;
            <a className="menu__link" target="_blank" href="https://coinx.trade">coinx.trade</a> </Col>
          <Col>All Rights Reserved</Col>
        </Row>
      </Footer>
    </Layout>
  </ConfigProvider>);
};

export default App;
