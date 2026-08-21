// IndexNow Submission Script for Zafoor Clinic
// Pings IndexNow (Bing, Yandex, Seznam, Naver) for instant crawl indexing.

const HOST = "zafoorclinic.com";
const KEY = "e58d927a421b4a3a8e7e23114d2e8b91";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const URL_LIST = [`https://${HOST}/`];

async function pingIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST,
  };

  console.log("📡 [IndexNow] Submitting URLs to api.indexnow.org...");

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ [IndexNow] Success! Status: ${response.status} ${response.statusText}`);
    } else {
      console.warn(`⚠️ [IndexNow] Response: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error("❌ [IndexNow] Ping failed:", err.message);
  }
}

pingIndexNow();
