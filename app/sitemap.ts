import { MetadataRoute } from "next";
import { getAllPostsForSitemap } from "@/lib/wordpress";
import { getAllCarSlugs } from "@/lib/vehica";
import { siteConfig } from "@/site.config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; modified: string }[] = [];
  let carSlugs: { slug: string }[] = [];

  try {
    [posts, carSlugs] = await Promise.all([
      getAllPostsForSitemap(),
      getAllCarSlugs(),
    ]);
  } catch {
    // WordPress unavailable at build time — return static URLs only
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteConfig.site_domain,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.site_domain}/vehicles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.site_domain}/import-news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.site_domain}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.site_domain}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.site_domain}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const carUrls: MetadataRoute.Sitemap = carSlugs.map((car) => ({
    url: `${siteConfig.site_domain}/vehicles/${car.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.site_domain}/import-news/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticUrls, ...carUrls, ...postUrls];
}
