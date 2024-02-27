<script>
	/* By Connor Rothschild https://twitter.com/CL_Rothschild
	Scrollytelling component from Russell Goldenberg https://twitter.com/codenberg/status/1432774653139984387 */

  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';
  import Scrolly from "./Scrolly.svelte";
  import Scatterplot from "./Scatterplot.svelte";
  
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
  });

  let value;
  const steps = [
	"<h1>Ordinary Least Squares</h1><p>The Ordinary Least Squares (OLS) method to regression lets us estimate the parameters of a linear model. The goal of OLS is to determine the linear model that minimizes the sum of the squared errors between the observations in a dataset and those predicted by the model.</p><h1>Equation</h1><p>Comment on data in graph</p>",
    "<h1>Correlation</h1><p>Correlation is a measure of the linear relationship between two variables</p><h1>Equation/Correlation Matrix</h1><p>Comment on data in graph</p>",
    "<h1>Analysis of Variance</h1><p>The Analysis of Variance (ANOVA) statistical method to regression tests whether groups of data have the same mean. ANOVA generalizes the t-test to two or more groups by comparing the sum of square error within and between groups.</p><h1>ANOVA table</h1><p>Comment on data in graph</p>",
  ];
</script>

<section>
	<div class='hero'>
		<h1> 
			Regression Analysis
		</h1>
		<h2>
			Linear regression is a statistical method used to model the relationship between two variables.
		</h2>
		<h3>
			Alaa Fadhl-allah
		</h3>
		<h3>
			Nessa Pantfoerder
		</h3>
		<p style="margin-top: 20px">
			Scroll to Begin
		</p>
		<h4>
			Linear regression is a technique employed to understand the relationship between a dependent variable and one or more independent variables. Here we will explore Ordinary Least Squares (OLS) method to minimize the sum of squared differences between observed and predicted values. We will also explore correlation to measure the relationship between two variables. Lastly we will discuss Analysis of Variance (ANOVA) frameworks to assess the significance of the relationship between variables and also provide insights into the strength and direction of correlation between them.
		</h4>
	</div>
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        {#each steps as text, i}
          <div class="step" class:active={value === i}>
            <div class="step-content">{@html text}</div>
          </div>
        {/each}
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class="sticky">
      <Scatterplot step={value} />
    </div>
  </div>
	<div class='hero'>
		<h1> 
			The End
		</h1>
	</div>
</section>

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
