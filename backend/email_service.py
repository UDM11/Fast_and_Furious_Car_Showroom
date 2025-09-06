import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from database import settings
from models import Booking, Customer, Vehicle
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


class EmailService:
    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.smtp_user = settings.smtp_user
        self.smtp_pass = settings.smtp_pass
        self.dealership_name = settings.dealership_name
    
    async def send_booking_confirmation(self, booking: Booking, customer: Customer, vehicle: Optional[Vehicle] = None):
        """Send booking confirmation email to customer."""
        if not customer.email or not self.smtp_host:
            return
        
        subject = f"Booking Confirmation - {self.dealership_name}"
        
        # Create email body
        body = f"""
Dear {customer.name},

Thank you for booking with {self.dealership_name}!

Booking Details:
- Type: {booking.type.replace('_', ' ').title()}
- Date & Time: {booking.scheduled_time.strftime('%B %d, %Y at %I:%M %p')}
- Status: {booking.status.title()}
"""
        
        if vehicle:
            body += f"""
Vehicle Details:
- {vehicle.year} {vehicle.make} {vehicle.model}
- Price: ${vehicle.price:,.2f}
- Mileage: {vehicle.mileage:,} miles
"""
        
        if booking.notes:
            body += f"\nNotes: {booking.notes}\n"
        
        body += f"""
If you need to reschedule or cancel this appointment, please contact us.

Best regards,
{self.dealership_name} Team
"""
        
        await self._send_email(customer.email, subject, body)
    
    async def _send_email(self, to_email: str, subject: str, body: str):
        """Send email using SMTP."""
        try:
            message = MIMEMultipart()
            message["From"] = self.smtp_user
            message["To"] = to_email
            message["Subject"] = subject
            
            message.attach(MIMEText(body, "plain"))
            
            await aiosmtplib.send(
                message,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_pass,
                use_tls=True,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")


# Global email service instance
email_service = EmailService()
