import './main.scss';
import 'antd/dist/antd.min.css';

import { Col, Row } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

import { DrawerRenderer } from './drawer-renderer';
import { SvgView } from './svg-view';
import { TextView } from './text-view';
import { Toolbar } from './toolbar';
import { XmlParser } from './xml-parser/XmlParser';

const xml = new XmlParser({
  format: {
    indent: "  ",
  },
});

export const SvgContext = {
  svg: xml.deserialize(
    `
      <svg version="1.1" viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      </svg>
    `
  ),
  updateText: () => {},
  updateSvg: () => {},
  parser: xml,
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  return (
    <>
      <Toolbar />
      <Row>
        <Col span={12}>
          <SvgView />
        </Col>
        <Col span={12}>
          <TextView />
        </Col>
      </Row>
      <DrawerRenderer />
    </>
  );
}
