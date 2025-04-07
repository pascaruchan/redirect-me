import type { Rule, RuleStorage } from "./types";

// Cache for rules
let cachedRules: Rule[] = [];

// Update cache when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.rules) {
    cachedRules = changes.rules.newValue;
  }
});

// Initialize cache
chrome.storage.local.get(null, (storage) => {
  const ruleStorage = storage as RuleStorage;
  cachedRules = ruleStorage.rules;
});

// Initialize storage with default rules
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated, initializing storage");
  const defaultStorage: RuleStorage = {
    rules: []
  };
  chrome.storage.local.set(defaultStorage);
});

// Listen for web requests
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Skip non-HTTP(S) requests
    if (!details.url.startsWith("http")) {
      console.log("Skipping non-HTTP request:", details.url);
      return;
    }

    console.log("Processing request for URL:", details.url);

    const activeRules = cachedRules.filter(rule => rule.isActive);
    console.log(`Found ${activeRules.length} active rules`);

    // Check each rule
    for (const rule of activeRules) {
      console.log(`Checking rule with pattern: ${rule.inputPattern}`);
      const regex = new RegExp(rule.inputPattern);
      const match = details.url.match(regex);

      if (match) {
        console.log("Rule matched! Capture groups:", match.slice(1));

        // Apply transformations to capture groups
        const transformedGroups = match.slice(1).map((group, index) => {
          const transformations = rule.transformationRules.filter(t => t.target === index + 1);
          let result = group;
          console.log(`Processing transformations for group ${index + 1}:`, group);

          for (const transform of transformations) {
            console.log(`Applying transformation:`, transform);
            switch (transform.type) {
              case "ReplaceAll":
                result = result.replaceAll(transform.searchValue, transform.replaceValue);
                break;
              case "ReplaceOne":
                result = result.replace(transform.searchValue, transform.replaceValue);
                break;
              case "UrlEncode":
                result = encodeURIComponent(result);
                break;
              case "UrlDecode":
                result = decodeURIComponent(result);
                break;
            }
            console.log(`Transformed result:`, result);
          }

          return result;
        });

        // Construct new URL using output pattern
        let newUrl = rule.outputPattern;
        transformedGroups.forEach((group, index) => {
          newUrl = newUrl.replace(`$${index + 1}`, group);
        });
        console.log("Final transformed URL:", newUrl);

        // Return the redirect URL
        console.log("Redirecting to:", newUrl);
        return { redirectUrl: newUrl };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
