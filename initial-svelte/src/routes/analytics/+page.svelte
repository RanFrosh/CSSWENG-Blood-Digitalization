<script lang="ts">
    import { goto } from "$app/navigation";

    function goHome() {
        goto('/landing');
    }
</script>

<svelte:head>
    <title>Overall Analytics</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="ana-page">
    <div class="banner">
        <div class="banner-content">
            <img src="/images/logo.png" alt="Red Bank Foundation logo" />
            <div class="webname">
                <button class="home-btn" onclick={goHome}><h1 id="webname">Red Bank Foundation</h1></button>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div class="margin"></div>

        <div class="left-panel">
            <h1>Set filters:</h1>

            <div class="filters">
                <div class="fil-section">
                    <h3>Date filters</h3>

                    <div class="fil-row">
                        <label for="sdate">Start date:</label>
                        <input type="date">
                    </div>

                    <div class="fil-row">
                        <label for="edate">End date:</label>
                        <input type="date">
                    </div>
                </div>

                <div class="fil-section">
                    <h3>Other filters</h3>

                    <div class="fil-row">
                        <label for="fil1">Filter 1:</label>
                        <select name="fil1">
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                    </div>

                    <div class="fil-row">
                        <label for="fil2">Filter 2:</label>
                        <select name="fil2">
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-panel">
            <div class="stats-field">
                <h1>Numerical Data</h1>

                <div class="num-data">
                    <div class="col-num">
                        <div class="row-num">
                            <h3>Total Onsite Visitors:</h3>
                            <p>100</p>
                        </div>
                    </div>

                    <div class="col-num">
                        <div class="row-num">
                            <h3>Successful Extractions:</h3>
                            <p>75</p>
                        </div>
                    </div>

                    <div class="col-num">
                        <div class="row-num">
                            <h3>Verified Safe Bags:</h3>
                            <p>50</p>
                        </div>
                    </div>
                </div>

                <h1>Graphical Data</h1>

                <div class="graph-data">
                    <div class="col-graph">
                        <h3>Blood Type Breakdown</h3>

                        <div class="row-graph">
                            <img src="/images/pie.png" alt="Placeholder Pie Chart" />

                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
                        </div>
                    </div>

                    <div class="col-graph">
                        <h3>Historical Event Logs</h3>
                        
                        <div class="row-graph">
                            <img src="/images/table.png" alt="Placeholder Table" />

                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-content">
        
        </div>
    </div>
</div>

<style>
    :global(*) {
      margin: 0;
      padding: 0;
    }

    :global(body) {
      color: black;
      background-color: #f9fdff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .ana-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .banner {
      height: 0.75in;
      border-bottom: 5px solid #c15555;
    }

    .banner-content {
      padding: 0.125in;
      gap: 0.25in;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .banner-content img {
      height: 0.5in;
    }

    .home-btn {
        border: none;
        background: none;
        padding: 0;
        font: inherit;
    }

    .webname h1 {
      font-size: 30px;
      color: #8a2d2d;
    }

    .webname h1:hover {
      text-decoration: underline;
    }

    .main-content {
        flex: 1;
        background-color: #c15555;
        display: flex;
        flex-direction: row;
    }

    .margin {
      width: 1in;
      background-color: #c15555;
    }

    .left-panel {
      width: 3.25in;
      background-color: #f9fdff;
      padding: 0.25in;

      display: flex;
      flex-direction: column;
      gap: 0.5in;
    }

    .left-panel h1 {
      font-size: 42px;
      font-weight: normal;
      margin-top: 0.25in;
    }

    .filters {
      display: flex;
      flex-direction: column;
      gap: 0.5in;
    }

    .fil-section {
        display: flex;
        flex-direction: column;
        gap: 0.125in;
    }

    .fil-section h3 {
        font-size: 24px;
    }

    .fil-row {
      height: 0.25in;
      display: flex;
      flex-direction: row;
      font-size: 21px;
      align-items: center;
      gap: 0.125in;
    }

    .fil-row label {
      width: 1in;
    }

    .main-panel {
      flex: 1;
      background-color: #c15555;
      padding: 0.5in;
      margin-left: 0.25in;
      display: flex;
      flex-direction: row;
      gap: 0.5in;
    }

    .stats-field {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-right: 0.25in;
      gap: 0.75in;
    }

    .stats-field h1 {
      color: #f9fdff;
      font-size: 56px;
      margin-bottom: -0.5in;
    }

    .num-data {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .col-num {
        width: 3.5in;
        display: flex;
        flex-direction: column;
        background-color: #8a2d2d;
        gap: 0.125in;
        padding: 0.25in;
    }

    .row-num {
        display: flex;
        flex-direction: row;
        font-size: 21px;
        color: #f9fdff;
        gap: 0.125in;
        align-items: center;
    }

    .row-num h3{
        font-weight: normal;
    }

    .row-num p{
        font-size: 30px;
        font-weight: bold;
        margin-left: auto;
    }

    .graph-data {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .col-graph {
        width: 5.5in;
        display: flex;
        flex-direction: column;
        background-color: #8a2d2d;
        border-radius: 20px;
        gap: 0.125in;
        padding: 0.25in;
    }

    .col-graph h3 {
        color: #f9fdff;
        font-size: 30px;
    }

    .row-graph {
        display: flex;
        flex-direction: row;
        gap: 0.5in;
        align-items: center;
    }

    .row-graph img {
        height: 2in;
        width: 2in;
    }

    .row-graph p {
        font-size: 21px;
        color: #f9fdff;
    }

    .footer {
        height: 1in;
        border-top: 5px solid #c15555;
        background-color: #8a2d2d;
    }

    .footer-content {
      padding: 0.125in;
      text-align: center;
      color: #f9fdff;
    }
</style>