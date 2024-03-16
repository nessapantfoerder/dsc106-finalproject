<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';
  import Scrolly from "./Scrolly.svelte";
  import Scatterplot from "./Scatterplot.svelte";
  import { mseBias, mseWeight, mseError, rSquared, RSS, TSS } from "../store";
  import MSEScatterplot from "./MSEScatterplot.svelte";
  import Logo from "./Logo.svelte";
  import Title from "./Title.svelte";
  import Intro from "./Intro.svelte";
  import MeanSquaredError from "./MeanSquaredError.svelte";
  import WriteUp from "./WriteUp.svelte";
  import katexify from "../katexify";
  import {
    coeff,
    intercept,
    sliding,
    computedValue
  } from "../store.js";
  import { format } from "d3-format";
  import { fade } from 'svelte/transition';

  const formatter = format("$,");
  
  let pricesData = [];
  let scrollY = 0;
  let mseScatterClass;

  
  onMount(async () => {
	const res = await fetch('prices.csv');
	const csv = await res.text();
	pricesData = await d3.csvParse(csv, d => ({
		symbol: d['symbol'],
		date: +d['date'],
		open: Math.round(+d['open']),
		close: Math.round(+d['close']),
		low: Math.round(+d['low']),
		high: Math.round(+d['high']),
		volume: Math.round(+d['volume']),
	}));
    const dataForCorrelation = pricesData.map(item => [item.open, item.close, item.low, item.high, item.volume]);
  });
  onMount(() => {
    const updateScrollY = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', updateScrollY);

    return () => {
      window.removeEventListener('scroll', updateScrollY);
    };
  });

  let value;
</script>

<Logo />
<Title />
<Intro />


<section>
  <h3 class:fade-in={scrollY > 100}>
    What is Linear Regression?
  </h3>
  <p class:fade-in={scrollY > 150}>
    <strong>Linear Regression</strong>  is a basic statistical model used to understand how changes in one variable relates to changes in another variable.
    It does this by fitting a straight line to the data points and using that line to predict future values.
    <br>
    <br>
  </p>
  <p class:fade-in={scrollY > 200}>
    Let's be more specific..
  </p>
  <p class:fade-in={scrollY > 250}>
    <strong>Linear Regression</strong> is an algorithm that learns to model a dependent variable Y as a function of some independent variable X by finding the <i>line that best fits the data.
    <br>
    <br>
    
    </p>
    <p class:fade-in={scrollY > 500}>
      <strong>Line of Best Fit Equation:</strong>
      <br>
      
    </p>
    <p class:fade-in={scrollY > 500}>
      {@html katexify(`Y = A + B * X`, false)}
      <br>
      where B is the slope of the line and A is the y-intercept.
      <br>
      With this equation, we can predict future values of Y given any value of X by plugging X into the equation.
      <br>
      <br>    
    </p>
    <p class:fade-in={scrollY > 600}>
      A simple example:
  <br>
  Let's say we are predicting the price of the house using the number of rooms in the house.
  The number of rooms in the house is the independent variable X
  and the price of the house is the dependent variable Y.
</p>
</section>

<section>
  <h3 class:fade-in={scrollY > 700}>
    How is a Linear Regression Model built?
  </h3>
</section>

