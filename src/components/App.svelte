<script>

  import { onMount, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';
  import Scrolly from "./Scrolly.svelte";
  import Scatterplot from "./Scatterplot.svelte";
	import OLSDataTable from './OLSDataTable.svelte';
  import CorrelationMatrix from './CorrelationMatrix.svelte';
  import ANOVATable from './ANOVATable.svelte';
  import AnovaTable from './ANOVATable.svelte';
  import OlsDataTable from './OLSDataTable.svelte';
  
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
  const steps = [
	"<h1>Linear Regression</h1><p>The Ordinary Least Squares (OLS) method to regression lets us estimate the parameters of a linear model. \
    The goal of OLS is to determine the linear model that minimizes the sum of the squared errors between the observations in a dataset \
    and those predicted by the model.</p><h1>Equation</h1><p>Comment on data in graph</p>",
    "<h1>Logistic Regression</h1><p>Correlation is a measure of the linear relationship between two variables</p>\
    <h1>Equation/Correlation Matrix</h1><p>Comment on data in graph</p>",
    "<h1>Conclusion</h1><p>The Analysis of Variance (ANOVA) statistical method to regression \
      tests whether groups of data have the same mean. ANOVA generalizes the t-test to two or more groups by \
      comparing the sum of square error within and between groups.</p><h1>ANOVA table</h1><p>Comment on data in graph</p>",
  ];
</script>

<section>
	<div class='hero'>
    
    <h1> 
			The Ultimate Showdown
		</h1>
		<h2>
			Linear Regression vs. Logistic Regression: <br>Who is the Winner?
		</h2>
		<h3>
      Nessa Pantfoerder & Alaa Fadhl-allah
		</h3>
		
    <p>
      What is <strong>Linear Regression?</strong>
      <br>
      Linear Regression is a model that estimates the relationship between one 
      independent variable and one dependent variable using a straight line, and uses that
      relationship to make predictions. 
      <br>
      <br>
      What is <strong>Logistic Regression?</strong>
      <br>
      Logistic regression is a model predicts a dependent data variable by analyzing the
       relationship between it and an independent variable.
      <br>
      So, what is the difference?
    <p style="margin-top: 20px">
        Keep scrolling to find out!
    </p>
	</div>
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        <div class="step" class:active={value === 0}>
          <div class="step-content">
            <h1>Linear Regression</h1>
            <p>Pros:
              <ul>
                  <li>Efficiency;</li>
                  <li>Provides Coefficients;</li>
              </ul>
              Cons:
              <ul>
                  <li>Sensitive to Outliers</li>
                  <li>May Overfit Data</li>
              </ul>            
            <h1>Equation</h1>
            <p>
              \( Y = \beta_0 + \beta_1 *X_1  \)
          </p>
          </div>
        </div>
        
        <div class="step" class:active={value === 1}>
          <div class="step-content">
            <h1>Logistic Regression</h1>
            <h3>Pros:</h3>
            <ul>
                <li>Interpretability</li>
                <li>Less Prone to Overfitting</li>
            </ul>

            <h3>Cons:</h3>
            <ul>
                <li>Limited to Linear Decision Boundaries</li>
                <li>Assumes Independence of Observations</li>
            </ul>
            <h1>Equation</h1>
            <p></p>
        </div>

        <div class="step" class:active={value === 2}>
          <div class="step-content">
            <h1>Conclusion</h1>
            <p>
            In conclusion, choose based on the nature of the problem; logistic regression for classification tasks, linear regression for predicting continuous outcomes.            </p>
          </div>
        </div>
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class="sticky">
      <Scatterplot step={value} />
    </div>
  </div>

  <div class="hero">
    <h1> 
      Writeup
    </h1>
    <p>
      The web page writeup contains at least 4 sentences for each of the following questions:
    </p>
    <p>
      What have you done so far?
      <br>
      So far, we have set up the blueprint of the webpage. We created 3 slides; one for linear regression, one for logistic regression, and one for the conclusion.  
      We used the linearregression from simple-statistics to fit a linear regression model to the simulated data. In addition, we are working on using logistic-regression from the same package to fit a logistic regression model to the simulated data. Then, we added a button to add an outlier, as well as a buttion 
      to remove outliers, so that we can show how outliers affect linear regression and logistic regression. The prototype has 3 visualizations and 2 interative buttons.
    </p>
    <p>
      What will be the most challenging of your project to design and why?
      <br>
      The most challenging part of our project to design will be the logistic regression model. This is because logistic regression is a more complex model than linear regression. It is also more difficult to interpret the results of logistic regression than linear regression. Regarding the linear regression model, 
      there is the challenge of updating the linear regression model with the addition/removal of points simultaneously. We may add a button to fit the new data to oveercome that difficulty.
    </p>
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
