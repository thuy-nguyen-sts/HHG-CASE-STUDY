import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';

import { Menu } from 'antd';
import Counts from './components/Counts';
import Table from './components/Table';

function App() {

  const [page, setpage] = useState('count');
  useEffect(() => {
    setpage(window.location.pathname);
  }, [setpage]);

  const handleOnchangeTab = (e: any) => {
    setpage(e.key);
  };

  return (
    <div className="App">
      <Router>
        <div>
          <Menu
            onClick={handleOnchangeTab}
            selectedKeys={[page]}
            mode="horizontal"
            className="navigate"
          >
            <Menu.Item key="/">
              <Link to="/">Count</Link>
            </Menu.Item>
            <Menu.Item key="/employees">
              <Link to="/employees">Employees</Link>
            </Menu.Item>
          </Menu>
          <Switch>
            <Route path="/employees">
              <Table />
            </Route>
            <Route path="/">
              <Counts />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
