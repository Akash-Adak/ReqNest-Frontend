// src/pages/Plans.jsx
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function Plans() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ✅ Get email from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const email = loggedInUser?.email || "user@example.com";

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true);
      setSelectedPlan(plan);

      // ---- 1. Create order ----
      const res = await fetch("http://localhost:8080/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: plan === "PREMIUM" ? 499 : 4999, // plan pricing in rupees
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      // ---- 2. Open Razorpay Checkout ----
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "ReqNest API Service",
        description: `${plan} Plan Subscription`,
        order_id: order.orderId,
        handler: async function (response) {
          // ---- 3. Verify payment ----
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
            alert("🎉 Payment successful! Plan upgraded.");
            window.location.reload();
          } else {
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      alert(err.message);
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
        "30-day data retention"
      ],
      cta: "Current Plan",
      popular: false,
      disabled: true
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
        "Basic analytics"
      ],
      cta: "Upgrade to Premium",
      popular: true,
      disabled: false
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
        "Team management"
      ],
      cta: "Upgrade to Enterprise",
      popular: false,
      disabled: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Select the perfect plan for your API needs. Start free, upgrade anytime.
          </p>
          
          {/* Show logged-in email */}
          {email && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
              Logged in as <span className="font-semibold ml-1">{email}</span>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                plan.popular ? "ring-2 ring-indigo-500 transform scale-105" : ""
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                
                {/* Price */}
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    {plan.priceDesc}
                  </span>
                </div>
                
                {/* Description */}
                <p className="mt-4 text-gray-600">{plan.desc}</p>

                {/* Features list */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-6 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                      <span className="ml-3 text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <button
                  onClick={() => !plan.disabled && handleUpgrade(plan.id)}
                  disabled={plan.disabled || loading}
                  className={`w-full rounded-lg px-6 py-4 text-center text-sm font-semibold leading-4 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    plan.disabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md"
                      : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
                  } ${
                    loading && selectedPlan === plan.id ? "opacity-75 cursor-wait" : ""
                  }`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I change plans anytime?</h3>
              <p className="mt-2 text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Is there a free trial?</h3>
              <p className="mt-2 text-gray-600">All paid plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-gray-600">We accept all major credit cards, debit cards, UPI, and net banking through our secure payment gateway.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I get a refund?</h3>
              <p className="mt-2 text-gray-600">We offer a 30-day money-back guarantee on all annual plans. Monthly plans can be canceled anytime.</p>
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">Need help choosing a plan?</p>
          <a href="#" className="mt-2 inline-block text-indigo-600 font-medium hover:text-indigo-500">
            Contact our sales team →
          </a>
        </div>
      </div>
    </div>
  );
}