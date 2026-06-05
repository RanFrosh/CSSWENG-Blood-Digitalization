<script lang="ts">
    import { goto } from "$app/navigation";
    
    function goHome() {
        goto('/landing');
    }

    function openProfile() {
        goto('/profile');
    }
</script>

<svelte:head>
    <title>Donor Search</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="search-page">
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
                <img src="/images/search.png" alt="Search icon" />
                <p>Search</p>
            </div>

            <div class="menu events">
                <img src="/images/planner.png" alt="Event planner icon" />
                <p>Events</p>
            </div>
        </div>

        <div class="main-panel">
            <h1>Donor Search</h1>

            <div class="search-field">
                <div class="search-row">
                    <div class="search-box">
                        <img class="search-img" src="/images/search.png" alt="Search button icon" />
                        <input type="text" class="search-in" placeholder="Input donor name">
                    </div>

                    <button class="btn search">Search</button>
                </div>

                <div class="search-results">
                    <div class="res-row">
                        <button class="donor-res don-btn" onclick={openProfile}>
                            <div class="donor-img">
                                <img src="/images/user.png" alt="User icon" />
                            </div>

                            <div class="donor-details">
                                <h3>John Doe</h3>
                                <p>john_doe@gmail.com</p>
                            </div>
                        </button>

                        <div class="donor-res">
                            <div class="donor-img">
                                <img src="/images/user.png" alt="User icon" />
                            </div>

                            <div class="donor-details">
                                <h3>Janet Doe</h3>
                                <p>janet_doe@gmail.com</p>
                            </div>
                        </div>

                        <div class="donor-res">
                            <div class="donor-img">
                                <img src="/images/user.png" alt="User icon" />
                            </div>

                            <div class="donor-details">
                                <h3>Jeanne Doe</h3>
                                <p>jeanne_doe@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div class="res-row">
                        <div class="donor-res">
                            <div class="donor-img">
                                <img src="/images/user.png" alt="User icon" />
                            </div>

                            <div class="donor-details">
                                <h3>Julian Doe</h3>
                                <p>julian_doe@gmail.com</p>
                            </div>
                        </div>

                        <div class="donor-res">
                            <div class="donor-img">
                                <img src="/images/user.png" alt="User icon" />
                            </div>

                            <div class="donor-details">
                                <h3>Jonah Doe</h3>
                                <p>jonah_doe@gmail.com</p>
                            </div>
                        </div>

                        <div class="donor-res">
                            <div class="donor-img">
                                <img src="/images/user.png" alt="User icon" />
                            </div>

                            <div class="donor-details">
                                <h3>Janice Doe</h3>
                                <p>janice_doe@gmail.com</p>
                            </div>
                        </div>
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

    .search-page {
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

    .search-field {
      display: flex;
      flex-direction: column;
      gap: 0.5in;
    }

    .search-row {
      display: flex;
      flex-direction: row;
      gap: 0.5in;
    }

    .search-box {
      position: relative;
    }

    .search-img {
      position: absolute;
      left: 0.125in;
      top: 7.5px;
      height: 0.25in;
    }

    .search-in {
      width: 5in;
      font-size: 30px;
      padding-left: 0.5in;
    }

    .btn {
      width: 1in;
      background-color: #8a2d2d;
      color: #f9fdff;
      font-size: 21px;
      padding: 5px;
      border-radius: 10px;
    }

    .btn:hover {
      text-decoration: underline;
    }

    .search-results {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .res-row {
      height: 1.5in;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    
    .don-btn {
        border: none;
        background: none;
        padding: 0;
        font: inherit;
        text-align: left;
    }

    .donor-res {
      height: 1.25in;
      width: 4.5in;
      background-color: #c15555;
      border-radius: 20px;
      display: flex;
      flex-direction: row;
      gap: 0.25in;
    }

    .donor-res:hover {
      transform: scale(1.0625);
    }

    .donor-img img {
      height: 1in;
      padding-left: 0.125in;
      padding-top: 0.125in;
      display: flex;
    }

    .donor-details {
      display: flex;
      flex-direction: column;
      align-self: center;
      gap: 7.5px;
    }

    .donor-details h3 {
      color: #f9fdff;
      font-size: 28px;
      font-weight: bold;
    }

    .donor-details p {
      color: #f9fdff;
      font-size: 21px;
      text-align: justify;
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

