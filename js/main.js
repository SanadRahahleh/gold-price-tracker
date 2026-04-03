let goldPrice = null;
let chart;
let goldHistory = [];

const jod = document.getElementById("jod");
const usd = document.getElementById("usd");

jod.addEventListener("click", (e) => {
  e.preventDefault();
  jod.classList.add("btn-gold");
  usd.classList.remove("btn-gold");
  updateUI("JOD");
  renderGoldChart(goldHistory, "JOD");
});
usd.addEventListener("click", (e) => {
  e.preventDefault();
  usd.classList.add("btn-gold");
  jod.classList.remove("btn-gold");
  updateUI("USD");
  renderGoldChart(goldHistory, "USD");
});

initGoldPrice();
getGoldHistory();
initChart();

async function getGoldHistory() {
  const stored = localStorage.getItem("goldHistory");

  if (stored) {
    return JSON.parse(stored);
  }

  const endTimestamp = Math.floor(Date.now() / 1000);
  const startTimestamp = Math.floor(
    (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000,
  );

  const url = `https://api.gold-api.com/history?symbol=XAU&groupBy=day&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`;

  const res = await fetch(url, {
    headers: {
      "x-api-key":
        "3a999d7b4773470018fcfb0777ddf0052e9c81dbb899461059c3a2245c99aee9",
    },
  });

  const data = await res.json();

  localStorage.setItem("goldHistory", JSON.stringify(data));

  return data;
}

async function initChart() {
  goldHistory = await getGoldHistory();
  renderGoldChart(goldHistory, "USD");
}

async function fetchGoldPrice() {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU");
    const data = await res.json();

    goldPrice = data.price;
    localStorage.setItem("goldPrice", goldPrice);

    updateUI("USD");
  } catch (error) {
    console.error(error);
  }
}

async function initGoldPrice() {
  const stored = localStorage.getItem("goldPrice");

  if (stored) {
    goldPrice = Number(stored);
  }

  await fetchGoldPrice();
}

function getGoldPrice() {
  return goldPrice;
}

function USDToJOD(num) {
  return num * 0.709;
}

function getGramPrice(karat) {
  const ounce = getGoldPrice();
  if (!ounce) return null;

  const gram24 = ounce / 31.1035;

  return gram24 * (karat / 24);
}

function renderGoldChart(data, currency = "USD") {
  if (!data) return;

  data.sort((a, b) => new Date(a.day) - new Date(b.day));

  const prices = data.map((item) => {
    const price = Number(item.max_price);
    return currency === "JOD" ? USDToJOD(price) : price;
  });
  const dates = data.map((item, index) => {
    if (index % 5 === 0) {
      const date = new Date(item.day);

      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    }

    return "";
  });

  const ctx = document.getElementById("goldChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

  gradient.addColorStop(0, "rgba(238, 210, 154, 0.4)");
  gradient.addColorStop(1, "rgba(238, 210, 154, 0)");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",

    data: {
      labels: dates,
      datasets: [
        {
          label: `Gold Price (${currency})`,
          data: prices,
          borderWidth: 2,
          tension: 0.3,
          borderColor: "rgb(238, 210, 154)",
          backgroundColor: gradient,
          fill: true,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            color: "rgb(238, 210, 154)",
          },
        },
        y: {
          ticks: {
            color: "rgb(238, 210, 154)", // Y-axis text color
          },
        },
      },
    },
  });
}

function convertCurrency(amount, currency) {
  if (currency === "JOD") return USDToJOD(amount);
  return amount;
}

function formatMoney(amount, currency) {
  return currency === "JOD"
    ? `${amount.toFixed(2)} JOD`
    : `$${amount.toFixed(2)}`;
}

function updateUI(currency = "USD") {
  const ounce = getGoldPrice();
  if (!ounce) return;

  const ounceConverted = convertCurrency(ounce, currency);
  document.getElementById("price-usd").textContent =
    formatMoney(ounceConverted, currency) + " / oz";

  const price24 = convertCurrency(getGramPrice(24), currency);
  const price21 = convertCurrency(getGramPrice(21), currency);
  const price18 = convertCurrency(getGramPrice(18), currency);

  const rashidiCoin = convertCurrency(getGramPrice(24) * 7, currency);
  const englishCoin = convertCurrency(getGramPrice(24) * 8, currency);

  document.getElementById("price-24k").textContent = formatMoney(
    price24,
    currency,
  );

  document.getElementById("price-21k").textContent = formatMoney(
    price21,
    currency,
  );

  document.getElementById("price-18k").textContent = formatMoney(
    price18,
    currency,
  );

  document.getElementById("rashidi-price").textContent = formatMoney(
    rashidiCoin,
    currency,
  );

  document.getElementById("english-price").textContent = formatMoney(
    englishCoin,
    currency,
  );
}

setInterval(fetchGoldPrice, 60000);

///////////////////////////////////
const goldBar = document.getElementById("goldBar");
const modal = document.getElementById("goldModal");
const closeBtn = document.getElementById("closeModal");
const calcBtn = document.getElementById("calcGold");
const result = document.getElementById("goldResult");

goldBar.addEventListener("click", () => {
  modal.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  document.getElementById("goldWeight").value = "";
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

calcBtn.addEventListener("click", () => {
  const weight = parseFloat(document.getElementById("goldWeight").value);

  if (!goldPrice) {
    result.innerText = "⚠️ Price not loaded";
    return;
  }

  if (isNaN(weight) || weight <= 0) {
    result.innerText = "⚠️ Enter valid weight";
    return;
  }
  const currency = usd.classList.contains("btn-gold") ? "USD" : "JOD";

  const totalUSD = weight * getGramPrice(24);

  const final = currency === "JOD" ? USDToJOD(totalUSD) : totalUSD;

  result.innerText = `💰 Total: ${formatMoney(final, currency)}`;
});
