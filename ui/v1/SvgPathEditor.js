/* global document */
// Originally from https://codepen.io/anthonydugois/pen/mewdyZ by Anthony Dugois.

import { log, read, write } from "@jsxcad/sys";

import React from "react";
import ReactDOM from "react-dom";
import Pane from "./Pane";
import absolutifySvgPath from "abs-svg-path";
import parseSvgPath from "parse-svg-path";

const Component = React.Component;

const toPoints = (svgPath) => {
  const absolutePath = absolutifySvgPath(parseSvgPath(svgPath));
  const points = [];
  let closePath = false;
  for (const element of absolutePath) {
    const [type, a, b, c, d, e, f, g] = element;
    switch (type) {
      case "M":
        points.push({ x: a, y: b });
        break;
      case "L":
        points.push({ x: a, y: b });
        break;
      case "Q":
        points.push({ x: c, y: d, q: { x: a, y: b } });
        break;
      case "C":
        points.push({
          x: e,
          y: f,
          c: [
            { x: a, y: b },
            { x: c, y: d },
          ],
        });
        break;
      case "A":
        points.push({ x: f, y: g, a: { rx: a, ry: b, rot: c, laf: d, sf: e } });
        break;
      case "Z":
        closePath = true;
        break;
    }
  }
  return { points, closePath };
};

