<script>
  import * as d3 from 'd3';
  import { getAllContexts, getContext, createEventDispatcher } from 'svelte';
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
	
  import { scaleLinear } from "d3-scale";
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

  $: tweenedX = tweened(
    data.map((d) => d.foo),
    tweenOptions
  );

  $: tweenedY = tweened(
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

  function handleAddOutlier() {
      const newOutlier = {
      foo: Math.random() * 10,
      bar: Math.random() * 10,
      swag: Math.random() * 10, 
    };
    data.push(newOutlier);
    regressionLine = calculateRegressionLine(data);
    tweenedX.set(data.map(d => d.foo));
    tweenedY.set(data.map(d => d.bar));
  }
  
  function handleRemoveOutlier() {
    let maxDistance = -1;
    let indexToRemove;
    data.forEach((point, index) => {
      const distance = calculateDistanceToRegressionLine(point, regressionLine);
      if (distance > maxDistance) {
        maxDistance = distance;
        indexToRemove = index;
      }
    });
    if (indexToRemove !== undefined) {
      data.splice(indexToRemove, 1);
    }
    regressionLine = calculateRegressionLine(data);
    tweenedX.set(data.map(d => d.foo));
    tweenedY.set(data.map(d => d.bar));
  }

  function calculateDistanceToRegressionLine(point, regressionLine) {
    const slope = (regressionLine[1].y - regressionLine[0].y) / (regressionLine[1].x - regressionLine[0].x);
    const intercept = regressionLine[0].y - slope * regressionLine[0].x;
    const distance = Math.abs(point.bar - (slope * point.foo + intercept)) / Math.sqrt(1 + slope * slope);
    return distance;
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
    {#if step == 0}
      <path d={`M${xScale(regressionLine[0].x)} ${yScale(regressionLine[0].y)} L${xScale(regressionLine[1].x)} ${yScale(regressionLine[1].y)}`} fill="none" stroke="red" stroke-width="2" />
    {:else}
      <!-- <path d={polyRegressionLine} fill="none" stroke="green" stroke-width="2" /> -->
    {/if}
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