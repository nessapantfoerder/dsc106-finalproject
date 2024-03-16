<script>
  import * as d3 from 'd3';
  import { getAllContexts, getContext, createEventDispatcher } from 'svelte';
  import { linearRegression } from 'simple-statistics';
  import {
    sliding,
    intercept,
    coeff
  } from "../store.js";
  import { format } from "d3-format";

  const formatter = format("$,");

  export let step;
  export let pricesData;

  let data = [
    { foo: 2, bar: 3, swag: 3 },
    { foo: 2, bar: 3, swag: 3 },
    { foo: 3, bar: 4, swag: 2 },
    { foo: 4, bar: 5, swag: 1 },
    { foo: 5, bar: 6, swag: 2 },
    { foo: 6, bar: 5, swag: 4 },
    { foo: 4, bar: 5, swag: 5 },
    { foo: 6, bar: 6, swag: 6 },
    { foo: 9, bar: 8, swag: 7 },
    { foo: 7, bar: 6, swag: 8 },
    { foo: 10, bar: 10, swag: 9 },
    { foo: 8, bar: 8, swag: 10 },
    { foo: 6, bar: 5, swag: 4 },
    { foo: 4, bar: 5, swag: 5 },
    { foo: 3, bar: 4, swag: 6 },
    { foo: 9, bar: 8, swag: 7 },
    { foo: 7, bar: 6, swag: 8 },
    { foo: 10, bar: 10, swag: 9 },
    { foo: 3, bar: 2, swag: 10 },
    { foo: 1, bar: 1, swag: 7 },
  ];
	
  import { scaleLinear } from "d3-scale";
  import { line } from "d3-shape";
  import { extent, min, max } from "d3-array";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  let width;
  let height;

  const margin = { top: 30, bottom: 30, left: 30, right: 30 };

  const tweenOptions = {
    delay: 0,
    duration: 1000,
    easing: cubicOut,
  };

  const tweenedLineCoords = tweened(
    [{ x: 0, y: 0 }, 
    { x: 0, y: 0 }], 
    { duration: 1000, 
      easing: cubicOut }
  );

  $: tweenedX = tweened(
    data.map((d) => d.foo),
    tweenOptions
  );

  $: tweenedY = tweened(
    data.map((d) => d.bar),
    tweenOptions
  );

  $: xScale = scaleLinear()
    .domain(extent($tweenedX, (d) => d))
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain(extent($tweenedY, (d) => d))
    .range([height - margin.top, margin.bottom]);

  const lineGenerator = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  let regressionLine;

  $: {
      regressionLine = calculateRegressionLine(data);
  }

  function calculateRegressionLine(data) {
    const preparedData = data.map(d => [+d.foo, +d.bar]);
    const { m: slope, b: intercept } = linearRegression(preparedData);
    const minX = Math.min(...data.map(d => d.foo));
    const maxX = Math.max(...data.map(d => d.foo));
    const minY = slope * minX + intercept;
    const maxY = slope * maxX + intercept;
    return [{ x: minX, y: minY }, { x: maxX, y: maxY }];
  }
  
  function calculateYOnRegressionLine(dataPoint) {
    const slope = (regressionLine[1].y - regressionLine[0].y) / (regressionLine[1].x - regressionLine[0].x);
    const intercept = regressionLine[0].y - slope * regressionLine[0].x;
    return slope * dataPoint.foo + intercept;
  }

</script>

<div
  class="chart-container"
  bind:offsetWidth={width}
  bind:offsetHeight={height}
