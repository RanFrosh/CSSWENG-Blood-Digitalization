"use client";

import { addTestDonor } from "@/app/back/donor_actions/add_test_donor"; // Double check this path
import { deleteDonors } from "@/app/back/donor_actions/toggle_donor"; // Double check this path

export default function DemoPage() {
  
  const handleAddDonor = async () => {
    const response = await addTestDonor();
    if (response.success) {
      alert("✅ Success! Donor injected.");
    } else {
      alert(`❌ Error: ${response.error}`);
    }
  };

  const handleToggleDonor = async () => {
    alert("🔄 Firing soft delete for Donor ID 8...");
    const response = await deleteDonors([8], 'soft'); 
    
    if (response?.success) {
      alert(`✅ Success: ${response.message}`);
    } else {
      alert(`❌ Error: ${response?.message}`);
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "sans-serif", 
      color: "#000000",       // Forces text to be visible
      backgroundColor: "#ffffff", // Forces background to be white
      minHeight: "100vh" 
    }}>
      <h1>🩸 Blood Digitalization System — Sprint 1 Backend Demo Launchpad</h1>
      <p>This is a headless testing environment. No CSS allowed.</p>
      
      <hr style={{ margin: "20px 0", borderColor: "#ccc" }} />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* BUTTON 1: CREATE */}
        <button onClick={handleAddDonor} style={buttonStyle("#0070f3")}>
          ⚡ Run: Add Test Donor (Diogo Jota)
        </button>

        {/* BUTTON 2: UPDATE (Soft Delete) */}
        <button onClick={handleToggleDonor} style={buttonStyle("#f59e0b")}>
          🔄 Run: Soft Delete Donor (ID: 1)
        </button>
      </div>
    </div>
  );
}

// Reusable style helper
const buttonStyle = (bgColor: string) => ({
  padding: "15px 25px",
  fontSize: "16px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
});