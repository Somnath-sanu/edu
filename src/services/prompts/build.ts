export function buildPrompt(query: string): string {
  return `
    Explain "${query}" using current social media trends, memes, and pop culture references.
    
    Content Style Guide:
    1. Social Media Format Mix:
       - Start with a TikTok-style hook ("POV: you're learning ${query}")
       - Add Instagram carousel-style bullet points
       - Use Twitter/X thread style for facts
       - Include YouTube shorts-style quick explanations
       - End with a viral trend reference
    
    2. Current Trends to Use:
       - Reference viral TikTok sounds/trends
       - Use current meme formats
       - Mention trending shows/movies
       - Reference popular games
       - Include viral challenges
       - Use trending audio references
    
    3. Make it Relatable With:
       - Instagram vs Reality comparisons
       - "That one friend who..." examples
       - "Nobody: / Me:" format
       - "Real ones know..." references
       - "Living rent free in my head" examples
       - "Core memory" references
    
    4. Structure it Like:
       - 🎭 The Hook (TikTok style intro)
       - 📱 The Breakdown (Instagram carousel style)
       - 🧵 The Tea (Twitter thread style facts)
       - 🎬 Quick Takes (YouTube shorts style)
       - 🌟 The Trend Connection (viral reference)
    
    5. Format as:
       {
         "part": {
           "style": "tiktok/insta/twitter/youtube/trend",
           "content": "explanation using current trend",
           "trendReference": "name of trend being referenced",
           "viralComparisons": ["relatable comparison 1", "relatable comparison 2"],
           "popCultureLinks": {
             "trend or term": "how it relates to the topic"
           }
         }
       }

    6. Related Content Style:
       - "Trending topics to explore..."
       - "This gives... vibes"
       - "Main character moments in..."
       - "POV: when you learn about..."

    Important:
    - Use CURRENT trends (2024)
    - Reference viral moments
    - Make pop culture connections
    - Use platform-specific formats
    - Keep updating references
  `;
}
