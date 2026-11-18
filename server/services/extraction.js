
import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import ipaddr from "ipaddr.js";

const MAX_CONTENT_SIZE = 2 * 1024 * 1024;
const FETCH_TIMEOUT = 10000;

const validatePublicUrl = async (url) => {
  const parsedUrl = new URL(url);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("URLs containing credentials are not allowed.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Private network URLs are not allowed.");
  }

  const addresses = await lookup(hostname, {
    all: true,
    verbatim: true
  });

  if (!addresses.length) {
    throw new Error("Unable to resolve the URL hostname.");
  }

  for (const { address } of addresses) {
    const range = ipaddr.parse(address).range();

    if (range !== "unicast") {
      throw new Error("URLs resolving to private or reserved IPs are not allowed.");
    }
  }

  return parsedUrl;
};

export const extractUrlContent = async (url) => {
  const parsedUrl = await validatePublicUrl(url);

  const response = await fetch(parsedUrl, {
    redirect: "manual",
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: {
      "User-Agent": "AIKnowledgeInbox/1.0"
    }
  });

  if (response.status >= 300 && response.status < 400) {
    throw new Error("Redirects are not supported for URL ingestion.");
  }

  if (!response.ok) {
    throw new Error(`Unable to fetch webpage: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("text/html")) {
    throw new Error("The supplied URL must return an HTML webpage.");
  }

  const contentLength = Number(
    response.headers.get("content-length") || 0
  );

  if (contentLength > MAX_CONTENT_SIZE) {
    throw new Error("Webpage exceeds the maximum allowed size.");
  }

  const html = await response.text();

  if (Buffer.byteLength(html, "utf8") > MAX_CONTENT_SIZE) {
    throw new Error("Webpage exceeds the maximum allowed size.");
  }

  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || parsedUrl.hostname;

  $("script, style, nav, footer, header, iframe, noscript, svg").remove();

  const content = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  if (!content) {
    throw new Error("No readable content found on the webpage.");
  }

  return {
    title,
    content,
    sourceUrl: parsedUrl.href
  };
};
