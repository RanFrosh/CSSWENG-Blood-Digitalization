<script lang="ts">
    import { goto } from '$app/navigation';

    function goToView() {
        const view = prompt("Type 1 for admin, 2 for int. staff, 3 for RB director.");

        if (view === '1') { goto('/log'); }
        else if (view === '2') { goto('/search'); }
        else { goto('/analytics'); }
    }
</script>

<svelte:head>
  <title>Landing Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="landing-page">
    <div class="banner">
        <div class="banner-content">
            <img src="/images/logo.png" alt="Red Bank Foundation Logo" />
            <div class="webname">
                <h1>Red Bank Foundation</h1>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div class="margin"></div>

        <div class="left-panel">
            <h1>Welcome!</h1>

            <div class="login-field">
                <label for="uname">Username:</label>
                <input type="text" class="uname">
                <label for="pass">Password:</label>
                <input type="password" class="pass">

                <div class="forgot-pass">
                    <p>Forgot password?</p>
                </div>
            </div>

            <div class="button-field">
                <button class="btn login" onclick={goToView}>Log in</button>
                <button class="btn signup">Sign up &#8594;</button>
            </div>
        </div>

        <div class="main-panel">
            <div class="event-field">
                <div class="header">
                    <h1 class="headline">A small act, 
                        <br>
                        a lifesaving impact.
                    </h1>
                </div>

                <div class="event-list">
                    <div class="event">
                        <div class="event-img">
                            <img src="/images/event.png" alt="event placeholder" />
                        </div>
                        
                        <div class="event-details">
                            <h3>Event title</h3>
                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Learn more."</p>
                        </div>
                    </div>

                    <div class="event">
                        <div class="event-img">
                            <img src="/images/event.png" alt="event placeholder" />
                        </div>
                        
                        <div class="event-details">
                            <h3>Event title</h3>
                            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Learn more."</p>
                        </div>
                    </div>
                    
                </div>

                <div class="carousel">
                    <img src="/images/carousel.png" alt="fake carousel indicators" />
                </div>
            </div>

            <div class="image-field">
                <img src="/images/blood.png" alt="blood bag" />
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-content">
            <p>additional text info like copyright etc</p>
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

    .landing-page {
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

    .webname h1 {
        font-size: 30;
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
        height: 100%;
        width: 1in;
        background-color: #c15555;
    }

    .left-panel {
        height: auto;
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

    .login-field {
        font-size: 18px;
        display: flex;
        flex-direction: column;
    }

    .login-field label {
        margin-bottom: 5px;
    }

    .login-field input {
        width: 3in;
    }

    .uname {
        margin-bottom: 15px;
    }

    .forgot-pass {
        font-size: 12px;
        color: #8a2d2d;
        width: 3in;
        text-align: end;
    }

    .forgot-pass p {
        display: inline;
    }

    .forgot-pass p:hover {
        text-decoration: underline;
    }

    .button-field {
        width: 3in;
        display: flex;
        flex-direction: row;
        gap: 0.25in;
    }

    .btn {
        width: 1in;
        background-color: #8a2d2d;
        color: #f9fdff;
        padding: 5px;
        border-radius: 10px;
    }

    .btn:hover {
        text-decoration: underline;
    }

    .main-panel {
        flex: 1;
        background-color: #c15555;
        padding: 0.75in;
        padding-right: 0.25in;
        display: flex;
        flex-direction: row;
        gap: 0.5in;
    }

    .event-field {
        width: 8.5in;
        display: flex;
        flex-direction: column;
        gap: 0.5in;
    }

    .headline {
        color: #f9fdff;
        font-size: 56px;
    }

    .event-list {
        width: 8in;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .event {
        height: 1in;
        padding: 0.25in;
        background-color: #f9fdff;
        display: flex;
        flex-direction: row;
        gap: 0.25in;
    }

    .event-img img {
        height: 1in;
    }

    .event-details {
        display: flex;
        flex-direction: column;
        gap: 0.125in;
    }

    .event-details h3 {
        font-weight: bold;
    }

    .event-details p {
        text-align: justify;
    }

    .carousel {
        width: 8in;
        margin-top: -0.5in;
        display: flex;
        justify-content: center;
    }

    .carousel img {
        height: 1in;
    }

    .image-field {
        width: 4in;
        overflow: hidden;
    }

    .image-field img {
        height: 100%;
        width: 100%;
        object-fit: cover;
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