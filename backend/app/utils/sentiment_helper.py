"""
Sentiment Analysis Helper
=========================
Helper module for mood and sentiment analysis using VADER.

Separate from Gemini AI helper to keep concerns separated.
"""

import logging
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Configure logging
logger = logging.getLogger(__name__)


class SentimentHelper:
    """
    Helper class for sentiment and mood analysis using VADER.
    """
    
    def __init__(self):
        """
        Initialize the sentiment analyzer.
        """
        self.analyzer = SentimentIntensityAnalyzer()
    
    def analyze_mood_from_notes(self, 
                                 notes: str, 
                                 log_date: str = None, 
                                 habit_title: str = None) -> dict:
        """
        Analyze mood from journal notes using VADER Sentiment Analysis.
        
        Args:
            notes: The journal entry text to analyze
            log_date: Optional date of the log (for context, not used in analysis)
            habit_title: Optional habit title (for context, not used in analysis)
        
        Returns:
            dict with keys:
                - mood_label: One of the valid mood labels
                - mood_intensity: Float between 0.0 and 1.0
                - sentiment: "positive", "neutral", or "negative"
                - keywords: List of emotional keywords (max 3)
        """
        if not notes or len(notes.strip()) < 10:
            return {
                "mood_label": "Neutral",
                "mood_intensity": 0.5,
                "sentiment": "neutral",
                "keywords": []
            }
        
        try:
            # Get sentiment scores from VADER
            scores = self.analyzer.polarity_scores(notes)
            compound = scores['compound']  # Range: -1 (most negative) to +1 (most positive)
            pos = scores['pos']
            neu = scores['neu']
            neg = scores['neg']
            
            # Determine sentiment
            if compound >= 0.05:
                sentiment = "positive"
            elif compound <= -0.05:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            # Calculate intensity (absolute value of compound, normalized to 0-1)
            # Add some baseline so even neutral has some intensity
            mood_intensity = min(1.0, max(0.1, abs(compound)))
            
            # Map to mood label based on sentiment and intensity
            mood_label = "Neutral"
            
            if sentiment == "positive":
                if compound >= 0.7:
                    # Very positive - high energy moods
                    if pos > neg * 2:
                        mood_label = "Excited"
                    else:
                        mood_label = "Happy"
                elif compound >= 0.4:
                    # Moderately positive
                    mood_label = "Motivated"
                elif compound >= 0.2:
                    # Mildly positive - calm/content
                    mood_label = "Content"
                else:
                    # Slightly positive
                    mood_label = "Calm"
            elif sentiment == "negative":
                if compound <= -0.7:
                    # Very negative - high stress
                    if neg > pos * 2:
                        mood_label = "Overwhelmed"
                    else:
                        mood_label = "Stressed"
                elif compound <= -0.4:
                    # Moderately negative
                    notes_lower = notes.lower()
                    if "tired" in notes_lower or "exhausted" in notes_lower or "sleepy" in notes_lower:
                        mood_label = "Tired"
                    elif "anxious" in notes_lower or "worried" in notes_lower or "nervous" in notes_lower:
                        mood_label = "Anxious"
                    elif "frustrated" in notes_lower or "annoyed" in notes_lower:
                        mood_label = "Frustrated"
                    else:
                        mood_label = "Stressed"
                elif compound <= -0.2:
                    # Mildly negative
                    mood_label = "Tired"
                else:
                    # Slightly negative
                    mood_label = "Tired"
            else:
                # Neutral
                mood_label = "Neutral"
            
            # Extract simple keywords based on sentiment words
            keywords = []
            notes_lower = notes.lower()
            
            # Positive keywords
            positive_words = ["happy", "great", "good", "excited", "proud", "accomplished", "energetic", "motivated", "calm", "content", "relaxed"]
            for word in positive_words:
                if word in notes_lower and sentiment == "positive":
                    keywords.append(word)
                    if len(keywords) >= 2:
                        break
            
            # Negative keywords
            negative_words = ["stressed", "tired", "anxious", "worried", "frustrated", "overwhelmed", "exhausted"]
            for word in negative_words:
                if word in notes_lower and sentiment == "negative":
                    keywords.append(word)
                    if len(keywords) >= 2:
                        break
            
            # If no keywords found, use sentiment-based defaults
            if not keywords:
                if sentiment == "positive":
                    keywords = ["positive"]
                elif sentiment == "negative":
                    keywords = ["concerned"]
                else:
                    keywords = ["neutral"]
            
            return {
                "mood_label": mood_label,
                "mood_intensity": mood_intensity,
                "sentiment": sentiment,
                "keywords": keywords[:3]  # Limit to 3 keywords
            }
        except Exception as e:
            logger.error(f"Failed to analyze mood with VADER: {e}")
            return {
                "mood_label": "Neutral",
                "mood_intensity": 0.5,
                "sentiment": "neutral",
                "keywords": []
            }


# Create a singleton instance
sentiment_helper = SentimentHelper()