class SvgPathEditor extends Pane {
  constructor(props) {
    super(props);

    const { points, closePath } = toPoints(
      props.svgPath || "M 100 300 Q 0 100 200 100"
    );

    this.state = {
      w: 800,
      h: 600,
      grid: {
        show: true,
        snap: true,
        size: 5,
      },
      ctrl: false,
      points,
      activePoint: points.length - 1,
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false,
      closePath,
      iteration: 0,
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  }

  async componentDidMount() {
    const { file } = this.props;
    const svgPath = await read(file);
    const { points, closePath } = toPoints(svgPath);
    this.setState({ closePath, points });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  positiveNumber(n) {
    n = parseInt(n);
    if (isNaN(n) || n < 0) n = 0;

    return n;
  }

  setWidth = (e) => {
    let v = this.positiveNumber(e.target.value);
    let min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  };

  setHeight = (e) => {
    let v = this.positiveNumber(e.target.value);
    let min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  };

  setGridSize = (e) => {
    let grid = this.state.grid;
    let v = this.positiveNumber(e.target.value);
    let min = 1;
    let max = Math.min(this.state.w, this.state.h);

    if (v < min) v = min;
    if (v >= max) v = max / 2;

    grid.size = v;

    this.setState({ grid });
  };

  setGridSnap = (e) => {
    let grid = this.state.grid;
    grid.snap = e.target.checked;

    this.setState({ grid });
  };

  setGridShow = (e) => {
    let grid = this.state.grid;
    grid.show = e.target.checked;

    this.setState({ grid });
  };

  setClosePath = (e) => {
    this.setState({ closePath: e.target.checked });
  };

  // FIX: Separate policy and mechanism?
  save = async (e) => {
    const { file } = this.props;
    const path = this.generatePath();
    await write(file, path);
    await log({ op: "text", text: "Saved", level: "serious" });
  };

  getMouseCoords = (e) => {
    const rect = ReactDOM.findDOMNode(this.refs.svg).getBoundingClientRect();
    let x = Math.round(e.pageX - rect.left);
    let y = Math.round(e.pageY - rect.top);

    if (this.state.grid.snap) {
      x = this.state.grid.size * Math.round(x / this.state.grid.size);
      y = this.state.grid.size * Math.round(y / this.state.grid.size);
    }

    return { x, y };
  };

  setPointType = (e) => {
    const points = this.state.points;
    const active = this.state.activePoint;

    // not the first point
    if (active !== 0) {
      let v = e.target.value;

      switch (v) {
        case "l":
          points[active] = {
            x: points[active].x,
            y: points[active].y,
          };
          break;
        case "q":
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            q: {
              x: (points[active].x + points[active - 1].x) / 2,
              y: (points[active].y + points[active - 1].y) / 2,
            },
          };
          break;
        case "c":
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            c: [
              {
                x: (points[active].x + points[active - 1].x - 50) / 2,
                y: (points[active].y + points[active - 1].y) / 2,
              },
              {
                x: (points[active].x + points[active - 1].x + 50) / 2,
                y: (points[active].y + points[active - 1].y) / 2,
              },
            ],
          };
          break;
        case "a":
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            a: {
              rx: 50,
              ry: 50,
              rot: 0,
              laf: 1,
              sf: 1,
            },
          };
          break;
      }

      this.setState({ iteration: this.state.iteration + 1, points });
    }
  };

  setPointPosition = (coord, e) => {
    let coords = this.state.points[this.state.activePoint];
    let v = this.positiveNumber(e.target.value);

    if (coord === "x" && v > this.state.w) v = this.state.w;
    if (coord === "y" && v > this.state.h) v = this.state.h;

    coords[coord] = v;

    this.setPointCoords(coords);
  };

  setQuadraticPosition = (coord, e) => {
    let coords = this.state.points[this.state.activePoint].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === "x" && v > this.state.w) v = this.state.w;
    if (coord === "y" && v > this.state.h) v = this.state.h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  };

  setCubicPosition = (coord, anchor, e) => {
    let coords = this.state.points[this.state.activePoint].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === "x" && v > this.state.w) v = this.state.w;
    if (coord === "y" && v > this.state.h) v = this.state.h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  };

  setPointCoords = (coords) => {
    const points = this.state.points;
    const active = this.state.activePoint;

    points[active].x = coords.x;
    points[active].y = coords.y;

    this.setState({ points, iteration: this.state.iteration + 1 });
  };

  setQuadraticCoords = (coords) => {
    const points = this.state.points;
    const active = this.state.activePoint;

    points[active].q.x = coords.x;
    points[active].q.y = coords.y;

    this.setState({ points, iteration: this.state.iteration + 1 });
  };

  setArcParam = (param, e) => {
    const points = this.state.points;
    const active = this.state.activePoint;
    let v;

    if (["laf", "sf"].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = this.positiveNumber(e.target.value);
    }

    points[active].a[param] = v;

    this.setState({ points, iteration: this.state.iteration + 1 });
  };

  setCubicCoords = (coords, anchor) => {
    const points = this.state.points;
    const active = this.state.activePoint;

    points[active].c[anchor].x = coords.x;
    points[active].c[anchor].y = coords.y;

    this.setState({ points, iteration: this.state.iteration + 1 });
  };

  setDraggedPoint = (index) => {
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedPoint: true,
        iteration: this.state.iteration + 1,
      });
    }
  };

  setDraggedQuadratic = (index) => {
    if (!this.state.ctrl) {
      this.setState({
        iteration: this.state.iteration + 1,
        activePoint: index,
        draggedQuadratic: true,
      });
    }
  };

  setDraggedCubic = (index, anchor) => {
    if (!this.state.ctrl) {
      this.setState({
        iteration: this.state.iteration + 1,
        activePoint: index,
        draggedCubic: anchor,
      });
    }
  };

  cancelDragging = (e) => {
    this.setState({
      iteration: this.state.iteration + 1,
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false,
    });
  };

  addPoint = (e) => {
    const { activePoint, ctrl, points } = this.state;
    if (ctrl) {
      let coords = this.getMouseCoords(e);
      points.splice(activePoint, 0, coords);
      this.setState({
        iteration: this.state.iteration + 1,
        points,
        activePoint: activePoint + 1,
      });
    }
    e.stopPropagation();
  };

  removeActivePoint = (e) => {
    const { points, activePoint } = this.state;

    if (points.length > 1 && activePoint !== 0) {
      points.splice(activePoint, 1);

      this.setState({
        iteration: this.state.iteration + 1,
        points,
        activePoint: Math.min(points.length - 1, activePoint),
      });
    }
  };

  handleMouseMove = (e) => {
    if (!this.state.ctrl) {
      if (this.state.draggedPoint) {
        this.setPointCoords(this.getMouseCoords(e));
      } else if (this.state.draggedQuadratic) {
        this.setQuadraticCoords(this.getMouseCoords(e));
      } else if (this.state.draggedCubic !== false) {
        this.setCubicCoords(this.getMouseCoords(e), this.state.draggedCubic);
      }
    }
    e.stopPropagation();
  };

  handleKeyDown = (e) => {
    if (e.ctrlKey) this.setState({ ctrl: true });
    if (e.key === "Delete" && props.removeActivePoint) {
      props.removeActivePoint(e);
    }
  };

  handleKeyUp = (e) => {
    if (!e.ctrlKey) this.setState({ ctrl: false });
  };

  generatePath() {
    let { points, closePath } = this.state;
    let d = "";

    points.forEach((p, i) => {
      if (i === 0) {
        // first point
        d += "M ";
      } else if (p.q) {
        // quadratic
        d += `Q ${p.q.x} ${p.q.y} `;
      } else if (p.c) {
        // cubic
        d += `C ${p.c[0].x} ${p.c[0].y} ${p.c[1].x} ${p.c[1].y} `;
      } else if (p.a) {
        // arc
        d += `A ${p.a.rx} ${p.a.ry} ${p.a.rot} ${p.a.laf} ${p.a.sf} `;
      } else {
        d += "L ";
      }

      d += `${p.x} ${p.y} `;
    });

    if (closePath) d += "Z";

    return d;
  }

  reset = (e) => {
    let w = this.state.w;
    let h = this.state.h;

    this.setState({
      iteration: this.state.iteration + 1,
      points: [{ x: w / 2, y: h / 2 }],
      activePoint: 0,
    });
  };

  renderPane() {
    return (
      <div className="ad-SvgPathEditor" onMouseUp={this.cancelDragging}>
        <div className="ad-SvgPathEditor-main">
          <div className="ad-SvgPathEditor-svg">
            <SVG
              ref="svg"
              svgPath={this.generatePath()}
              {...this.state}
              addPoint={this.addPoint}
              setDraggedPoint={this.setDraggedPoint}
              setDraggedQuadratic={this.setDraggedQuadratic}
              setDraggedCubic={this.setDraggedCubic}
              handleMouseMove={this.handleMouseMove}
            />
          </div>
        </div>

        <div className="ad-SvgPathEditor-controls">
          <Controls
            {...this.state}
            reset={this.reset}
            removeActivePoint={this.removeActivePoint}
            setPointPosition={this.setPointPosition}
            setQuadraticPosition={this.setQuadraticPosition}
            setCubicPosition={this.setCubicPosition}
            setArcParam={this.setArcParam}
            setPointType={this.setPointType}
            setWidth={this.setWidth}
            setHeight={this.setHeight}
            setGridSize={this.setGridSize}
            setGridSnap={this.setGridSnap}
            setGridShow={this.setGridShow}
            setClosePath={this.setClosePath}
            save={this.save}
          />
        </div>
      </div>
    );
  }
}