{#if scrollY > 720}
<section>
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        <div class="step" class:active={value === 0}>
          <div class="step-content">
            <p class = 'lol'>
              <strong>A Super Duper Simple Linear Model</strong>
              <br />
            <br />
            First, we will start with a very simple model that predicts the y to be the average of y values in our dataset, without considering the x values.
            <br /><br />
            {@html katexify(`y = \\beta_{1}*x + \\beta_{0}`, false)}
            <br /><br />
            {@html katexify(`y = 0*x + 5.5`, false)}
            <br /><br />
            {@html katexify(`y = 5.5`, false)}    
          </p>
          </div>
        </div>

        <div class="step" class:active={value === 1}>
          <div class="step-content">
            <p class = 'lol'>
              This model is super simple, but sadly, a little stupid. 
              It sucks at capturing the pattern in our data. 
              <br>
              <br>
              But..how can we measure <i>how</i> much it sucks?
            <br /><br />
            <strong>Residuals!</strong>
            <br>
            <br>
            Plotted are the difference between each actual observation and its predicted value.
            These differences, or
            <span class="bold"><i>residuals</i></span>,  show how far off our predictions are from the actual data points. 
            <br>
            <br>
            This simple model has a lot of residuals, which is very, very bad.
          </p>
          </div>
        </div>

        <div class="step" class:active={value === 2}>
          <div class="step-content">
            <p class = 'lol'>
            <strong>Line of Best Fit & Residuals</strong>
            <br>
            <br>
            <i>Remember</i>: the goal of linear regression is finding the line of best fit; the line that 
            minimizes the residuals. 
            <br>
            <br>
            Plotted is the line of best fit for our data. There is still error, but it is minimized and the general 
            pattern is captured. 
            <br>
            <br>
            <strong>Now this is a Linear Regression Model!</strong> 
            
            </p>
          </div>
        </div>

        <div class="step" class:active={value === 3}>
          <div class="step-content">
            <p class = 'lol'>
              <strong>Making Predictions</strong>
              <br>
              <br>
              Once we've fit our model, predicting future y values is super easy! We
              just plug in any x into our equation. 
              <br /><br /><strong>Try it for yourself! </strong>Plug in any value of x into our model and see what y value you get. 
            </p>
          <div id="input-container">
            <p class = 'lol'>
            {'x'} Value: {$sliding}</p>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              bind:value={$sliding}
              class="slider"
              id="myRange"
            />
          </div>
          <p class = 'lol'>
            <br />
            {@html katexify(
              `\\hat{y} = ${$coeff} * ${$sliding} + ${$intercept}`,
              false
            )}
            <br />
            {@html katexify(
              `\\hat{y} =  ${$sliding * $coeff + $intercept}`,
              false
            )}
            <br />
            <br />
            Our model predicts that an x-value of {$sliding} will have a y-value of
            {$sliding * $coeff + $intercept}.
          </p>
          </div>
        </div>
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class="sticky">
      <Scatterplot step={value}/>
    </div>
  </div>
</section>
{/if}


{#if scrollY > 2500}
  <MeanSquaredError />
{/if}

<WriteUp />


<style>
	:global(body) {
		overflow-x: hidden;
	}

  p {
    opacity: 0;
    transition: opacity 1s;
    font-family: Arial, sans-serif; /* Replace with your desired font */
    text-align: center;
    
  }

  p.fade-in {
    opacity: 1;
  }

  h3 {
    opacity: 0;
    transition: opacity 1s;
    font-family: Arial, sans-serif; /* Replace with your desired font */
    text-align: center;
    padding-left: 40px; /* Add this line */
    padding-right: 40px; /* Add this line */
  }
  h3.fade-in {
    opacity: 1;
  }


  p.lol {
    opacity: 1;
    transition: opacity 1s;
    font-family: Arial, sans-serif; /* Replace with your desired font */
  }

  .spacer {
    height: 40vh;
  }

  .sticky {
    position: sticky;
    top: 10%;
		flex: 1 1 60%;
    width: 60%;
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  #input-container {
    text-align: center; /* Center-align the content */
  }

  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    font-size: 1rem;
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: .5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);
    text-align: left;
		width: 75%;
		margin: auto;
		max-width: 500px;
  }

  .step.active .step-content {
		background: white;
		color: black;
	}
	
  .steps-container,
  .sticky {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }
	
  
/* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 768px) {
    .section-container {
      flex-direction: column-reverse;
    }
    .sticky {
      width: 95%;
			margin: auto;
    }
  }
</style>


