import { createRoot } from 'react-dom/client';
import React from 'react';
import { useEffect } from 'react';
import GlobalStore from '../GlobalStore/GlobalStore';
import { Layout, Tabs, ConfigProvider, Spin, Button } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import '../CSS/App.css';
import 'antd/dist/antd.css';
import { ApiFetch } from '../Helpers/Helpers';

const App = observer(() => {
  const RequestApplicationMenu = () => {
    ApiFetch(
      'api/configuration/GetApplicationMenu',
      'GET',
      undefined,
      (Response) => {
        GlobalStore.SetNewApplicationMenu(Response.Data.Items);
      }
    );
  };
  useEffect(() => {
    RequestApplicationMenu();
  }, []);
  return (
    <Provider GlobalStore={GlobalStore}>
      <ConfigProvider locale={ru_RU}>
        <Layout>
          <Header></Header>
          <Layout>
            <Sider theme="light"></Sider>
            {GlobalStore.ApplicationMenu.map((MenuElement) => {
              return (
                <Button key={MenuElement.Id}>{MenuElement.Caption} </Button>
              );
            })}
            <Tabs
              destroyInactiveTabPane={true}
              size="small"
              hideAdd={true}
              type="editable-card"
            ></Tabs>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Provider>
  );
});
createRoot(document.getElementById('App')).render(<App />);
