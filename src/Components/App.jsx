import { createRoot } from 'react-dom/client';
import React from 'react';
import { useEffect } from 'react';
import GlobalStore from '../GlobalStore/GlobalStore';
import { Layout, Tabs, ConfigProvider, Spin, Button } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import 'antd/dist/antd.css';
import { ApiFetch } from '../Helpers/Helpers';
import { GlobalStyle } from '../Styles/GlobalStyle';

const App = observer(() => {
  const RequestApplicationMenu = () => {
    ApiFetch(
      'api/configuration/GetApplicationMenu',
      'GET',
      undefined,
      (Response) => {
        GlobalStore.SetNewApplicationMenu(Response.Data);
      }
    );
  };
  const GetLeftSidebar = () => {
    if (GlobalStore.CurrentTabKey != null) {
      return (
        <React.Suspense>
          {GlobalStore.GetCurrentTab.LeftSidebar.map((LazyComponent, Index) => {
            return <LazyComponent key={Index} />;
          })}
        </React.Suspense>
      );
    } else {
      return null;
    }
  };
  useEffect(() => {
    RequestApplicationMenu();
  }, []);
  return (
    <Provider GlobalStore={GlobalStore}>
      <ConfigProvider locale={ru_RU}>
        <GlobalStyle />
        <Layout className="FullExtend">
          <Header></Header>
          <Layout>
            <Sider theme="light">{GetLeftSidebar()}</Sider>
            <Content>
              {GlobalStore.ApplicationMenu.map((MenuElement) => {
                return (
                  <Button
                    key={MenuElement.Id}
                    onClick={() => {
                      GlobalStore.AddTab(MenuElement);
                    }}
                  >
                    {MenuElement.Caption}
                  </Button>
                );
              })}
              <Tabs
                onChange={(TabKey) => {
                  GlobalStore.SetCurrentTab(TabKey);
                }}
                destroyInactiveTabPane={true}
                size="small"
                hideAdd={true}
                onEdit={(TabKey) => {
                  GlobalStore.RemoveTab(TabKey);
                }}
                type="editable-card"
              >
                {GlobalStore.OpenTabs.map((Tab) => {
                  return (
                    <TabPane tab={Tab.Caption} key={Tab.Key}>
                      <React.Suspense>
                        {GlobalStore.GetCurrentTab.GetComponent}
                      </React.Suspense>
                    </TabPane>
                  );
                })}
              </Tabs>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Provider>
  );
});
createRoot(document.getElementById('App')).render(<App />);
