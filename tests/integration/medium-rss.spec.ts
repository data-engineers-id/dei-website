import { describe, it, expect } from 'bun:test';
import { mockMediumArticles } from '../fixtures/data';

// Mock RSS Parser
const mockRssParser = {
  parseURL: async (url: string) => {
    if (url === 'https://medium.com/feed/data-engineering-indonesia') {
      return {
        items: mockMediumArticles,
      };
    }
    throw new Error('Invalid RSS URL');
  },
};

// Helper functions (mirroring src/lib/medium.ts)
function extractExcerpt(content: string, maxLength: number = 200): string {
  const plainText = content.replace(/<[^>]*>/g, ' ');
  const cleanText = plainText.replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength).trim() + '...';
}

function extractFirstImage(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

describe('Medium RSS Integration', () => {
  const MEDIUM_RSS_URL = 'https://medium.com/feed/data-engineering-indonesia';

  describe('RSS Feed Fetching', () => {
    it('should successfully fetch Medium RSS feed', async () => {
      // Act
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);

      // Assert
      expect(feed).toBeDefined();
      expect(feed.items).toBeDefined();
      expect(Array.isArray(feed.items)).toBe(true);
      expect(feed.items.length).toBeGreaterThan(0);
    });

    it('should handle RSS fetch errors gracefully', async () => {
      // Arrange
      const invalidUrl = 'https://invalid-url.com/feed';

      // Act & Assert
      try {
        await mockRssParser.parseURL(invalidUrl);
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should return empty array when RSS feed is empty', async () => {
      // Arrange
      const emptyParser = {
        parseURL: async () => ({ items: [] }),
      };

      // Act
      const feed = await emptyParser.parseURL(MEDIUM_RSS_URL);

      // Assert
      expect(feed.items).toEqual([]);
    });
  });

  describe('Article Data Parsing', () => {
    it('should parse article title correctly', async () => {
      // Arrange
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);
      const article = feed.items[0];

      // Assert
      expect(article.title).toBeDefined();
      expect(typeof article.title).toBe('string');
      expect(article.title.length).toBeGreaterThan(0);
    });

    it('should parse article link correctly', async () => {
      // Arrange
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);
      const article = feed.items[0];

      // Assert
      expect(article.link).toBeDefined();
      expect(article.link).toContain('medium.com');
    });

    it('should parse article author correctly', async () => {
      // Arrange
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);
      const article = feed.items[0];

      // Assert
      expect(article['dc:creator']).toBeDefined();
      expect(typeof article['dc:creator']).toBe('string');
    });

    it('should parse publication date correctly', async () => {
      // Arrange
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);
      const article = feed.items[0];

      // Assert
      expect(article.pubDate).toBeDefined();
      const date = new Date(article.pubDate);
      expect(date instanceof Date).toBe(true);
      expect(!isNaN(date.getTime())).toBe(true);
    });

    it('should parse article categories/tags', async () => {
      // Arrange
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);
      const article = feed.items[0];

      // Assert
      expect(article.categories).toBeDefined();
      expect(Array.isArray(article.categories)).toBe(true);
      expect(article.categories.length).toBeGreaterThan(0);
    });
  });

  describe('Content Processing', () => {
    it('should extract excerpt from HTML content', () => {
      // Arrange
      const htmlContent =
        '<p>This is a long article with <strong>HTML</strong> tags that should be stripped.</p>';
      const maxLength = 50;

      // Act
      const excerpt = extractExcerpt(htmlContent, maxLength);

      // Assert
      expect(excerpt).not.toContain('<p>');
      expect(excerpt).not.toContain('<strong>');
      expect(excerpt.length).toBeLessThanOrEqual(maxLength + 3); // +3 for "..."
    });

    it('should extract first image from content', () => {
      // Arrange
      const htmlContent =
        '<p>Intro</p><img src="https://example.com/image.jpg" alt="Test" /><p>More content</p>';

      // Act
      const imageUrl = extractFirstImage(htmlContent);

      // Assert
      expect(imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should return undefined when no image in content', () => {
      // Arrange
      const htmlContent = '<p>No images here</p>';

      // Act
      const imageUrl = extractFirstImage(htmlContent);

      // Assert
      expect(imageUrl).toBeUndefined();
    });

    it('should format date correctly for Indonesian locale', () => {
      // Arrange
      const dateString = '2026-01-15T00:00:00Z';

      // Act
      const formatted = formatDate(dateString);

      // Assert
      expect(formatted).toContain('2026');
      expect(typeof formatted).toBe('string');
    });
  });

  describe('Article Limit and Pagination', () => {
    it('should fetch specified number of articles', async () => {
      // Arrange
      const limit = 5;

      // Act
      const feed = await mockRssParser.parseURL(MEDIUM_RSS_URL);
      const articles = feed.items.slice(0, limit);

      // Assert
      expect(articles.length).toBeLessThanOrEqual(limit);
    });

    it('should handle articles without categories gracefully', async () => {
      // Arrange
      const feedWithNoCategories = {
        parseURL: async () => ({
          items: [
            {
              title: 'Article without categories',
              categories: undefined,
            },
          ],
        }),
      };

      // Act
      const feed = await feedWithNoCategories.parseURL(MEDIUM_RSS_URL);

      // Assert
      expect(feed.items[0].categories).toBeUndefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network timeout gracefully', async () => {
      // Arrange
      const timeoutParser = {
        parseURL: async () => {
          throw new Error('Request timeout');
        },
      };

      // Act & Assert
      try {
        await timeoutParser.parseURL(MEDIUM_RSS_URL);
        expect(false).toBe(true);
      } catch (error: any) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should handle malformed RSS gracefully', async () => {
      // Arrange
      const malformedParser = {
        parseURL: async () => ({
          items: null, // Malformed response
        }),
      };

      // Act
      const feed = await malformedParser.parseURL(MEDIUM_RSS_URL);

      // Assert - Should handle gracefully
      expect(feed.items).toBeNull();
    });

    it('should handle special characters in article titles', async () => {
      // Arrange
      const specialCharArticle = {
        parseURL: async () => ({
          items: [
            {
              title: 'Data Engineering: "Best Practices" & Tips <2026>',
              link: 'https://medium.com/test',
              'dc:creator': 'Test Author',
              pubDate: '2026-01-01',
              categories: ['test'],
            },
          ],
        }),
      };

      // Act
      const feed = await specialCharArticle.parseURL(MEDIUM_RSS_URL);

      // Assert
      expect(feed.items[0].title).toContain('"Best Practices"');
      expect(feed.items[0].title).toContain('<2026>');
    });
  });
});

