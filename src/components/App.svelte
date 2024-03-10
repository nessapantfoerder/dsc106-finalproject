<script>

  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';
  import Scrolly from "./Scrolly.svelte";
  import Scatterplot from "./Scatterplot.svelte";

  import Logo from "./Logo.svelte";
  import Title from "./Title.svelte";
  import Intro from "./Intro.svelte";
  import MeanSquaredError from "./MeanSquaredError.svelte";
  import WriteUp from "./WriteUp.svelte";
  import katexify from "../katexify";
  import {
    coeff,
    intercept,
    sliding
  } from "../store.js";
  import { format } from "d3-format";

  const formatter = format("$,");
  
  let pricesData = [];
  
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

  let value;

</script>


<Logo />
<Title />
<Intro />

<section>
	
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        <div class="step" class:active={value === 0}>
          <div class="step-content">
            <p>
            Let's fit a model to predict y using x (in units):
            <br /><br />
            {@html katexify(
              `\\text{y type} = \\hat{\\beta_1} * x unit + \\hat{\\beta_0}`,
              false
            )}
            <br /><br />
            We'll start with a  simple model, predicting the y
            to be just the average y in our dataset, ~5, ignoring
            the different x's of each data point:
            <br /><br />
            {@html katexify(`\\text{y type} = 0.778 * x unit + 5`, false)}
          </p>
          </div>
        </div>

        <div class="step" class:active={value === 1}>
          <div class="step-content">
            <p>
            We know this model is bad because the model doesn't fit the data
            well at all. But how can do quantify exactly <i>how</i> bad?
            <br /><br />
            To evaluate the model's performance numerically, we plot the error
            of each observation directly. These errors, or
            <span class="bold">residuals</span>, measure the distance between
            each observation and the predicted value for that observation. We can 
            clearly see that our model has a lot of error.
          </p>
          </div>
        </div>

        <div class="step" class:active={value === 2}>
          <div class="step-content">
            <p>
            The goal of linear regression is reducing this error such that we
            find a line that 'best' fits our data. For our simple
            regression problem, that involves estimating the y-intercept and slope
            of our model, {@html katexify(`\\hat{\\beta_0}`, false)} and {@html katexify(
              `\\hat{\\beta_1}`,
              false
            )}.
            <br /><br />
            For our specific problem, the best fit line is shown. There's still error,
            but, the general pattern is captured well. As a result, we can be
            reasonably confident that if we plug in new values of x unit,
            our predicted values of y unit would be reasonably accurate.
          </p>
          </div>
        </div>

        <div class="step" class:active={value === 3}>
          <div class="step-content">
            <p>
            Once we've fit our model, predicting future y values is super easy! We
            just plug in any {@html katexify(`x_i`, false)} values into our equation!
            <br /><br />For our simple model, that means plugging in a value for
            {@html katexify(`x unit`, false)} into our model:
          </p>
          <br />
          <div id="input-container">
            <p>{@html katexify(`x unit`, false)} Value: {$sliding}</p>
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
          <p>
            <br />
            {@html katexify(
              `\\hat{y} = ${$coeff} * ${$sliding} ${$intercept}`,
              false
            )}
            <br />
            {@html katexify(
              `\\hat{y} =  ${Math.round($sliding * $coeff + $intercept, 3)}`,
              false
            )}
            <br />
            <br />
            Thus, our model predicts an x-value that is {$sliding} will have a y-value of
            {(Math.round($sliding * $coeff + $intercept, 3))}.
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

  <p class="body-text">
    Now that we have a high-level idea of how linear regression works, let's
    dive a bit deeper. The remainder of this article will cover how to evaluate
    regression models.
    <br /><br /> Let's dive in!
  </p>
</section>

<MeanSquaredError />
<WriteUp />

<style>
	:global(body) {
		overflow-x: hidden;
	}
  
	.hero {
		height: 60vh;
		display: flex;
		place-items: center;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}
	
	.hero h2 {
		margin-top: 0;
		font-weight: 200;
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
