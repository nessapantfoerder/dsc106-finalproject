<script>
  import * as d3 from 'd3';
  import { getAllContexts, getContext, createEventDispatcher } from 'svelte';
  import { scaleLinear, axisBottom, axisLeft } from 'd3';
  import { linearRegression } from 'simple-statistics';

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
    { foo: 1, bar: 10, swag: 10 },
    { foo: 1, bar: 9, swag: 10 },
    { foo: 2, bar: 10, swag: 10 },
    { foo: 2, bar: 9, swag: 10 },
    { foo: 2, bar: 8, swag: 10 },
    { foo: 1, bar: 8, swag: 10 },
    { foo: 1, bar: 1, swag: 7 },

  ];

	
  import {  scaleSqrt } from "d3-scale";
  import {line} from "d3-shape";
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

  const tweenedX = tweened(
    data.map((d) => d.foo),
    tweenOptions
  );

  const tweenedY = tweened(
    data.map((d) => d.bar),
    tweenOptions
  );

  $: tweenedData = data.map((d, index) => ({
    x: $tweenedX[index],
    y: $tweenedY[index]
  }));

  function setTween(dimension, key) {
    dimension.set(data.map((d) => +d[key]));
  }

  $: {
    if (step == 0) {
      setTween(tweenedX, "foo");
      setTween(tweenedY, "bar");
    }
    if (step == 1) {
      setTween(tweenedX, "foo");
      setTween(tweenedY, "swag");
    }
    if (step == 2) {
      setTween(tweenedX, "swag");
    }
  }

  $: xScale = scaleLinear()
    .domain(extent($tweenedX, (d) => d))
    .range([margin.left, width - margin.right]);

  $: yScale = scaleLinear()
    .domain(extent($tweenedY, (d) => d))
    .range([height - margin.top, margin.bottom]);

  const lineGenerator = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  let regressionLineData = [
    { x: min($tweenedX), y: min($tweenedY) },
    { x: max($tweenedX), y: max($tweenedY) }
  ];
  // Create a reactive statement that recalculates the regression line whenever the data changes
  $: regressionLine = calculateRegressionLine(data);

function calculateRegressionLine(data) {
  // Prepare the data for the linearRegression function
  const preparedData = data.map(d => [d.x, d.y]);

  // Calculate the slope and intercept of the regression line
  const { m: slope, b: intercept } = linearRegression(preparedData);

  return { slope, intercept };
}

  function handleAddOutlier() {
    // Define the outlier point
    const outlier = { foo: 6, dog: 1, swag: 0 };

    // Add the outlier point to data
    data = [...data, outlier];
    regressionLineData = [
        { x: min($tweenedX), y: min($tweenedY) },
        { x: max($tweenedX), y: max($tweenedY) }
      ];
  }

  function handleRemoveOutlier() {
    // Remove the last point from data
    data = data.slice(0, -1);
    
  }

  
</script>

<button on:click={handleAddOutlier}>Add Outlier</button>
<button on:click={handleRemoveOutlier}>Remove Outlier</button>

<div
  class="chart-container"
  bind:offsetWidth={width}
  bind:offsetHeight={height}
>
  <svg width={width + margin.right + margin.left} {height}>
    {#each tweenedData as d}
      <circle
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        r={15}
        fill="steelblue"
        stroke="#000000"
        opacity=".9"
      />
    {/each}
    <path d={`M${xScale(regressionLineData[0].x)} ${yScale(regressionLineData[0].y)} L${xScale(regressionLineData[1].x)} ${yScale(regressionLineData[1].y)}`} fill="none" stroke="red" stroke-width="2" />
    <button on:click={handleRemoveOutlier}>Remove Outlier</button>
  </svg>
</div>

<style>
  .chart-container {
    height: 80vh;
    max-width: 100%;
		background: linear-gradient(to bottom right, steelblue -100%, white 100%);
		border-radius: 5px;
		box-shadow: 1px 1px 6px #cecece;
  }
</style>