import { createRoot } from 'react-dom/client';
import React from 'react';
import { Layout, Tabs, ConfigProvider, Spin, Button } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { observer, Provider } from 'mobx-react';
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
import '../CSS/App.css';
import 'antd/dist/antd.css';

const App = observer(() => {
  const RequestApplicationMenu = () => {};
  return (
    <Provider>
      <ConfigProvider locale={ru_RU}>
        <Layout>
          <Header></Header>
          <Layout>
            <Sider theme="light"></Sider>
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
