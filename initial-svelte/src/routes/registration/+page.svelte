<script lang="ts">
    import { goto } from "$app/navigation";
    
    function goHome() {
        goto('/landing');
    }

    function openScanner() {
        alert('Donor registered!');
        goto('/scanner');
    }
</script>

<svelte:head>
    <title>Activity Log</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="regis-page">
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
                <img src="/images/registration.png" alt="Register icon" />
                <p>Register</p>
            </div>

            <div class="menu log">
                <a href="/log"><img src="/images/log.png" alt="Activity Log icon" /></a>
                <p>Log</p>
            </div>
        </div>

        <div class="main-panel">
            <h1>Donor Registration</h1>

            <div class="registration-field">
                <div class="reg-row">
                    <div class="reg-req">
                        <label for="fname">First Name:</label>
                        <input type="text" class="req-name">
                    </div>

                    <div class="reg-req">
                        <label for="mname">Middle Name:</label>
                        <input type="text" class="req-name">
                    </div>

                    <div class="reg-req">
                        <label for="lname">Last Name:</label>
                        <input type="text" class="req-name">
                    </div>
                </div>

                <div class="reg-row">
                    <div class="reg-req">
                        <label for="al1">Address Line 1:</label>
                        <input type="text" class="req-add" placeholder="House number, Building, Street number, Street name">
                    </div>

                    <div class="reg-req">
                        <label for="al2">Address Line 2:</label>
                        <input type="text" class="req-add" placeholder="Subdivision/Village, Barangay">
                    </div>
                </div>
                
                <div class="reg-row">
                    <div class="reg-req">
                        <label for="city">City:</label>
                        <input type="text" class="req-loc">
                    </div>

                    <div class="reg-req">
                        <label for="prov">Province:</label>
                        <input type="text" class="req-loc">
                    </div>

                    <div class="reg-req">
                        <label for="zip">Zip Code:</label>
                        <input type="text" class="req-loc">
                    </div>
                </div>

                <div class="reg-row">
                    <div class="reg-req">
                        <label for="email">Email Address:</label>
                        <input type="text" class="req-con">
                    </div>

                    <div class="reg-req">
                        <label for="num">Mobile Number:</label>
                        <input type="text" class="req-con">
                    </div>

                    <div class="reg-req">
                        <label for="opt-row">Sex:</label>

                        <div class="opt-row">
                            <div class="opt-rad">
                                <input type="radio" name="sex" id="male" value="male" class="req-sex">
                                <label for="male">male</label>
                            </div>

                            <div class="opt-rad">
                                <input type="radio" name="sex" id="female" value="female" class="req-sex">
                                <label for="female">female</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="reg-row">
                    <div class="reg-req">
                        <label for="bld-opt">Blood Type:</label>

                        <div class="bld-opt">
                            <div class="opt-row">
                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="O+" value="O+" class="req-bld">
                                    <label for="O+">O+</label>
                                </div>

                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="A+" value="A+" class="req-bld">
                                    <label for="A+">A+</label>
                                </div>

                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="B+" value="B+" class="req-bld">
                                    <label for="B+">B+</label>
                                </div>

                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="AB+" value="AB+" class="req-bld">
                                    <label for="AB+">AB+</label>
                                </div>
                            </div>

                            <div class="opt-row">
                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="O-" value="O-" class="req-bld">
                                    <label for="O-">O-</label>
                                </div>

                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="A-" value="A-" class="req-bld">
                                    <label for="A-">A-</label>
                                </div>

                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="B-" value="B-" class="req-bld">
                                    <label for="B-">B-</label>
                                </div>

                                <div class="opt-rad">
                                    <input type="radio" name="blood" id="AB-" value="AB-" class="req-bld">
                                    <label for="AB-">AB-</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-field">
                <button class="btn regis" onclick={openScanner}>Register Donor</button>
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

    .regis-page {
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

    .registration-field {
      display: flex;
      flex-direction: column;
      gap: 0.5in;
    }

    .reg-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 0.5in;
        font-size: 28px;
    }

    .reg-req {
        display: flex;
        flex-direction: row;
        gap: 0.125in;
        font-size: 28px;
    }

    .reg-req input {
        padding-left: 0.125in;
    }

    .req-name {
        width: 2.5in
    }

    .req-loc, .req-con {
        width: 3in;
    }

    .req-add {
        width: 5in;
    }

    .bld-opt {
        display: flex;
        flex-direction: column;
        gap: 0.125in;
    }

    .opt-row {
        display: flex;
        flex-direction: row;
        gap: 0.25in;
    }

    .opt-rad {
        display: flex;
        flex-direction: row;
        gap: 0.125in;
    }

    .button-field {
        display: flex;
    }

    .btn {
      width: 2in;
      background-color: #8a2d2d;
      color: #f9fdff;
      font-size: 21px;
      padding: 5px;
      border-radius: 10px;
      margin-left: auto;
    }

    .btn:hover {
      text-decoration: underline;
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