/**
 * SVG rendering
 */

class SVG extends Component {
  render() {
    const {
      svgPath,
      w,
      h,
      grid,
      points,
      activePoint,
      addPoint,
      handleMouseMove,
      setDraggedPoint,
      setDraggedQuadratic,
      setDraggedCubic,
    } = this.props;

    let circles = points.map((p, i, a) => {
      let anchors = [];

      if (p.q) {
        anchors.push(
          <Quadratic
            key={anchors.length}
            index={i}
            p1x={a[i - 1].x}
            p1y={a[i - 1].y}
            p2x={p.x}
            p2y={p.y}
            x={p.q.x}
            y={p.q.y}
            setDraggedQuadratic={setDraggedQuadratic}
          />
        );
      } else if (p.c) {
        anchors.push(
          <Cubic
            key={anchors.length}
            index={i}
            p1x={a[i - 1].x}
            p1y={a[i - 1].y}
            p2x={p.x}
            p2y={p.y}
            x1={p.c[0].x}
            y1={p.c[0].y}
            x2={p.c[1].x}
            y2={p.c[1].y}
            setDraggedCubic={setDraggedCubic}
          />
        );
      }

      return (
        <g
          key={i}
          className={
            "ad-PointGroup" +
            (i === 0 ? "  ad-PointGroup--first" : "") +
            (activePoint === i ? "  is-active" : "")
          }
        >
          <Point
            key="p"
            index={i}
            x={p.x}
            y={p.y}
            setDraggedPoint={setDraggedPoint}
          />
          {anchors}
        </g>
      );
    });

    return (
      <svg
        className="ad-SVG"
        width={w}
        height={h}
        onClickCapture={(e) => addPoint(e)}
        onMouseMoveCapture={(e) => handleMouseMove(e)}
      >
        <Grid w={w} h={h} grid={grid} />
        <path className="ad-Path" d={svgPath} />
        <g className="ad-Points">{circles}</g>
      </svg>
    );
  }
}

