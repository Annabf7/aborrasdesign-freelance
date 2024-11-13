// Importem el mòdul per generar el sitemap
const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

// Defineix les rutes de la teva aplicació
const pages = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/photography", changefreq: "monthly", priority: 0.8 },
  { url: "/webfrontend", changefreq: "monthly", priority: 0.8 },
  { url: "/motiongraphic", changefreq: "monthly", priority: 0.8 },
  { url: "/about", changefreq: "monthly", priority: 0.7 },
  { url: "/generative-art", changefreq: "weekly", priority: 0.8 },
  { url: "/generative-art/selection", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-1", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-2", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-3", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-4", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-5", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-6", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-7", changefreq: "weekly", priority: 0.7 },
  { url: "/generative-art/style-8", changefreq: "weekly", priority: 0.7 },
  { url: "/choose-your-artwork-size", changefreq: "weekly", priority: 0.6 },
  { url: "/view-in-space", changefreq: "weekly", priority: 0.6 },
  { url: "/checkout", changefreq: "weekly", priority: 0.6 },
  { url: "/shippinginfo", changefreq: "weekly", priority: 0.6 },
  { url: "/completepayment", changefreq: "weekly", priority: 0.6 },
  { url: "/auth", changefreq: "monthly", priority: 0.5 },
  { url: "/registration-successful", changefreq: "monthly", priority: 0.5 },
  { url: "/login", changefreq: "monthly", priority: 0.5 },
  { url: "/profile", changefreq: "monthly", priority: 0.5 },
  { url: "/order-history", changefreq: "monthly", priority: 0.5 },
  { url: "/cart", changefreq: "monthly", priority: 0.6 },
];

// Funció per generar el sitemap
async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: "https://aborrasdesign-b281d.web.app" });
  pages.forEach((page) => sitemap.write(page));
  sitemap.end();

  const data = await streamToPromise(sitemap);
  fs.writeFileSync("public/sitemap.xml", data);
  console.log("Sitemap generat correctament!");
}

generateSitemap();
