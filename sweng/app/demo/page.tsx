"use client";

import { addTestDonor } from "@/app/back/donor_actions/add_test_donor"; // Adjust path if needed

export default function DemoPage() {
  
  const handleAddDonor = async () => {
    alert("🚀 Firing payload to the backend engine... Check your VS Code Terminal!");
    const response = await addTestDonor();
    
    if (response.success) {
      alert("✅ Success! Donor added to Supabase. Check your Table Editor!");
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>🩸 Blood Digitalization System — Sprint 1 Backend Demo Launchpad</h1>
      <p>This is a headless testing environment. No CSS allowed.</p>
      
      <hr style={{ margin: "20px 0" }} />

      <div style={{ display: "flex", gap: "20px" }}>
        {/* BUTTON 1: THE INJECTION */}
        <button 
          onClick={handleAddDonor}
          style={{
            padding: "15px 25px",
            fontSize: "16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ⚡ Run: Add Test Donor (Diogo Jota)
        </button>

        {/* You can add more buttons here later for your other actions! */}
      </div>
    </div>
  );
}