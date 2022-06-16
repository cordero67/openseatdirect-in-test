// THIS LOOKS GOOD EXCEPT FOR FREE YEAR PLAN ID
// UPDATE WHEN A NEW PLAN IS INTRODUCED
import { PAYPAL_USE_SANDBOX } from "../../config";

export const SubscriptionPlans = () => {
  let plans;

  if (PAYPAL_USE_SANDBOX === true) {
    // PRODUCTION subscription plans (there are no Sandbox plans)
    plans = {
      monthly: {
        name: "$15 monthly",
        id: "P-5DT364104U926810EL5FRXSY", // Bondirectly PayPal Sandbox subscription
      },
      annually: {
        name: "$169 annually",
        id: "P-5YA13382D9271245EL5FRXTA", // Bondirectly PayPal Sandbox subscription
      },
      monthlyDiscounted: {
        name: "$15 monthly: 6 weeks free",
        id: "P-5DT364104U926810EL5FRXSY", // Bondirectly PayPal Sandbox subscription
      },
      annuallyDiscounted: {
        name: "$149 annually: discounted",
        id: "P-5YA13382D9271245EL5FRXTA", // Bondirectly PayPal Sandbox subscription
      },
      monthlyFreeTrial: {
        name: "$15 monthly: 3 months free",
        id: "P-3U3085871T847894PL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annualGrowPR: {
        name: "$169 annually: $149 first year",
        id: "P-3U3085871T847894PL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annualFiftyPercent: {
        name: "$169 annually: $84.50 first year",
        id: "P-3U3085871T847894PL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annuallyOldPrice: {
        name: "$70 annually",
        id: "P-6UY26644UT426184FL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annuallyOldPriceDiscounted: {
        name: "$50 annually",
        id: "P-3YH13849H69051131MAIHPGY", // Bondirectly PayPal Sandbox subscription
      },
      freeSubscription: {
        name: "1 YEAR FREE SUBSCRIPTION",
        id: "", // OSD PayPal Production subscription
      },
      clientId:
        "AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7", // Bondirectly PayPal Sandbox ClientId
    };
  } else {
    // PRODUCTION subscription plans
    plans = {
      monthly: {
        name: "$15 monthly",
        id: "P-3E209303AY287713HMDN3PLQ", // OSD PayPal Production subscription
      },
      annually: {
        name: "$169 annually",
        id: "P-9P586954FE0229727MDN3RMQ", // OSD PayPal Production subscription
      },
      monthlyDiscounted: {
        name: "$15 monthly: 6 weeks free",
        id: "P-3MM32159H2853152CMDN3T6Q", // OSD PayPal Production subscription
      },
      annuallyDiscounted: {
        name: "$149 annually: discounted",
        id: "P-41592191WY6636644MDN3VOY", // OSD PayPal Production subscription
      },
      monthlyFreeTrial: {
        name: "$15 monthly: 3 months free",
        id: "P-0VY95999WV5246104MDOLPKI", // OSD PayPal Production subscription
      },
      annualGrowPR: {
        name: "$169 annually: $149 first year",
        id: "P-8T757325FM2761033MF5677Y", // Bondirectly PayPal Sandbox subscription
      },
      annualFiftyPercent: {
        name: "$169 annually: $84.50 first year",
        id: "P-9JU02589EP1173940MJALTXA", // Bondirectly PayPal Sandbox subscription
      },
      annuallyOldPrice: {
        name: "$70 annually",
        id: "P-2K587859D1613454MMDOIAHA", // OSD PayPal Production subscription
      },
      annuallyOldPriceDiscounted: {
        name: "$50 annually",
        id: "P-74091125HK783123JMDOLLEA", // OSD PayPal Production subscription
      },
      freeSubscription: {
        name: "1 YEAR FREE SUBSCRIPTION",
        id: "", // OSD PayPal subscription
      },
      clientId:
        "ATOAhgR1qrhz7xQRVHyyyBnj73Ckga6swyGU-8gxFhyJRrkZgEYzaUhTwQx3BmF71lM-oiJC9VelNZDw", // OSD PayPal Production ClientId
    };
  }

  return plans;
};
