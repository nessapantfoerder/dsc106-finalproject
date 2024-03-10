<script>
  import katexify from "../katexify";
</script>

<section>

  <p class="body-text">
    <strong>What is Linear Regression?</strong> 
    <br>
    Linear Regression is a model that estimates the relationship between one 
    independent variable and one dependent variable using a straight line, and 
    uses that relationship to make predictions. 
  </p>
  <br />
  <p class="body-text">
    <strong>Let's Be More Specific</strong>
    <br />
    Linear regression is an algorithm that learns to model a dependent variable, 
    {@html katexify(`y`, false)}, as a function of some independent variables (aka "features"), 
    {@html katexify(`x_i`,false)}, by finding a line that best "fits" the data. 
    In general, we assume {@html katexify(`y`, false)} to be some number and each
    {@html katexify(`x_i`, false)} can be basically anything. For example: predicting
    the price of a house using the number of rooms in that house ({@html katexify(`y`,false)}: 
    price, {@html katexify(`x_1`, false)}: number of rooms) or predicting weight from height 
    and age ({@html katexify(`y`, false)}: weight, {@html katexify(`x_1`,false)}: height, 
    {@html katexify(`x_2`, false)}: age).
    <br /><br />
    In general, the equation for linear regression is
  </p>
  <br />
  <p class="body-text">
    {@html katexify(
      `y=\\beta_0 + \\beta_1x_1  + \\beta_2x_2 + ... + \\beta_px_p + \\epsilon`,
      true
    )}
  </p>

  <br />
  <p class="body-text">
    where: <br />
  </p>
  <ul class="body-text">
    <li>
      {@html katexify(`y`, false)}: the dependent variable; the thing we are
      trying to predict.
    </li>

    <li>
      {@html katexify(`x_i`, false)}: the independent variables: the features
      our model uses to model y.
    </li>
    <li>
      {@html katexify(`\\beta_i`, false)}: the coefficients (aka "weights") of
      our regression model. These are the foundations of our model. They are
      what our model "learns" during optimization.
    </li>
    <li>
      {@html katexify(`\\epsilon`, false)}: the irreducible error in our model.
      A term that collects together all the unmodeled parts of our data.
    </li>
  </ul>
  <br />

  <p class="body-text">
    Fitting a linear regression model is all about finding the set of
    cofficients that best model {@html katexify(`y`, false)} as a function of our
    features. We may never know the true parameters for our model, but we can estimate
    them (more on this later). Once we've estimated these coefficients, {@html katexify(
      `\\hat{\\beta_i}`,
      false
    )}, we predict future values, {@html katexify(`\\hat{y}`, false)}, as:
  </p>
  <br />
  <p class="body-text">
    {@html katexify(
      `\\hat{y}=\\hat{\\beta_0} + \\hat{\\beta_1}x_1  + \\hat{\\beta_2}x_2 + ... + \\hat{\\beta_p}x_p  `,
      true
    )}
  </p>
  <p class="body-text">
    So predicting future values (often called inference), is as simple as
    plugging the values of our features {@html katexify(`x_i`, false)} into our equation!
  </p>
  <br />
</section>

<style>
 
  ul {
    max-width: 600px;
    margin: auto;
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--squid-ink);
  }
  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }
</style>
