<script lang="ts">
    import { goto } from "$app/navigation";
    
    function goHome() {
        goto('/landing');
    }

    function claimPerks() {
        goto('/perk');
    }
</script>

<svelte:head>
    <title>Donor Profile</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="profile-page">
    <div class="banner">
        <div class="banner-content">
            <img src="/images/logo.png" alt="Red Bank Foundation logo" />
            <div class="webname">
                <button class="home-btn" onclick={goHome}><h1 id="webname">Red Bank Foundation</h1></button>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div class="navi">
            <div class="menu search">
                <a href="/search"><img src="/images/search.png" alt="Search icon" /></a>
                <p>Search</p>
            </div>

            <div class="menu events">
                <img src="/images/planner.png" alt="Event Planner icon" />
                <p>Events</p>
            </div>

            <div class="menu events">
                <img src="/images/user.png" alt="Donor Psrofile icon" />
                <p>Donor</p>
            </div>
        </div>

        <div class="left-panel">
            <h1>Donor Profile</h1>

            <div class="donor-info">
                <div class="info-row">
                    <h3>Name:</h3>
                    <p>John Sue Doe</p>
                </div>

                <div class="info-row">
                    <h3>Email address:</h3>
                    <p>john_doe@gmail.com</p>
                </div>
                
                <div class="info-row">
                    <h3>Mobile number:</h3>
                    <p>0912-345-6789</p>
                </div>

                <div class="info-row">
                    <h3>Sex:</h3>
                    <p>Male</p>
                </div>

                <div class="info-row">
                    <h3>Blood type:</h3>
                    <p>O+</p>
                </div>
            </div>
        </div>

        <div class="main-panel">
            <div class="data-field">
                <h1>Donor Data</h1>

                <div class="donor-data">
                    <div class="col-data">
                        <div class="row-data">
                            <h3>Total visits:</h3>
                            <p>7</p>
                        </div>
                        
                        <div class="row-data">
                            <h3>Latest visit:</h3>
                            <p>2026-05-23</p>
                        </div>
                    </div>

                    <div class="col-data">
                        <div class="row-data">
                            <h3>Perks claimed:</h3>
                            <p>2</p>
                        </div>
                    </div>

                    <div class="col-data">
                        <div class="row-data">
                            <h3>Blood donated:</h3>
                            <p>3.15L</p>
                        </div>

                        <div class="row-data">
                            <h3>Blood bags filled:</h3>
                            <p>9</p>
                        </div>
                    </div>
                </div>

                <h1>Donor Actions</h1>

                <div class="donor-actions">
                    <div class="row-act">
                        <div class="col-act">
                            <h3>Update donor analytics</h3>
                            <p>Record new donor data after onsite procedures</p>
                        </div>
                    </div>

                    <button class="row-act claim-btn" onclick={claimPerks}>
                        <div class="col-act">
                            <h3>Claim sponsor perks</h3>
                            <p>Verify donor eligibility and authorize claiming</p>
                        </div>
                    </button>
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

    .profile-page {
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

    .navi {
      width: 1in;
      background-color: #c15555;

      display: flex;
      flex-direction: column;
      padding-top: 0.5in;
      gap: 0.25in;
      align-items: center;
    }

    .menu img {
      height: 0.5in;
    }

    .menu p {
      margin-top: 5px;
    }

    .menu:hover {
      transform: scale(1.125);
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
      margin-top: 0.25in;
    }

    .donor-info {
      display: flex;
      flex-direction: column;
    }

    .info-row {
      height: 0.5in;
      display: flex;
      flex-direction: row;
      font-size: 18px;
      align-items: center;
      gap: 0.125in;
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

    .data-field {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-right: 0.25in;
      gap: 0.75in;
    }

    .data-field h1 {
      color: #f9fdff;
      font-size: 56px;
      margin-bottom: -0.5in;
    }

    .donor-data {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .col-data {
        width: 3.5in;
        display: flex;
        flex-direction: column;
        background-color: #8a2d2d;
        gap: 0.125in;
        padding: 0.25in;
    }

    .row-data {
        display: flex;
        flex-direction: row;
        font-size: 21px;
        color: #f9fdff;
        gap: 0.125in;
        align-items: center;
    }

    .donor-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5in;
    }

    .claim-btn {
        border: none;
        background: none;
        padding: 0;
        font: inherit;
        text-align: left;
    }

    .row-act {
        display: flex;
        flex-direction: row;
        background-color: #8a2d2d;
        border-radius: 20px;
        gap: 0.125in;
        padding: 0.25in;
    }

    .row-act:hover {
        transform: scale(1.03125);
    }

    .col-act {
        display: flex;
        flex-direction: column;
        font-size: 21px;
        color: #f9fdff;
        gap: 0.125in;
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