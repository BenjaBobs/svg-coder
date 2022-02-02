import { InputNumber, Switch } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { useEffect, useState } from 'react';

import { BorderInnerOutlined } from '@ant-design/icons';

import { OpenDrawer } from '../drawer-renderer';
import { SvgContext } from '../main';
import { Tool } from '../toolbar';
import { XmlElement } from '../xml-parser/XmlParser';

export const gridTool: Tool<{
  size: number;
  active: boolean;
}> = {
  name: "Grid",
  icon: <BorderInnerOutlined />,
  description: "Use a grid and snapping",
  data: {
    active: false,
    size: 10,
  },
  onClick: toggle,
};

function toggle() {
  OpenDrawer({
    name: "Grid",
    content: <GridDrawerContent />,
  });
}

function GridDrawerContent() {
  const [active, setActive] = useState<boolean>(gridTool.data!.active);
  const [gridSize, setGridSize] = useState<number>(gridTool.data!.size);

  useEffect(() => {
    // remove existing grid if any
    SvgContext.svg.children = SvgContext.svg.children!.filter((c) => {
      const classNames = (c.attributes?.["className"] as string) ?? "";
      return !classNames.includes("_grid");
    });

    if (active) {
      // <path d="M0 10 H100" stroke="lightgrey" stroke-dasharray="1" stroke-width="0.5" />
      const gridLines: XmlElement[] = [];

      for (let direction = 0; direction < 2; direction++) {
        for (let i = 0; i < 100; i += gridSize) {
          const horizontal = direction ? 1 : 0;
          const vertical = direction ? 0 : 1;

          gridLines.push({
            type: "path",
            attributes: {
              className: "_grid",
              stroke: "lightgrey",
              "stroke-dasharray": 1,
              "stroke-width": 0.5,
              d: `M${horizontal * i} ${vertical * i} ${
                direction ? "V" : "H"
              }100`,
            },
          });
        }
      }
      console.log(gridLines);
      SvgContext.svg.children.unshift(...gridLines);
    }

    SvgContext.updateSvg();
    SvgContext.updateText();
  }, [active, gridSize]);

  return (
    <>
      <Switch
        checked={active}
        onChange={(x) => {
          setActive(x);
          gridTool.data!.active = x;
        }}
      />
      <InputNumber
        addonBefore="Grid size"
        value={gridSize}
        onChange={(value) => {
          setGridSize(value);
          gridTool.data!.size = value;
        }}
        min={0}
        max={100}
      />
    </>
  );
}
