// src/pages/Plans.jsx
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";

export default function Plans() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ✅ Get logged in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const email = loggedInUser?.email || "user@example.com";
  const currentTier = loggedInUser?.tier || "FREE";

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true);
      setSelectedPlan(plan);

      const res = await fetch("http://localhost:8080/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: plan === "PREMIUM" ? 499 : 4999,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "ReqNest API Service",
        description: `${plan} Plan Subscription`,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("http://localhost:8080/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: email,
                plan,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              toast.success(`🎉 Payment successful! Upgraded to ${plan} plan.`);

              // ✅ Update localStorage user with new tier
              const updatedUser = { ...loggedInUser, tier: plan };
              localStorage.setItem("user", JSON.stringify(updatedUser));

              setTimeout(() => window.location.reload(), 1500);
            } else {
              toast.error("❌ Payment verification failed");
            }
          } catch (err) {
            toast.error(err.message);
          }
        },
        prefill: { email },
        theme: { color: "#4f46e5" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const plans = [
    {
      id: "FREE",
      name: "Free",
      price: "₹0",
      priceDesc: "forever",
      desc: "Perfect for getting started",
      features: [
        "100 requests/day",
        "Basic API testing",
        "Community support",
        "1 workspace",
        "30-day data retention",
      ],
    },
    {
      id: "PREMIUM",
      name: "Premium",
      price: "₹499",
      priceDesc: "per month",
      desc: "For individuals and small teams",
      features: [
        "10,000 requests/month",
        "Advanced API testing",
        "Priority email support",
        "5 workspaces",
        "90-day data retention",
        "Basic analytics",
      ],
      popular: true,
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise",
      price: "₹4999",
      priceDesc: "per month",
      desc: "For companies with high usage",
      features: [
        "1M requests/month",
        "Unlimited API testing",
        "24/7 dedicated support",
        "Unlimited workspaces",
        "1-year data retention",
        "Advanced analytics",
        "Custom SLAs",
        "Team management",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Select the perfect plan for your API needs. Start free, upgrade anytime.
          </p>

          {email && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              Logged in as <span className="font-semibold ml-1">{email}</span> ·{" "}
              <span className="ml-1">Current Plan: {currentTier}</span>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentTier;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                  plan.popular ? "ring-2 ring-indigo-500 transform scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">
                      {plan.priceDesc}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-600">{plan.desc}</p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-6 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => !isCurrent && handleUpgrade(plan.id)}
                    disabled={isCurrent || loading}
                    className={`w-full rounded-lg px-6 py-4 text-center text-sm font-semibold leading-4 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                      isCurrent
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md"
                        : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
                    } ${loading && selectedPlan === plan.id ? "opacity-75 cursor-wait" : ""}`}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : isCurrent ? (
                      "✅ Current Plan"
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
