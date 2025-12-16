"""
Google Gemini AI Helper
=======================
[OMAMAH] This is your utility module to implement.

Wrapper for Google Gemini API calls.
"""

from typing import Optional, List
import google.generativeai as genai
import json
import logging

from app.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Configure the Gemini API with your API key
# WHY: Authenticate with Google's API
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiHelper:
    """
    Helper class for interacting with Google Gemini AI.
    """
    
    def __init__(self):
        """
        Initialize the Gemini helper.
        """
        self.model = None
        try:
            # Create the generative model instance
            # using 'gemini-3-pro-preview' for text-only tasks
            # WHY: Need model to make API calls
            self.model = genai.GenerativeModel('gemini-3-pro-preview')
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
    
    async def generate_text(self, prompt: str) -> str:
        """
        Generate text from a prompt.
        """
        if not self.model:
            return "AI service is currently unavailable."

        try:
            # Call the Gemini API with the prompt
            # WHY: Get AI-generated response
            response = self.model.generate_content(prompt)
            
            # Return the generated text
            # WHY: Extract text from response object
            return response.text
        except Exception as e:
            # Handle API errors
            # WHY: API might fail or rate limit
            logger.error(f"Gemini API error: {e}")
            return "I'm having trouble thinking right now. Please try again later."
    
    async def get_habit_suggestions(self, 
                                    existing_habits: List[str],
                                    category: Optional[str] = None) -> List[dict]:
        """
        Get AI-powered habit suggestions.
        """
        # Build a prompt for habit suggestions
        # WHY: Ask AI to suggest new habits
        habits_str = ", ".join(existing_habits) if existing_habits else "none"
        category_str = f" in the '{category}' category" if category else ""
        
        prompt = f"""
        I currently have these habits: {habits_str}.
        Please suggest 5 new, distinct habits{category_str} that would be good additions.
        
        Format your response as a JSON array of objects. Each object must have:
        - "title": A short name for the habit
        - "description": A brief explanation (1 sentence)
        - "category": The category (Health, Fitness, Learning, Productivity, Mindfulness, or Other)
        
        Example format:
        [
            {{"title": "Drink Water", "description": "Drink 8 glasses a day.", "category": "Health"}}
        ]
        Only return the JSON, no markdown formatting.
        """
        
        try:
            # Call generate_text with the prompt
            text = await self.generate_text(prompt)
            
            # Parse response into structured suggestions
            # WHY: Extract individual suggestions
            clean_text = text.replace("```json", "").replace("```", "").strip()
            
            suggestions = json.loads(clean_text)
            
            # Return list of suggestion objects
            # WHY: Structured data for frontend
            return suggestions
        except Exception as e:
            logger.error(f"Failed to parse AI suggestions: {e}")
            # Fallback suggestions
            return [
                {"title": "Morning Stretch", "description": "5 minutes of stretching to start the day.", "category": "Fitness"},
                {"title": "Read 10 Pages", "description": "Read a book to learn something new.", "category": "Learning"},
                {"title": "Plan Tomorrow", "description": "Spend 5 mins planning the next day.", "category": "Productivity"}
            ]
    
    async def generate_weekly_summary(self, 
                                       stats: dict,
                                       habits: List[dict]) -> dict:
        """
        Generate AI-powered weekly summary.
        """
        # Build prompt with weekly statistics
        # WHY: Give AI context about user's week
        prompt = f"""
        Analyze this weekly habit data for a user:
        Overall Stats: {stats}
        Habit Performance: {habits}
        
        Provide a JSON object with:
        - "summary": A 2-sentence encouraging summary of the week.
        - "highlights": An array of 3 short strings mentioning key achievements or good streaks.
        - "insights": A short string with an insight about their patterns.
        - "recommendations": An array of 2 actionable tips for next week.
        
        Only return the JSON.
        """
        
        try:
            # Call generate_text
            text = await self.generate_text(prompt)
            
            # Parse response into structured summary
            clean_text = text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            logger.error(f"Failed to generate summary: {e}")
            return {
                "summary": "You've made progress this week! Keep tracking to build consistency.",
                "highlights": ["Tracked multiple habits", "Stayed active", "Built momentum"],
                "insights": "Consistency is key to long-term success.",
                "recommendations": ["Try to log your habits at the same time daily.", "Focus on one key habit next week."]
            }
    
    async def get_motivation_message(self, 
                                      context: dict) -> str:
        """
        Get personalized motivational message.
        """
        # Build prompt based on user's situation
        # WHY: Contextual motivation is more effective
        prompt = f"""
        Generate a short, punchy motivational message (max 20 words) for a user.
        Context: {context}
        Tone: Encouraging and energetic.
        """
        return await self.generate_text(prompt)
    
    async def analyze_patterns(self, 
                                logs: List[dict]) -> dict:
        """
        Analyze habit patterns with AI.
        """
        # Prepare log data for analysis
        # Limit logs to avoid token limits
        recent_logs = logs[:50]
        
        # Build analysis prompt
        # WHY: Ask AI to identify patterns
        prompt = f"""
        Analyze these recent habit logs:
        {recent_logs}
        
        Identify patterns in time of day, consistency, or completion rates.
        Return a JSON object with a "patterns" key containing a list of 2-3 short strings describing these patterns.
        """
        
        try:
            # Call generate_text
            text = await self.generate_text(prompt)
            
            # Parse and return patterns
            clean_text = text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_text)
        except Exception as e:
            logger.error(f"Failed to analyze patterns: {e}")
            return {"patterns": ["Tracking consistently helps reveal patterns.", "Keep logging to see more insights."]}
    
    async def chat(self, 
                   message: str,
                   context: dict) -> str:
        """
        Free-form chat about habits.
        """
        # Build system context and combine with user message
        prompt = f"""
        You are a supportive Habit Coach AI.
        User Context: {context}
        
        User: {message}
        
        Reply helpfully, concisely, and with an encouraging tone.
        """
        
        # Call generate_text and return response
        return await self.generate_text(prompt)