>
<!-- width={$mseWidth} height={$mseHeight + margin.top + margin.bottom} -->
  <svg width={width + margin.right + margin.left} {height}>
    <!-- x-ticks -->
    {#each xScale.ticks() as tick}
      <g
        transform={`translate(${xScale(tick) + 0} ${
          height - margin.bottom
        })`}
      >
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1="0"
          x2="0"
          y1="0"
          y2={-height + margin.bottom + margin.top}
          stroke="black"
          stroke-dasharray="4"
        />
        <text class="axis-text" y="15" text-anchor="middle"
          >{tick}</text
        >
      </g>
    {/each}
    <!-- y-ticks -->
    {#each yScale.ticks() as tick}
      <g transform={`translate(${margin.left - 5} ${yScale(tick) + 0})`}>
        <!-- svelte-ignore component-name-lowercase -->
        <line
          class="grid-line"
          x1={5}
          x2={width - margin.right}
          y1="0"
          y2="0"
          stroke="black"
          stroke-dasharray="4"
        />
        <text
          class="axis-text"
          y="0"
          text-anchor="end"
          dominant-baseline="middle">{tick}</text
        >
      </g>
    {/each}
    <!-- x axis line -->
    <line
      class="axis-line"
      y1={height}
      y2={height}
      x1={width}
      x2={0}
      stroke="black"
      stroke-width="3"
    />
    <!-- y axis line -->
    <line
      class="axis-line"
      y1={width}
      y2={0}
      x1={0}
      x2={0}
      stroke="black"
      stroke-width="3"
    />
    {#each data as d}
      <circle
        cx={xScale(d.foo)}
        cy={yScale(d.bar)}
        r={10}
        fill="black"
        stroke="#000000"
        opacity=".9"
      />
      {#if step == 1}
        <line x1={xScale(d.foo)} y1={yScale(d.bar)} x2={xScale(d.foo)} y2={height/2} stroke="black" stroke-width="2" />
      {/if}
      {#if step == 2}
        <line x1={xScale(d.foo)} y1={yScale(d.bar)} x2={xScale(d.foo)} y2={yScale(calculateYOnRegressionLine(d))} stroke="black" stroke-width="2" />
      {/if}
    {/each}
    {#if step == 0}
      <line x1={margin.left} y1={height/2} x2={width - margin.right} y2={height/2} stroke="red" stroke-width="5" />
    {/if}
    {#if step == 1}
      <line x1={margin.left} y1={height/2} x2={width - margin.right} y2={height/2} stroke="red" stroke-width="5" />
    {/if}
    {#if step == 2}
      <path d={`M${xScale(regressionLine[0].x)} ${yScale(regressionLine[0].y)} L${xScale(regressionLine[1].x)} ${yScale(regressionLine[1].y)}`} fill="none" stroke="red" stroke-width="5" />
    {/if}
    {#if step == 3}
      <!-- horizontal annotation line -->
      <line 
        x1={xScale($sliding)}
        x2={xScale($sliding)}
        y1={yScale(calculateYOnRegressionLine({ foo: $sliding }))}
        y2={yScale(0)}
        stroke="black"
        stroke-width="1.5"
      />
      <!-- vertical annotation line -->
      <line
        x1={xScale(0)}
        x2={xScale($sliding)}
        y1={yScale(calculateYOnRegressionLine({ foo: $sliding }))}
        y2={yScale(calculateYOnRegressionLine({ foo: $sliding }))}
        stroke="black"
        stroke-width="1.5"
      />
      <!-- regression line -->
      <path d={`M${xScale(regressionLine[0].x)} ${yScale(regressionLine[0].y)} L${xScale(regressionLine[1].x)} ${yScale(regressionLine[1].y)}`} fill="none" stroke="red" stroke-width="5" />
    {/if}
  </svg>
</div>

<style>
  .chart-container {
    height: 80vh;
    max-width: 100%;
		background: linear-gradient(to bottom right, black -100%, white 100%);
		box-shadow: 1px 1px 6px #cecece;
  }

  .axis-label {
    font-weight: bold;
  }

  .axis-text {
    font-size: 0.7rem;
  }

  .grid-line {
    opacity: 0.075;
  }

  .axis-label {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  /* ipad */
  @media screen and (max-width: 950px) {
    .axis-label {
      font-size: 0.8rem;
    }
  }
  /* mobile */
  @media screen and (max-width: 750px) {
    .axis-label {
      font-size: 0.75rem;
    }
  }
</style>

