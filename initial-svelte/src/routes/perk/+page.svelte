<script lang="ts">
    import { goto } from "$app/navigation";
    
    function goHome() {
        goto('/landing');
    }

    function returnToProfile() {
        alert('Sponsor perk claimed!');
        goto('/profile');
    }
</script>

<svelte:head>
    <title>Claim Perks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="perk-page">
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
                <a href="/profile"><img src="/images/user.png" alt="Donor Profile icon" /></a>
                <p>Donor</p>
            </div>
        </div>

        <div class="left-panel">
            <h1>Instructions:</h1>

            <div class="instructions">
                <div class="step">
                    <p>Open the Red Bank Foundation app.</p>
                </div>

                <div class="step">
                    <p>Go to user profile.</p>
                </div>

                <div class="step">
                    <p>Go to sponsor perks.</p>
                </div>

                <div class="step">
                    <p>Select a claimable perk.</p>
                </div>
                
                <div class="step">
                    <p>Show QR code to scanner.</p>
                </div>
            </div>
        </div>

        <div class="main-panel">
            <div class="scanner-field">
                <div class="header">
                    <h1 class="headline">Claim Sponsor Perk</h1>
                </div>

                <div class="camera">
                    <button class="cam-btn" onclick={returnToProfile}>
                        <img src="/images/camera.png" alt="Camera scanner placeholder" />
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

    .perk-page {
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
      font-weight: normal;
      margin-top: 0.25in;
    }

    .instructions {
      font-size: 21px;
      display: flex;
      flex-direction: column;
    }

    .step {
      height: 0.75in;
      display: flex;
      align-items: center;
      border-bottom: 5px solid #8a2d2d;
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

    .scanner-field {
      width: 10in;
      display: flex;
      flex-direction: column;
      gap: 0.25in;
    }

    .headline {
      color: #f9fdff;
      font-size: 56px;
    }

    .cam-btn {
        border: none;
        background: none;
        padding: 0;
    }

    .camera img {
        height: 5.5in;
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