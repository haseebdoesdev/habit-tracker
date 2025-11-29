"""
Google Calendar Helper - Wrapper for Google Calendar API with OAuth 2.0.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import logging
import httpx

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request

from app.config import settings

logger = logging.getLogger(__name__)


class CalendarHelperError(Exception):
    """Base exception for calendar helper errors."""
    pass


class TokenExpiredError(CalendarHelperError):
    """Raised when token is expired and cannot be refreshed."""
    pass


class CalendarAPIError(CalendarHelperError):
    """Raised when Google Calendar API returns an error."""
    pass


class CalendarHelper:
    """Helper class for Google Calendar integration."""
    
    SCOPES = settings.GOOGLE_SCOPES
    
    def __init__(self):
        self.client_config = settings.GOOGLE_CLIENT_CONFIG
        self.redirect_uri = settings.GOOGLE_REDIRECT_URI
        
    def _create_flow(self, state: Optional[str] = None) -> Flow:
        """Create a new OAuth 2.0 flow instance."""
        flow = Flow.from_client_config(
            client_config=self.client_config,
            scopes=self.SCOPES,
            redirect_uri=self.redirect_uri
        )
        if state:
            flow.state = state
        return flow
    
    def get_authorization_url(self, state: str) -> str:
        """Generate OAuth 2.0 authorization URL with CSRF protection."""
        flow = self._create_flow(state=state)
        
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent',
            state=state
        )
        
        logger.info(f"Generated authorization URL for state: {state[:8]}...")
        return authorization_url
    
    def exchange_code_for_tokens(self, code: str) -> Dict[str, Any]:
        """Exchange authorization code for access and refresh tokens."""
        try:
            flow = self._create_flow()
            flow.fetch_token(code=code)
            credentials = flow.credentials
            
            token_data = {
                'access_token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': list(credentials.scopes) if credentials.scopes else self.SCOPES,
                'expiry': credentials.expiry.isoformat() if credentials.expiry else None
            }
            
            logger.info("Successfully exchanged authorization code for tokens")
            return token_data
            
        except Exception as e:
            logger.error(f"Failed to exchange code for tokens: {e}")
            raise CalendarHelperError(f"Token exchange failed: {str(e)}")
    
    def build_service(self, credentials_data: Dict[str, Any]):
        """Build Google Calendar API service from stored credentials."""
        try:
            expiry = None
            if credentials_data.get('expiry'):
                if isinstance(credentials_data['expiry'], str):
                    expiry = datetime.fromisoformat(credentials_data['expiry'].replace('Z', '+00:00'))
                else:
                    expiry = credentials_data['expiry']
            
            credentials = Credentials(
                token=credentials_data['access_token'],
                refresh_token=credentials_data.get('refresh_token'),
                token_uri=credentials_data.get('token_uri', 'https://oauth2.googleapis.com/token'),
                client_id=credentials_data.get('client_id', settings.GOOGLE_CLIENT_ID),
                client_secret=credentials_data.get('client_secret', settings.GOOGLE_CLIENT_SECRET),
                scopes=credentials_data.get('scopes', self.SCOPES),
                expiry=expiry
            )
            
            if credentials.expired and credentials.refresh_token:
                logger.info("Access token expired, refreshing...")
                try:
                    credentials.refresh(Request())
                    logger.info("Token refreshed successfully")
                except Exception as refresh_error:
                    logger.error(f"Token refresh failed: {refresh_error}")
                    raise TokenExpiredError("Token expired and refresh failed. User must re-authorize.")
            elif credentials.expired:
                raise TokenExpiredError("Token expired and no refresh token available. User must re-authorize.")
            
            return build('calendar', 'v3', credentials=credentials)
            
        except TokenExpiredError:
            raise
        except Exception as e:
            logger.error(f"Failed to build calendar service: {e}")
            raise CalendarAPIError(f"Failed to build calendar service: {str(e)}")
    
    async def create_event(self,
                           credentials: Dict[str, Any],
                           title: str,
                           description: str,
                           start_time: datetime,
                           end_time: Optional[datetime] = None,
                           recurrence: Optional[str] = None,
                           reminder_minutes: int = 30,
                           timezone: str = "UTC") -> Dict[str, Any]:
        """Create a calendar event."""
        try:
            service = self.build_service(credentials)
            
            if end_time is None:
                end_time = start_time + timedelta(minutes=30)
            
            event_body = {
                'summary': title,
                'description': description,
                'start': {'dateTime': start_time.isoformat(), 'timeZone': timezone},
                'end': {'dateTime': end_time.isoformat(), 'timeZone': timezone},
                'reminders': {
                    'useDefault': False,
                    'overrides': [{'method': 'popup', 'minutes': reminder_minutes}],
                },
            }
            
            if recurrence:
                event_body['recurrence'] = [recurrence]
            
            event = service.events().insert(calendarId='primary', body=event_body).execute()
            
            logger.info(f"Created calendar event: {event.get('id')}")
            
            return {
                'id': event.get('id'),
                'html_link': event.get('htmlLink'),
                'summary': event.get('summary'),
                'start': event.get('start'),
                'end': event.get('end'),
                'status': event.get('status'),
                'created': event.get('created'),
            }
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise CalendarAPIError(f"Failed to create event: {e.reason}")
        except Exception as e:
            logger.error(f"Failed to create calendar event: {e}")
            raise CalendarAPIError(f"Failed to create event: {str(e)}")
    
    async def update_event(self,
                           credentials: Dict[str, Any],
                           event_id: str,
                           updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing calendar event."""
        try:
            service = self.build_service(credentials)
            
            existing_event = service.events().get(calendarId='primary', eventId=event_id).execute()
            
            if 'summary' in updates:
                existing_event['summary'] = updates['summary']
            if 'description' in updates:
                existing_event['description'] = updates['description']
            if 'start' in updates:
                existing_event['start'] = {
                    'dateTime': updates['start'].isoformat() if isinstance(updates['start'], datetime) else updates['start'],
                    'timeZone': updates.get('timezone', 'UTC'),
                }
            if 'end' in updates:
                existing_event['end'] = {
                    'dateTime': updates['end'].isoformat() if isinstance(updates['end'], datetime) else updates['end'],
                    'timeZone': updates.get('timezone', 'UTC'),
                }
            if 'recurrence' in updates:
                existing_event['recurrence'] = [updates['recurrence']] if updates['recurrence'] else []
            
            updated_event = service.events().update(
                calendarId='primary', eventId=event_id, body=existing_event
            ).execute()
            
            logger.info(f"Updated calendar event: {event_id}")
            
            return {
                'id': updated_event.get('id'),
                'html_link': updated_event.get('htmlLink'),
                'summary': updated_event.get('summary'),
                'start': updated_event.get('start'),
                'end': updated_event.get('end'),
                'status': updated_event.get('status'),
                'updated': updated_event.get('updated'),
            }
            
        except HttpError as e:
            if e.resp.status == 404:
                raise CalendarAPIError(f"Event not found: {event_id}")
            logger.error(f"Google Calendar API error: {e}")
            raise CalendarAPIError(f"Failed to update event: {e.reason}")
        except Exception as e:
            logger.error(f"Failed to update calendar event: {e}")
            raise CalendarAPIError(f"Failed to update event: {str(e)}")
    
    async def delete_event(self, credentials: Dict[str, Any], event_id: str) -> bool:
        """Delete a calendar event."""
        try:
            service = self.build_service(credentials)
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            
            logger.info(f"Deleted calendar event: {event_id}")
            return True
            
        except HttpError as e:
            if e.resp.status in (404, 410):
                logger.warning(f"Event not found or already deleted: {event_id}")
                return True
            logger.error(f"Google Calendar API error: {e}")
            raise CalendarAPIError(f"Failed to delete event: {e.reason}")
        except Exception as e:
            logger.error(f"Failed to delete calendar event: {e}")
            raise CalendarAPIError(f"Failed to delete event: {str(e)}")
    
    async def list_events(self,
                          credentials: Dict[str, Any],
                          time_min: Optional[datetime] = None,
                          time_max: Optional[datetime] = None,
                          max_results: int = 50,
                          search_query: Optional[str] = None) -> List[Dict[str, Any]]:
        """List calendar events within a time range."""
        try:
            service = self.build_service(credentials)
            
            if time_min is None:
                time_min = datetime.utcnow()
            if time_max is None:
                time_max = datetime.utcnow() + timedelta(days=7)
            
            query_params = {
                'calendarId': 'primary',
                'timeMin': time_min.isoformat() + 'Z',
                'timeMax': time_max.isoformat() + 'Z',
                'maxResults': min(max_results, 2500),
                'singleEvents': True,
                'orderBy': 'startTime',
            }
            
            if search_query:
                query_params['q'] = search_query
            
            events_result = service.events().list(**query_params).execute()
            events = events_result.get('items', [])
            
            logger.info(f"Retrieved {len(events)} calendar events")
            
            return [
                {
                    'id': event.get('id'),
                    'summary': event.get('summary'),
                    'description': event.get('description'),
                    'start': event.get('start'),
                    'end': event.get('end'),
                    'html_link': event.get('htmlLink'),
                    'status': event.get('status'),
                    'recurring_event_id': event.get('recurringEventId'),
                }
                for event in events
            ]
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {e}")
            raise CalendarAPIError(f"Failed to list events: {e.reason}")
        except Exception as e:
            logger.error(f"Failed to list calendar events: {e}")
            raise CalendarAPIError(f"Failed to list events: {str(e)}")
    
    def revoke_access(self, credentials: Dict[str, Any]) -> bool:
        """Revoke Google Calendar access tokens."""
        try:
            token = credentials.get('access_token')
            if not token:
                return True
            
            response = httpx.post(
                'https://oauth2.googleapis.com/revoke',
                params={'token': token},
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            if response.status_code == 200:
                logger.info("Successfully revoked Google Calendar access")
            return True
                
        except Exception as e:
            logger.error(f"Failed to revoke access: {e}")
            return False
    
    def verify_connection(self, credentials: Dict[str, Any]) -> bool:
        """Verify that calendar connection is working."""
        try:
            service = self.build_service(credentials)
            service.calendarList().get(calendarId='primary').execute()
            logger.info("Calendar connection verified")
            return True
        except TokenExpiredError:
            return False
        except Exception as e:
            logger.warning(f"Calendar connection verification failed: {e}")
            return False
    
    def get_refreshed_credentials(self, credentials: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get refreshed credentials if token was renewed."""
        try:
            expiry = None
            if credentials.get('expiry'):
                if isinstance(credentials['expiry'], str):
                    expiry = datetime.fromisoformat(credentials['expiry'].replace('Z', '+00:00'))
                else:
                    expiry = credentials['expiry']
            
            creds = Credentials(
                token=credentials['access_token'],
                refresh_token=credentials.get('refresh_token'),
                token_uri=credentials.get('token_uri', 'https://oauth2.googleapis.com/token'),
                client_id=credentials.get('client_id', settings.GOOGLE_CLIENT_ID),
                client_secret=credentials.get('client_secret', settings.GOOGLE_CLIENT_SECRET),
                scopes=credentials.get('scopes', self.SCOPES),
                expiry=expiry
            )
            
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
                return {
                    'access_token': creds.token,
                    'refresh_token': creds.refresh_token,
                    'token_uri': creds.token_uri,
                    'client_id': creds.client_id,
                    'client_secret': creds.client_secret,
                    'scopes': list(creds.scopes) if creds.scopes else self.SCOPES,
                    'expiry': creds.expiry.isoformat() if creds.expiry else None
                }
            return None
            
        except Exception as e:
            logger.error(f"Failed to refresh credentials: {e}")
            return None


# Recurrence helper functions
def daily_recurrence() -> str:
    return "RRULE:FREQ=DAILY"


def weekly_recurrence(days: List[str]) -> str:
    """days: List of day abbreviations (MO, TU, WE, TH, FR, SA, SU)"""
    return f"RRULE:FREQ=WEEKLY;BYDAY={','.join(days)}"


def monthly_recurrence(day_of_month: int) -> str:
    return f"RRULE:FREQ=MONTHLY;BYMONTHDAY={day_of_month}"
