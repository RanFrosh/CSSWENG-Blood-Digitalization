<script lang="ts">
    import { goto } from "$app/navigation";

    function goHome() {
        goto('/landing');
    }
</script>

<svelte:head>
    <title>Activity Log</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="log-page">
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
            <div class="menu scan">
                <a href="/scanner"><img src="/images/scanner.png" alt="Scan QR icon" /></a>
                <p>Scan QR</p>
            </div>

            <div class="menu regis">
                <a href="/registration"><img src="/images/registration.png" alt="Register icon" /></a>
                <p>Register</p>
            </div>

            <div class="menu log">
                <img src="/images/log.png" alt="Activity Log icon" />
                <p>Log</p>
            </div>
        </div>

        <div class="main-panel">
            <h1>Activity Log</h1>

            <div class="log-field">
                <div class="header-row">
                    <div class="col-date">
                        <p>Date and Time &#8593;</p>
                    </div>
                    
                    <div class="col-user">
                        <p>User</p>
                    </div>

                    <div class="col-type">
                        <p>User Type</p>
                    </div>
                    
                    <div class="col-act">
                        <p>Activity</p>
                    </div>
                </div>

                <div class="log-row">
                    <div class="col-date">
                        <p>2026-06-03 | 06:31:12</p>
                    </div>

                    <div class="col-user">
                        <p>Jason Doe</p>
                    </div>

                    <div class="col-type">
                        <p>Admin</p>
                    </div>

                    <div class="col-act">
                        <p>Register donor (John Doe)</p>
                    </div>
                </div>
                
                <div class="log-row">
                    <div class="col-date">
                        <p>2026-06-03 | 06:32:10</p>
                    </div>

                    <div class="col-user">
                        <p>John Doe</p>
                    </div>

                    <div class="col-type">
                        <p>Donor</p>
                    </div>

                    <div class="col-act">
                        <p>Check in</p>
                    </div>
                </div>

                <div class="log-row">
                    <div class="col-date">
                        <p>2026-06-03 | 06:34:27</p>
                    </div>

                    <div class="col-user">
                        <p>John Doe</p>
                    </div>

                    <div class="col-type">
                        <p>Donor</p>
                    </div>

                    <div class="col-act">
                        <p>Claim sponsor perk (004)</p>
                    </div>
                </div>

                <div class="log-row">
                    <div class="col-date">
                        <p>2026-06-03 | 07:01:45</p>
                    </div>

                    <div class="col-user">
                        <p>Jane Doe</p>
                    </div>

                    <div class="col-type">
                        <p>Internal Staff</p>
                    </div>

                    <div class="col-act">
                        <p>Update donor data (John Doe)</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="right-panel"></div>
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

    .log-page {
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

    .main-panel {
        width: 15in;
        background-color: #f9fdff;
        padding: 0.5in;

        display: flex;
        flex-direction: column;
        gap: 0.5in;
    }

    .main-panel h1 {
      display: inline;
      background-color: #c15555;
      font-size: 56px;
      color: #f9fdff;
      padding: 0.25in;
    }

    .log-field {
      display: flex;
      flex-direction: column;
    }

    .header-row {
      display: flex;
      flex-direction: row;
      padding-top: 0.125in;
      padding-bottom: 0.125in;
      padding-left: 0.25in;
      padding-right: 0.25in;
      font-size: 30px;
      font-weight: bold;
      border-top: 7.5px solid #8a2d2d;
      border-bottom: 7.5px solid #8a2d2d;
    }

    .col-date {
      width: 4in;
    }

    .col-user, .col-type {
      width: 3in;
    }

    .col-act {
      flex: 1;
    }

    .log-row {
      display: flex;
      flex-direction: row;
      padding-top: 0.125in;
      padding-bottom: 0.125in;
      padding-left: 0.25in;
      padding-right: 0.25in;
      font-size: 24px;
      border-bottom: 5px solid #8a2d2d;
    }

    .right-panel {
      flex: 1;
      background-color: #c15555;
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