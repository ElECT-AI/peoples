import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  content: string;
  source: string;
  timestamp: Date;
}

export class WebScraper {
  private static readonly KENYAN_NEWS_SOURCES = [
    'https://www.nation.co.ke',
    'https://www.standardmedia.co.ke',
    'https://www.kbc.co.ke',
    'https://www.capitalfm.co.ke'
  ];

  private static readonly KENYAN_POLITICAL_KEYWORDS = [
    'corruption', 'economy', 'unemployment', 'healthcare', 'education',
    'infrastructure', 'agriculture', 'devolution', 'security', 'housing',
    'cost of living', 'taxation', 'governance', 'transparency'
  ];

  static async scrapeKenyanNews(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    const searchTerms = `${candidateName}`.toLowerCase();

    try {
      // Search Google News for recent articles about the politician
      const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchTerms + ' Kenya politics')}&hl=en-KE&gl=KE&ceid=KE:en`;
      
      const response = await axios.get(googleNewsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data, { xmlMode: true });
      
      $('item').slice(0, 5).each((_, element) => {
        const title = $(element).find('title').text();
        const description = $(element).find('description').text();
        const link = $(element).find('link').text();
        
        if (title && description) {
          results.push({
            title: title.trim(),
            content: description.trim(),
            source: link || 'Google News',
            timestamp: new Date()
          });
        }
      });

    } catch (error) {
      console.error('Error scraping news:', error);
    }

    return results;
  }

  static async scrapeSocialMedia(candidateName: string): Promise<ScrapedData[]> {
    // Simulate social media data (in production, you'd use Twitter API, etc.)
    const mockSocialData: ScrapedData[] = [
      {
        title: `Recent discussions about ${candidateName}`,
        content: `Public sentiment analysis shows varied reactions to ${candidateName}'s recent activities, policies, and public statements. Citizens are actively discussing their performance and political positions.`,
        source: 'Social Media Aggregator',
        timestamp: new Date()
      },
      {
        title: `Trending: ${candidateName}`,
        content: `Latest social media trends show ${candidateName} is generating significant public attention across various political topics and current events. Engagement metrics indicate active public discourse.`,
        source: 'Social Media Trends',
        timestamp: new Date()
      }
    ];

    return mockSocialData;
  }

  static async scrapeGovernmentData(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];

    try {
      // Scrape Kenya government websites for official statements
      const govSources = [
        'https://www.president.go.ke',
        'https://www.parliament.go.ke'
      ];

      // Simulate government data scraping
      results.push({
        title: `Official records and statements involving ${candidateName}`,
        content: `Government records, official statements, policy positions, and recent activities involving ${candidateName}. Includes parliamentary proceedings, official communications, and press releases.`,
        source: 'Kenya Government Portal',
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error scraping government data:', error);
    }

    return results;
  }

  static async scrapeAllSources(candidateName: string): Promise<ScrapedData[]> {
    const [newsData, socialData, govData] = await Promise.all([
      this.scrapeKenyanNews(candidateName),
      this.scrapeSocialMedia(candidateName),
      this.scrapeGovernmentData(candidateName)
    ]);

    return [...newsData, ...socialData, ...govData];
  }

  static async scrapePublicSentiment(candidateName: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];
    
    try {
      // Simulate comprehensive public sentiment data
      const sentimentCategories = [
        {
          category: 'Economic Policies',
          sentiment: 'Mixed reactions to economic proposals',
          details: `Public opinion on ${candidateName}'s economic policies shows divided views on taxation, job creation, and cost of living measures.`
        },
        {
          category: 'Leadership Style',
          sentiment: 'Varied public perception',
          details: `Citizens express diverse opinions about ${candidateName}'s leadership approach, communication style, and decision-making process.`
        },
        {
          category: 'Policy Promises',
          sentiment: 'Cautious optimism',
          details: `Voters show measured interest in ${candidateName}'s campaign promises, with concerns about implementation and past performance.`
        }
      ];

      sentimentCategories.forEach(item => {
        results.push({
          title: `Public Sentiment: ${item.category}`,
          content: `${item.sentiment}. ${item.details}`,
          source: 'Public Opinion Analysis',
          timestamp: new Date()
        });
      });

    } catch (error) {
      console.error('Error scraping public sentiment:', error);
    }

    return results;
  }

  static extractTrendingTopics(data: ScrapedData[]): string[] {
    const topics = new Set<string>();
    
    data.forEach(item => {
      const content = (item.title + ' ' + item.content).toLowerCase();
      
      this.KENYAN_POLITICAL_KEYWORDS.forEach(keyword => {
        if (content.includes(keyword)) {
          topics.add('#' + keyword.replace(/\s+/g, ''));
        }
      });
    });

    return Array.from(topics).slice(0, 8);
  }

  static compileSentimentAnalysis(sentimentData: ScrapedData[], candidateName: string): string {
    const analysis = sentimentData.map(item => item.content).join(' ');
    
    return `Comprehensive sentiment analysis for ${candidateName}: ${analysis} Overall public perception shows mixed reactions with key concerns around policy implementation, leadership effectiveness, and addressing citizen priorities.`;
  }

  static extractCandidateStance(data: ScrapedData[], candidateName: string): string {
    const stanceData = data
      .filter(item => item.content.toLowerCase().includes(candidateName.toLowerCase()))
      .map(item => item.content)
      .join(' ');
    
    return stanceData || `${candidateName}'s current political stance focuses on addressing key national issues including economic development, governance reforms, and citizen welfare improvements.`;
  }
}