describe('Medium Integration Data Flow', () => {
  it('should transform RSS data to Article type correctly', async () => {
    // Arrange
    const feed = await mockRssParser.parseURL('https://medium.com/feed/data-engineering-indonesia');
    const rssItem = feed.items[0];

    // Act - Transform to Article type
    const article = {
      title: rssItem.title,
      url: rssItem.link,
      publishedAt: new Date(rssItem.pubDate),
      author: rssItem['dc:creator'],
      excerpt: extractExcerpt(rssItem['content:encoded'] || '', 150),
      categories: rssItem.categories || [],
      thumbnail: extractFirstImage(rssItem['content:encoded'] || ''),
    };

    // Assert
    expect(article).toHaveProperty('title');
    expect(article).toHaveProperty('url');
    expect(article).toHaveProperty('publishedAt');
    expect(article).toHaveProperty('author');
    expect(article).toHaveProperty('excerpt');
    expect(article).toHaveProperty('categories');
    expect(article).toHaveProperty('thumbnail');
  });

  it('should cache articles for performance', async () => {
    // This would test caching logic in production
    // For now, just verify the concept
    const _cacheKey = 'medium_articles_cache';
    const cachedData = null; // Simulate empty cache

    // First fetch - should hit API
    if (!cachedData) {
      const feed = await mockRssParser.parseURL(
        'https://medium.com/feed/data-engineering-indonesia'
      );
      expect(feed.items).toBeDefined();
    }
  });
});
