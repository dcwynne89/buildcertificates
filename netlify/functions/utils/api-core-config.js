/* BuildCertificates — API core configuration */
const { createApiCore } = require("../../../shared/api-core");

const api = createApiCore({
  keyPrefix: "bcrt_",
  quotaField: "certsPerMonth",
  maxBodyBytes: 10 * 1024 * 1024,
  maxRegistrationsPerHour: 3,
  quotaMessage: "Monthly certificate limit reached.",
  upgradeUrl: "https://buildcertificates.com/api/docs#pricing",
  enableRateLimiter: false,
  defaultCountUsage: false,
  tiers: {
    free:     { name: "Free",     certsPerMonth: 25,    maxFileSizeMB: 2,  ratePerMinute: 5,   watermark: true,  bulkEnabled: false, bulkMax: 0,   templates: ["elegant", "modern", "formal"] },
    starter:  { name: "Starter",  certsPerMonth: 500,   maxFileSizeMB: 10, ratePerMinute: 30,  watermark: false, bulkEnabled: true,  bulkMax: 50,  templates: ["elegant", "modern", "formal"] },
    pro:      { name: "Pro",      certsPerMonth: 5000,  maxFileSizeMB: 25, ratePerMinute: 150, watermark: false, bulkEnabled: true,  bulkMax: 100, templates: ["elegant", "modern", "formal"] },
    business: { name: "Business", certsPerMonth: 25000, maxFileSizeMB: 50, ratePerMinute: 500, watermark: false, bulkEnabled: true,  bulkMax: 500, templates: ["elegant", "modern", "formal"] },
  },
});

module.exports = api;
