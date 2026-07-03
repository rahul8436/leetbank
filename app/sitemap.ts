import type { MetadataRoute } from "next";
import { allKeys, companyList, topicList } from "@/lib/problems";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/topics"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/companies"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const problems: MetadataRoute.Sitemap = allKeys().map((slug) => ({
    url: url(`/problems/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const topics: MetadataRoute.Sitemap = topicList.map((t) => ({
    url: url(`/topics/${t.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const companies: MetadataRoute.Sitemap = companyList.map((c) => ({
    url: url(`/companies/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...problems, ...topics, ...companies];
}
