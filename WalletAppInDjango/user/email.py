from djoser.email import PasswordResetEmail
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class CustomPasswordResetEmail(PasswordResetEmail):
    template_name = "djoser/email/password_reset_email.html"
    
    def get_context_data(self):
        context = super().get_context_data()
        # Override domain and protocol for our frontend
        context['domain'] = 'eazipurse-ng.onrender.com'
        context['protocol'] = 'https'
        return context
    
    def send(self, to):
        """
        Send the email using our custom template
        """
        try:
            context = self.get_context_data()
            
            # Render HTML email
            html_message = render_to_string(self.template_name, context)
            
            # Render plain text email
            text_message = render_to_string('djoser/email/password_reset_email.txt', context)
            
            # Send email
            send_mail(
                subject=self.subject,
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=to,
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Custom password reset email sent successfully to {to}")
            
        except Exception as e:
            logger.error(f"Error sending custom password reset email to {to}: {str(e)}")
            raise 