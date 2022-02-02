import { Input } from 'antd';
import { useEffect, useState } from 'react';

import { SvgContext } from './main';

export function TextView() {
  const [svgText, setSvgText] = useState(
    SvgContext.parser.serialize(SvgContext.svg)
  );

  useEffect(() => {
    SvgContext.updateText = () => {
      setSvgText(SvgContext.parser.serialize(SvgContext.svg));
    };
  });

  return (
    <Input.TextArea
      className="text-view"
      value={svgText}
      autoSize
      onChange={(evt) => {
        setSvgText(evt.target.value);
        SvgContext.svg = SvgContext.parser.deserialize(evt.target.value);
        SvgContext.updateSvg();
      }}
    />
  );
}
