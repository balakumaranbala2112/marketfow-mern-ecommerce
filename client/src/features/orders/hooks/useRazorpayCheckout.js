import { useCallback, useRef } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function isRazorpayLoaded() {
  return typeof window !== "undefined" && typeof window.Razorpay === "function";
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay SDK")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));

    document.body.appendChild(script);
  });
}

/**
 * Custom hook for opening the Razorpay checkout modal.
 *
 * Returns `openRazorpayCheckout(options)` which:
 *   1. Loads the Razorpay SDK script (cached after first load)
 *   2. Opens the checkout modal
 *   3. Resolves with payment details on success
 *   4. Rejects with failure/dismissal details
 */
export function useRazorpayCheckout() {
  const razorpayRef = useRef(null);

  const openRazorpayCheckout = useCallback(
    ({
      keyId,
      orderId,
      amount,
      currency,
      orderName = "MarketFlow Order",
      description = "Complete your purchase",
      prefill = {},
    }) => {
      return new Promise(async (resolve, reject) => {
        try {
          await loadRazorpayScript();
        } catch {
          reject({
            reason: "Razorpay SDK failed to load. Please check your internet connection.",
          });
          return;
        }

        const options = {
          key: keyId,
          amount,
          currency,
          name: orderName,
          description,
          order_id: orderId,
          prefill: {
            name: prefill.name || "",
            email: prefill.email || "",
            contact: prefill.phone || "",
          },

          handler(response) {
            resolve({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },

          modal: {
            ondismiss() {
              reject({
                reason: "Payment cancelled by user",
                dismissed: true,
              });
            },
            escape: true,
            confirm_close: true,
          },

          theme: {
            color: "#495663",
          },
        };

        try {
          const rzp = new window.Razorpay(options);

          rzp.on("payment.failed", (response) => {
            reject({
              reason:
                response.error?.description ||
                response.error?.reason ||
                "Payment failed",
              razorpay_order_id: response.error?.metadata?.order_id || orderId,
              razorpay_payment_id:
                response.error?.metadata?.payment_id || "",
            });
          });

          razorpayRef.current = rzp;
          rzp.open();
        } catch {
          reject({ reason: "Failed to initialize Razorpay checkout" });
        }
      });
    },
    [],
  );

  return { openRazorpayCheckout };
}
