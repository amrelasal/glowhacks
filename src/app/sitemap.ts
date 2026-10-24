import type { MetadataRoute } from "next";
import { tools } from "@/lib/toolsData";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/contact", "/privacy"].map((p) => ({
    url: `${siteConfig.url}${p}`,
    lastModified: new Date(),
  }));
  const toolPages = tools.map((t) => ({
    url: `${siteConfig.url}/tools/${t.slug}`,
    lastModified: new Date(),
  }));
  return [...pages, ...toolPages];
}
