// Medium RSS Feed Parser
import Parser from 'rss-parser';

const parser = new Parser();

const MEDIUM_RSS_URL = 'https://medium.com/feed/data-engineering-indonesia';

export interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  'dc:creator'?: string;
  categories?: string[];
  'content:encoded'?: string;
}

export async function fetchMediumArticles(limit: number = 10): Promise<MediumArticle[]> {
  try {
    const feed = await parser.parseURL(MEDIUM_RSS_URL);

    return feed.items.slice(0, limit).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      'dc:creator': item['dc:creator'] || item.creator || 'DEI Team',
      categories: item.categories || [],
      'content:encoded': item['content:encoded'] || item.content || '',
    }));
  } catch (error) {
    console.error('Error fetching Medium RSS:', error);
    return [];
  }
}

export function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, ' ');
  // Clean up whitespace
  const cleanText = plainText.replace(/\s+/g, ' ').trim();
  // Truncate
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength).trim() + '...';
}

export function extractFirstImage(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
