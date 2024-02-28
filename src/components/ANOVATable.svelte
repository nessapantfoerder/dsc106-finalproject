<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let pricesData = [];
    let anovaStatistics = {};
  
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
      
      calculateANOVA(pricesData.map(d => d.open), pricesData.map(d => d.close));
      console.log(anovaStatistics); // Ensure ANOVA statistics are calculated correctly
    });
  
    function calculateANOVA(data1, data2) {
      const mean1 = data1.reduce((sum, val) => sum + val, 0) / data1.length;
      const mean2 = data2.reduce((sum, val) => sum + val, 0) / data2.length;
  
      const SSTotal = data1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) + data2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0);
      const SSBetween = (Math.pow(mean1 - mean2, 2) * data1.length) + (Math.pow(mean2 - mean1, 2) * data2.length);
      const SSWithin = SSTotal - SSBetween;
  
      const dfBetween = 1;
      const dfWithin = data1.length + data2.length - 2;
      const dfTotal = data1.length + data2.length - 1;
  
      const MSBetween = SSBetween / dfBetween;
      const MSWithin = SSWithin / dfWithin;
  
      const F = MSBetween / MSWithin;
  
      anovaStatistics = {
      dfBetween: dfBetween.toFixed(0),
      dfWithin: dfWithin.toFixed(0),
      dfTotal: dfTotal.toFixed(0),
      SSBetween: SSBetween.toFixed(2),
      SSWithin: SSWithin.toFixed(2),
      SSTotal: SSTotal.toFixed(2),
      MSBetween: MSBetween.toFixed(2),
      MSWithin: MSWithin.toFixed(2),
      F: F.toFixed(2)
    }; 
}
  </script>
  
  <table style="font-size: 12px;">
    <thead>
      <tr>
        <th></th>
        <th>SSE</th>
        <th>df</th>
        <th>MS</th>
        <th>F</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Between Groups</td>
        <td>{anovaStatistics.SSBetween}</td>
        <td>{anovaStatistics.dfBetween}</td>
        <td>{anovaStatistics.MSBetween}</td>
        <td>{anovaStatistics.F}</td>
      </tr>
      <tr>
        <td>Within Groups</td>
        <td>{anovaStatistics.SSWithin}</td>
        <td>{anovaStatistics.dfWithin}</td>
        <td>{anovaStatistics.MSWithin}</td>
        <td></td>
      </tr>
      <tr>
        <td>Total</td>
        <td>{anovaStatistics.SSTotal}</td>
        <td>{anovaStatistics.dfTotal}</td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>  
  
<style>
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