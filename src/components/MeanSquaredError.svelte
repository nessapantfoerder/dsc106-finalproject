<script>
  import { mseBias, mseWeight, mseError, rSquared, RSS, TSS } from "../store";
  import { format } from "d3-format";
  import katexify from "../katexify";
  import MSEScatterplot from "./MSEScatterplot.svelte";
  let mseScatterClass;

  // label formatter
  const formatter = format(".2f");
</script>

<section>
  <h1 class="body-header">Model Evaluation</h1>
  <p class="body-text">
    <br />
    There are many ways to evaluate the performance of a regression model, but the two most common are Mean Squared Error (MSE) and R-squared. 
    They both use residuals, but in different ways.
    <br /><br />
    <strong>1. Mean-Squared Error (MSE)</strong>
    <br />
    <br>
    MSE quantifies how close a predicted value is to the true value, so we'll use
    it to quantify how close a regression line is to a set of points. MSE works by
    squaring the distance between each data point and the regression line (the red
    residuals in the graphs above), summing the squared values, and then dividing
    by the number of data points: {@html katexify(
      `\\begin{aligned} MSE = \\frac{1}{n} \\Sigma^{n}_{i=1}(y_i - \\hat{y_i})^2 \\end{aligned}`,
      true
    )}
    
    <br /><br />
    <strong>2. R-Squared</strong>
    <br />
    <br>
    R-squared is a metric that represents
    the percentage of the variance in {@html katexify(`y`, false)} explained by our
    features {@html katexify(`x`, false)}.
    More specifically, r-squared measures the percentage of variance explained normalized
    against the baseline variance of our model (which is just the variance of the
    mean):
    {@html katexify(
      `\\begin{aligned} R^2 = 1 - \\frac{\\Sigma^{n}_{i=1}(y_i - \\hat{y_i})^2 }{\\Sigma^{n}_{i=1}(y_i - \\bar{y})^2 }  \\end{aligned}`,
      true
    )}
    <br>
    R-squared must lie within [-1, 1]. A negative r-squared is doing worse than a flat line through the mean of our data, like our super duper simple (but stupid) model.
    
    <br /><br />
    <br>
  </p>
    <h3>Try for yourself!</h3>
    <p>
    To build intuition for yourself, change the weight and
    bias terms below to see how the MSE and r-squared change across different
    model fits:
  </p>
  <br /><br />
  <div id="mse-container">
    <div id="equations-container">
      <div id="buttons-container">
        <button on:click={() => mseScatterClass.shuffleData()}
          >Shuffle Data</button
        >
      </div>
      <div id="bias-slider">
        <div class="input-container">
          <p>
            Bias ({@html katexify(`\\hat{\\beta_0}`, false)}): {formatter(
              $mseBias
            )}
          </p>
          <input
            type="range"
            min="-2"
            step="0.5"
            max="16"
            bind:value={$mseBias}
            class="slider"
            id="myRange"
          />
        </div>
      </div>
      <div id="weight-slider">
        <div class="input-container">
          <p>
            Weight ({@html katexify(`\\hat{\\beta_1}`, false)}): {formatter(
              $mseWeight
            )}
          </p>
          <input
            type="range"
            min="-1.5"
            max="6"
            step=".01"
            bind:value={$mseWeight}
            class="slider"
            id="myRange"
          />
        </div>
      </div>

      <br />
      <div id="equation-math">
        For our model: {@html katexify(
          `\\hat{y} = ${formatter($mseWeight)}x${
            $mseBias < 0 ? "" : "+"
          }${formatter($mseBias)}`
        )}
      </div>
      <br />
      <div id="equation-math">
        {@html katexify(
          `\\begin{aligned} MSE = \\frac{1}{n} \\Sigma^{n}_{i=1}(y - (${formatter(
            $mseWeight
          )}x${$mseBias < 0 ? "" : "+"}${formatter($mseBias)}))^2 = ${formatter(
            $mseError
          )} \\end{aligned}`
        )}
      </div>
      <div id="equation-math">
        {@html katexify(
          `\\begin{aligned} R^2 = 1 - \\frac{${formatter($RSS)}}{${formatter(
            $TSS
          )}}  = ${formatter($rSquared)} \\end{aligned}`
        )}
      </div>
    </div>
    <div id="charts-container">
      <div id="mse-chart-regression">
        <MSEScatterplot bind:this={mseScatterClass} />
      </div>
    </div>
  </div>
  <br /><br />
</section>

<style>
  p {
    font-family: Arial, sans-serif; /* Replace with your desired font */
    
  }
  h1 {
    font-family: Arial, sans-serif; /* Replace with your desired font */
    text-align: center;
    
  }
  h3 {
    font-family: Arial, sans-serif; /* Replace with your desired font */
    text-align: center;
    
  }
  #mse-container {
    display: grid;
    grid-template-columns: 50% 50%;
    font-family: Arial, sans-serif; /* Replace with your desired font */
    margin: auto;
    max-width: 1000px;
    height: 50vh;
    max-height: 500px;
    justify-content: center;
  }

  #equations-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #buttons-container {
    display: flex;
    margin: 8px auto;
    justify-content: space-around;
    align-items: center;
    width: 90%;
  }

  .input-container {
    margin: 8px auto;

    justify-content: space-around;
    align-items: center;
    width: 70%;
  }

  button {
    background-color: gray; 
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
  }

  button:hover {
    outline: 2px solid black;
  }

  button:active {
    color: black;
  }

  button:visited {
    color: white;
  }

  #charts-container {
    display: grid;
    grid-template-columns: 100%;
    grid-column-gap: 0rem;
    grid-template-rows: 100%;
    padding-right: 1rem;
    height: 50vh;
    max-height: 400px;
  }

  #mse-chart-regression {
    width: 100%;
    height: 100%;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #mse-container {
      display: grid;
      grid-template-columns: 100%;
      margin: auto;
      max-width: 100%;
      width: 100%;
      height: 100%;
      max-height: 100%;
    }

    #charts-container {
      max-width: 100%;
    }
  }
</style>
