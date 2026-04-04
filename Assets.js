function getUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId =
      "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", userId);
  }
  return userId;
}

const userId = getUserId();
let myAssets = JSON.parse(localStorage.getItem("myGoldAssets_" + userId)) || [];
let goldPrice = null;

async function initGoldPrice() {
  const stored = localStorage.getItem("goldPrice");
  if (stored) {
    goldPrice = Number(stored);
  }
  await fetchGoldPrice();
}

async function fetchGoldPrice() {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU");
    const data = await res.json();
    goldPrice = data.price;
    localStorage.setItem("goldPrice", goldPrice);
    calculateAndDisplayPortfolio();
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
    goldPrice = Number(localStorage.getItem("goldPrice"));
    calculateAndDisplayPortfolio();
  }
}

function getGoldPrice() {
  return goldPrice;
}

function getGramPrice(karat) {
  const ounce = getGoldPrice();
  if (!ounce) return null;
  const gram24 = ounce / 31.1035;
  const karatNumber = parseInt(karat);
  return gram24 * (karatNumber / 24);
}

function calculateAndDisplayPortfolio() {
  const assetsGrid = document.getElementById("assetsGrid");
  const totalBalanceEl = document.querySelector(".display-3");
  if (!assetsGrid || !getGoldPrice()) return;

  assetsGrid.innerHTML = "";
  let totalCurrentValue = 0;

  myAssets.forEach((asset) => {
    const currentGramPrice = getGramPrice(asset.karat);
    const weightNum = parseFloat(asset.weight); // ✅ رقم نظيف
    const currentAssetValue = currentGramPrice * weightNum;
    const purchasePrice = parseFloat(asset.price); // ✅ رقم نظيف بدون $
    const profitLoss = currentAssetValue - purchasePrice;
    const profitPercent = ((profitLoss / purchasePrice) * 100).toFixed(2); // ✅ نسبة الربح/الخسارة
    const isProfit = profitLoss >= 0;
    totalCurrentValue += currentAssetValue;

    assetsGrid.innerHTML += `
      <div class="col-lg-4 col-md-6">
        <div class="asset-square-card">
          <div class="d-flex justify-content-between">
            <div style="font-size: 1.5rem;">📀</div>
            <span class="karat-badge">${asset.karat}</span>
          </div>
          <div class="mt-3">
            <h5 class="mb-1 fw-bold">${asset.name}</h5>
            <p class="small mb-0" style="opacity: 0.7">${weightNum}g / Gold Content</p>
          </div>
          <div class="d-flex justify-content-between align-items-end mt-4">
            <div>
              <h4 class="price-text m-0">$${currentAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <small style="font-size:0.7rem; opacity:0.5;">Bought at: $${purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</small>
            </div>
            <div class="text-end">
              <span class="${isProfit ? "profit" : "loss"}">
                ${isProfit ? "▲" : "▼"} $${Math.abs(profitLoss).toFixed(2)}
              </span>
              <br>
              <small class="${isProfit ? "profit" : "loss"}" style="font-size:0.75rem;">
                ${isProfit ? "+" : ""}${profitPercent}%
              </small>
            </div>
          </div>
        </div>
      </div>`;
  });

  if (totalBalanceEl) {
    totalBalanceEl.innerText = `$${totalCurrentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initGoldPrice();
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.oninput = (e) => {
      const term = e.target.value.toLowerCase();
      const cards = document.querySelectorAll("#assetsGrid > div");
      cards.forEach((card) => {
        const name = card.querySelector("h5").innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
      });
    };
  }
});

setInterval(fetchGoldPrice, 60000);
