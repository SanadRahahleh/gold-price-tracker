const url = "https://gnews.io/api/v4/search?q=XAU&lang=en&apikey=19d9c9ef408649625ed381b1ff5efd9f";

const container = document.querySelector("#newsDetails");
const heroImage = document.querySelector(".hero img");

async function getNews() {
  try {
    container.innerHTML = "<p>Loading...</p>";

    const response = await fetch(url);

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("DATA:", data);

    if (!response.ok) {
      throw new Error(data.errors?.[0] || "API Error");
    }

    displayNews(data.articles);

  } catch (error) {
    console.error("ERROR:", error);
    container.innerHTML = `<p>${error.message}</p>`;
  }
}

function displayNews(articles) {
  container.innerHTML = "";

  articles.forEach(article => {
    const div = document.createElement("div");
    div.classList.add("news-card", "mb-4");

    div.innerHTML = `
      <img src="${article.image || 'https://via.placeholder.com/300'}" class="img-fluid rounded mb-2">

      <h5>${article.title}</h5>

      <p>${article.description || "No description available"}</p>

      <a href="${article.url}" target="_blank" class="btn btn-gold">
        Read More
      </a>
    `;

    container.appendChild(div);
  });
}

getNews();
setInterval(getNews, 300000);