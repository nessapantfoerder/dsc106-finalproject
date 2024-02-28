<script>

export let pricesData;
export let dataForCorrelation;

</script>

<table>
    <thead>
      <tr>
        <th></th>
        <th>open</th>
        <th>close</th>
        <th>high</th>
        <th>low</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>open</td>
        <td>1.00</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>close</td>
        <td></td>
        <td>1.00</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>high</td>
        <td></td>
        <td></td>
        <td>1.00</td>
        <td></td>
      </tr>
      <tr>
        <td>low</td>
        <td></td>
        <td></td>
        <td></td>
        <td>1.00</td>
      </tr>
    </tbody>
  </table>  

<!-- 
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
        <td>{item.id}</td>
        <td>{item.id}</td>
        <td>{item.id}</td>
        <td>{item.id}</td>
        <td>{item.id}</td>        
      </tr>
    {/each}
  </tbody>
</table> -->

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