function Cubic(props) {
  return (
    <g className="ad-Anchor">
      <line
        className="ad-Anchor-line"
        x1={props.p1x}
        y1={props.p1y}
        x2={props.x1}
        y2={props.y1}
      />
      <line
        className="ad-Anchor-line"
        x1={props.p2x}
        y1={props.p2y}
        x2={props.x2}
        y2={props.y2}
      />
      <circle
        className="ad-Anchor-point"
        onMouseDown={(e) => props.setDraggedCubic(props.index, 0)}
        cx={props.x1}
        cy={props.y1}
        r={6}
      />
      <circle
        className="ad-Anchor-point"
        onMouseDown={(e) => props.setDraggedCubic(props.index, 1)}
        cx={props.x2}
        cy={props.y2}
        r={6}
      />
    </g>
  );
}

function Quadratic(props) {
  return (
    <g className="ad-Anchor">
      <line
        key="q1"
        className="ad-Anchor-line"
        x1={props.p1x}
        y1={props.p1y}
        x2={props.x}
        y2={props.y}
      />
      <line
        key="q2"
        className="ad-Anchor-line"
        x1={props.x}
        y1={props.y}
        x2={props.p2x}
        y2={props.p2y}
      />
      <circle
        key="q3"
        className="ad-Anchor-point"
        onMouseDown={(e) => props.setDraggedQuadratic(props.index)}
        cx={props.x}
        cy={props.y}
        r={6}
      />
    </g>
  );
}

function Point(props) {
  return (
    <circle
      className="ad-Point"
      onMouseDown={(e) => props.setDraggedPoint(props.index)}
      cx={props.x}
      cy={props.y}
      r={8}
    />
  );
}

function Grid(props) {
  const { show, snap, size } = props.grid;

  let grid = [];

  for (let i = 1; i < props.w / size; i++) {
    grid.push(
      <line key={`Gx${i}`} x1={i * size} y1={0} x2={i * size} y2={props.h} />
    );
  }

  for (let i = 1; i < props.h / size; i++) {
    grid.push(
      <line key={`Gy${i}`} x1={0} y1={i * size} x2={props.w} y2={i * size} />
    );
  }

  return <g className={"ad-Grid" + (!show ? "  is-hidden" : "")}>{grid}</g>;
}

/**
 * Controls
 */

