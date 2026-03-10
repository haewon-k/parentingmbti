interface VerifyResponse {
  success: boolean;
  uses: number;
  purchase: {
    email: string;
    product_id: string;
    sale_timestamp: string;
  }
}

// In a real app, you might proxy this through a serverless function to hide the Gumroad Product Permalink/ID if sensitive,
// or use the Gumroad API directly if CORS allows (it often requires backend proxy).
// For this standalone demo, we simulate the verification or attempt a fetch if configured.

export const gumroadService = {
  verifyLicense: async (productPermalink: string, licenseKey: string): Promise<{ success: boolean; email?: string, productId?: string }> => {
    
    // DEMO MODE: If the license key starts with "DEMO-", we bypass API and succeed.
    if (licenseKey.startsWith("DEMO-")) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            email: "demo_user@example.com", 
            productId: "prod_entp" // defaulting to ENTP for demo
          });
        }, 1500);
      });
    }

    // Real API implementation structure (would require a proxy in production due to CORS usually)
    try {
      const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_permalink: productPermalink,
          license_key: licenseKey
        })
      });
      
      const data: VerifyResponse = await response.json();
      if (data.success) {
        return { success: true, email: data.purchase.email, productId: data.purchase.product_id };
      }
      return { success: false };
    } catch (e) {
      console.error("Gumroad Verification Failed (Network/CORS)", e);
      // Fallback for "Network Error" in this demo context
      return { success: false };
    }
  }
};