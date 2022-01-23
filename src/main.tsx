import './main.scss';
import 'antd/dist/antd.min.css';

import { Col, Input, Row } from 'antd';
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import ReactDOM from 'react-dom';

import { XmlElement, XmlParser } from './xml-parser/XmlParser';

const xml = new XmlParser({
  format: {
    indent: "  ",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  const rerender = useReducer((x) => !x, false)[1];
  const svgDivRef = useRef<HTMLDivElement>();
  const svgTextRef = useRef(initialData());
  const svgDataRef = useRef(xml.deserialize(initialData()));
  const svgEditElement = useRef<XmlElement>();

  const textToSvg = useCallback(() => {
    svgDivRef.current!.innerHTML = svgTextRef.current;
    svgDataRef.current = xml.deserialize(svgTextRef.current);
    rerender();
  }, []);

  const svgToText = useCallback(() => {
    svgTextRef.current = xml.serialize(svgDataRef.current);
    svgDivRef.current!.innerHTML = svgTextRef.current;
    rerender();
  }, []);

  useEffect(() => {
    textToSvg();
  }, []);

  return (
    <>
      <Row justify="center">SVG'er</Row>
      <Row>
        <Col span={12}>
          <Row justify="center">View</Row>
          <Row
            style={{ paddingLeft: 48, paddingRight: 48 }}
            justify="center"
            ref={svgDivRef as any}
            draggable
            onDragStart={(evt) => {
              const [x, y] = mapCoordinates(
                svgDivRef.current!.firstElementChild!,
                [evt.clientX, evt.clientY]
              );
              // hide the drag preview
              evt.dataTransfer.setDragImage(new Image(), 0, 0);

              svgEditElement.current = {
                type: "path",
                attributes: {
                  stroke: "red",
                  "stroke-width": "1",
                  d: `M${x.toFixed()} ${y.toFixed()}`,
                },
              };

              svgDataRef.current.children?.push(svgEditElement.current);
            }}
            onDrag={(evt) => {
              if (!evt.clientX && !evt.clientY) return;

              const [x, y] = mapCoordinates(
                svgDivRef.current!.firstElementChild!,
                [evt.clientX, evt.clientY]
              );

              let d = svgEditElement.current?.attributes!["d"] as string;

              const idx = d.indexOf("L");
              if (idx === -1) d += ` L${x.toFixed()} ${y.toFixed()}`;
              else d = d.slice(0, idx - 1) + ` L${x.toFixed()} ${y.toFixed()}`;

              svgEditElement.current!.attributes!["d"] = d;
              svgToText();
            }}
            onDragEnd={(evt) => {
              svgEditElement.current = undefined;
            }}
          ></Row>
        </Col>
        <Col span={12}>
          <Row justify="center">Source</Row>
          <Row justify="center">
            <Input.TextArea
              value={svgTextRef.current}
              autoSize
              onChange={(evt) => {
                svgTextRef.current = evt.target.value;
                textToSvg();
              }}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
}

function mapCoordinates(element: Element, screen: [number, number]) {
  const rect = element.getBoundingClientRect();
  const [x, y] = [
    ((screen[0] - rect.left) / rect.width) * 100,
    ((screen[1] - rect.top) / rect.height) * 100,
  ];

  return [x, y];
}

function initialData() {
  return `
<svg version="1.1" viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 20 H100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 30 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 40 H100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 50 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 60 H100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 70 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 80 H100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M0 90 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />

    <path d="M10 0 V100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M20 0 V100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M30 0 V100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M40 0 V100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M50 0 V100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M60 0 V100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M70 0 V100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M80 0 V100" stroke="grey" stroke-dasharray="1" stroke-width="0.5" />
    <path d="M90 0 V100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
</svg>
`.trim();
}
