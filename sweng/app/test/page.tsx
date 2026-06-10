"use client";

export default function TestPage() {
  const registerDonor = async () => {
    const response = await fetch("/api/donors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: "Mei",
        middleName: "Marie",
        lastName: "Laufey",
        addressLine1: "123 Sample St",
        city: "1",
        province: "Metro Manila",
        zipCode: "1000",
        email: "meimei44@example.com",
        mobileNumber: "09123471209",
        sex: "Female",
        bloodType: "O+",
      }),
    });

    const data = await response.json();
    console.log(data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Donor API Test</h1>

      <button onClick={registerDonor}>
        Register Test Donor
      </button>
    </div>
  );
}