function Controls(props) {
  const active = props.points[props.activePoint];
  const step = props.grid.snap ? props.grid.size : 1;

  let params = [];

  if (active.q) {
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Control point X position"
          type="range"
          min={0}
          max={props.w}
          step={step}
          value={active.q.x}
          onChange={(e) => props.setQuadraticPosition("x", e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Control point Y position"
          type="range"
          min={0}
          max={props.h}
          step={step}
          value={active.q.y}
          onChange={(e) => props.setQuadraticPosition("y", e)}
        />
      </div>
    );
  } else if (active.c) {
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="First control point X position"
          type="range"
          min={0}
          max={props.w}
          step={step}
          value={active.c[0].x}
          onChange={(e) => props.setCubicPosition("x", 0, e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="First control point Y position"
          type="range"
          min={0}
          max={props.h}
          step={step}
          value={active.c[0].y}
          onChange={(e) => props.setCubicPosition("y", 0, e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Second control point X position"
          type="range"
          min={0}
          max={props.w}
          step={step}
          value={active.c[1].x}
          onChange={(e) => props.setCubicPosition("x", 1, e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Second control point Y position"
          type="range"
          min={0}
          max={props.h}
          step={step}
          value={active.c[1].y}
          onChange={(e) => props.setCubicPosition("y", 1, e)}
        />
      </div>
    );
  } else if (active.a) {
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="X Radius"
          type="range"
          min={0}
          max={props.w}
          step={step}
          value={active.a.rx}
          onChange={(e) => props.setArcParam("rx", e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Y Radius"
          type="range"
          min={0}
          max={props.h}
          step={step}
          value={active.a.ry}
          onChange={(e) => props.setArcParam("ry", e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Rotation"
          type="range"
          min={0}
          max={360}
          step={1}
          value={active.a.rot}
          onChange={(e) => props.setArcParam("rot", e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Large arc sweep flag"
          type="checkbox"
          checked={active.a.laf}
          onChange={(e) => props.setArcParam("laf", e)}
        />
      </div>
    );
    params.push(
      <div key={params.length} className="ad-Controls-container">
        <Control
          name="Sweep flag"
          type="checkbox"
          checked={active.a.sf}
          onChange={(e) => props.setArcParam("sf", e)}
        />
      </div>
    );
  }

  return (
    <div className="ad-Controls">
      <h3 className="ad-Controls-title">Parameters</h3>

      <div key="c1" className="ad-Controls-container">
        <Control
          name="Width"
          type="text"
          value={props.w}
          onChange={(e) => props.setWidth(e)}
        />
        <Control
          name="Height"
          type="text"
          value={props.h}
          onChange={(e) => props.setHeight(e)}
        />
        <Control
          name="Close path"
          type="checkbox"
          value={props.closePath}
          onChange={(e) => props.setClosePath(e)}
        />
      </div>
      <div key="c2" className="ad-Controls-container">
        <Control
          name="Grid size"
          type="text"
          value={props.grid.size}
          onChange={(e) => props.setGridSize(e)}
        />
        <Control
          name="Snap grid"
          type="checkbox"
          checked={props.grid.snap}
          onChange={(e) => props.setGridSnap(e)}
        />
        <Control
          name="Show grid"
          type="checkbox"
          checked={props.grid.show}
          onChange={(e) => props.setGridShow(e)}
        />
      </div>
      <div key="c3" className="ad-Controls-container">
        <Control
          type="button"
          action="reset"
          value="Reset path"
          onClick={(e) => props.reset(e)}
        />
      </div>

      <h3 className="ad-Controls-title">Selected point</h3>

      {props.activePoint !== 0 && (
        <div key="c4" className="ad-Controls-container">
          <Control
            name="Point type"
            type="choices"
            id="pointType"
            choices={[
              {
                name: "L",
                value: "l",
                checked: !active.q && !active.c && !active.a,
              },
              { name: "Q", value: "q", checked: !!active.q },
              { name: "C", value: "c", checked: !!active.c },
              { name: "A", value: "a", checked: !!active.a },
            ]}
            onChange={(e) => props.setPointType(e)}
          />
        </div>
      )}
      <div key="c5" className="ad-Controls-container">
        <Control
          name="Point X position"
          type="range"
          min={0}
          max={props.w}
          step={step}
          value={active.x}
          onChange={(e) => props.setPointPosition("x", e)}
        />
      </div>
      <div key="c6" className="ad-Controls-container">
        <Control
          name="Point Y position"
          type="range"
          min={0}
          max={props.h}
          step={step}
          value={active.y}
          onChange={(e) => props.setPointPosition("y", e)}
        />
      </div>

      {params}

      {props.activePoint !== 0 && (
        <div key="c7" className="ad-Controls-container">
          <Control
            type="button"
            action="delete"
            value="Remove this point"
            onClick={(e) => props.removeActivePoint(e)}
          />
        </div>
      )}

      <div key="c8" className="ad-Controls-container">
        <Control
          type="button"
          action="save"
          value="Save"
          onClick={(e) => props.save(e)}
        />
      </div>
    </div>
  );
}

function Control(props) {
  const { name, type, ..._props } = props;

  let control = "";
  let label = "";

  switch (type) {
    case "range":
      control = <Range {..._props} />;
      break;
    case "text":
      control = <Text {..._props} />;
      break;
    case "checkbox":
      control = <Checkbox {..._props} />;
      break;
    case "button":
      control = <Button {..._props} />;
      break;
    case "choices":
      control = <Choices {..._props} />;
      break;
  }

  if (name) {
    label = <label className="ad-Control-label">{name}</label>;
  }

  return (
    <div className="ad-Control">
      {label}
      {control}
    </div>
  );
}

function Choices(props) {
  let choices = props.choices.map((c, i) => {
    return (
      <label key={i} className="ad-Choice">
        <input
          className="ad-Choice-input"
          type="radio"
          value={c.value}
          checked={c.checked}
          name={props.id}
          onChange={props.onChange}
        />
        <div className="ad-Choice-fake">{c.name}</div>
      </label>
    );
  });

  return <div className="ad-Choices">{choices}</div>;
}

function Button(props) {
  return (
    <button
      className={
        "ad-Button" + (props.action ? "  ad-Button--" + props.action : "")
      }
      type="button"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Checkbox(props) {
  return (
    <label className="ad-Checkbox">
      <input
        className="ad-Checkbox-input"
        type="checkbox"
        onChange={props.onChange}
        checked={props.checked}
      />
      <div className="ad-Checkbox-fake" />
    </label>
  );
}

function Text(props) {
  return (
    <input
      className="ad-Text"
      type="text"
      value={props.value}
      onChange={props.onChange}
    />
  );
}

function Range(props) {
  return (
    <div className="ad-Range">
      <input
        className="ad-Range-input"
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={props.onChange}
      />
      <input
        className="ad-Range-text  ad-Text"
        type="text"
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}

export default SvgPathEditor;
