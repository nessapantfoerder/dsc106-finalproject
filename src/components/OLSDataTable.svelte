<script>

export let pricesData;

  // Define your data
  let data = [
    { xbar: 10, ybar: 9, betahat0: 7.5, betahat1: 0.3, sse: 15 },
  ];
</script>

<table>
  <thead>
    <tr>
      <th> x bar</th>
      <th> y bar </th>
      <th> beta hat 0 </th>
      <th> beta hat 1 </th>
      <th> SSE </th>
    </tr>
  </thead>
  <tbody>
    {#each data as item}
      <tr>
        <td>{item.xbar}</td>
        <td>{item.ybar}</td>
        <td>{item.betahat0}</td>
        <td>{item.betahat1}</td>
        <td>{item.sse}</td>        
      </tr>
    {/each}
  </tbody>
</table>

<style>
  /* Add your table styles here */
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
</style>
