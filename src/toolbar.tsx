import { Button, Row, Tooltip } from 'antd';
import React from 'react';

export type Tool<TData = any> = {
  icon: React.ReactNode;
  name: string;
  description: string;
  data?: TData;
  onClick?: () => void;
};

const toolImports = import.meta.globEager("./tools/*.tsx");
const tools = Object.entries(toolImports).map(([path, module]) => {
  console.log("loading tool " + path);
  return Object.values(module)[0] as Tool;
});

export function Toolbar() {
  return (
    <Row className="toolbar" justify="center">
      {tools.map((t) => (
        <Tooltip
          key={t.name}
          title={
            <>
              {t.name}
              <br />
              {t.description}
            </>
          }
        >
          <Button icon={t.icon} onClick={t.onClick} />
        </Tooltip>
      ))}
    </Row>
  );
}
