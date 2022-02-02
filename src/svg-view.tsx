import { useCallback, useEffect, useRef } from 'react';

import { SvgContext } from './main';
import { gridTool } from './tools/grid-tool';
import { XmlElement } from './xml-parser/XmlParser';

export function SvgView() {
  //   const rerender = useReducer((x) => !x, false)[1];
  const svgDivRef = useRef<HTMLDivElement>();
  const svgEditElement = useRef<XmlElement>();

  const rerenderSvg = useCallback(() => {
    svgDivRef.current!.innerHTML = SvgContext.parser.serialize(SvgContext.svg);
  }, []);

  useEffect(() => {
    SvgContext.updateSvg = rerenderSvg;
    rerenderSvg();
  });

  return (
    <div
      className="svg-view"
      ref={svgDivRef as any}
      draggable
      onDragStart={(evt) => {
        const [x, y] = mapCoordinates(
          svgDivRef.current!.firstElementChild!,
          [evt.clientX, evt.clientY],
          gridTool.data?.active ? gridTool.data.size : undefined
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

        SvgContext.svg.children?.push(svgEditElement.current);
      }}
      onDrag={(evt) => {
        if (!evt.clientX && !evt.clientY) return;

        const [x, y] = mapCoordinates(
          svgDivRef.current!.firstElementChild!,
          [evt.clientX, evt.clientY],
          gridTool.data?.active ? gridTool.data.size : undefined
        );

        let d = svgEditElement.current?.attributes!["d"] as string;

        const idx = d.indexOf("L");
        if (idx === -1) d += ` L${x.toFixed()} ${y.toFixed()}`;
        else d = d.slice(0, idx - 1) + ` L${x.toFixed()} ${y.toFixed()}`;

        svgEditElement.current!.attributes!["d"] = d;
        SvgContext.updateText();
        rerenderSvg();
      }}
      onDragEnd={(evt) => {
        svgEditElement.current = undefined;
      }}
    ></div>
  );
}

function mapCoordinates(
  element: Element,
  screen: [number, number],
  snap: number | undefined = undefined
) {
  const rect = element.getBoundingClientRect();
  let [x, y] = [
    ((screen[0] - rect.left) / rect.width) * 100,
    ((screen[1] - rect.top) / rect.height) * 100,
  ];

  if (snap) {
    x = Math.round(x / snap) * snap;
    y = Math.round(y / snap) * snap;
  }

  return [x, y];
}
