import { Drawer } from 'antd';
import React, { useEffect, useReducer } from 'react';

type DrawerOptions = {
  name: string;
  content: React.ReactNode;
};

const drawers: { [key: string]: DrawerOptions & { open: boolean } } = {};

export let OpenDrawer = (opts: DrawerOptions) => {};

export function DrawerRenderer() {
  const rerender = useReducer((x) => !x, false)[1];

  useEffect(() => {
    OpenDrawer = (opts) => {
      const extendedOpts = opts as DrawerOptions & { open: boolean };
      extendedOpts.open = true;
      drawers[opts.name] = extendedOpts;
      rerender();
    };
  });

  return (
    <>
      {Object.values(drawers).map((opts) => (
        <Drawer
          key={opts.name}
          title={opts.name}
          destroyOnClose={true}
          visible={opts.open}
          onClose={() => {
            drawers[opts.name].open = false;
            rerender();
          }}
        >
          {opts.content}
        </Drawer>
      ))}
    </>
  );
}
