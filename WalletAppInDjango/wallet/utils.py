from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime, timedelta
from django.db.models import Sum, Count, Q
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Transaction, Wallet

User = get_user_model()

def generate_platform_report():
    """
    Generate a comprehensive PDF report of platform statistics
    """
    try:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        
        # Get styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=colors.darkblue
        )
        
        normal_style = styles['Normal']
        normal_style.fontSize = 10
        normal_style.spaceAfter = 6
        
        # Title
        story.append(Paragraph("EaziPurse Platform Report", title_style))
        story.append(Spacer(1, 20))
        
        # Report generation date
        current_date = timezone.now().strftime("%B %d, %Y at %I:%M %p")
        story.append(Paragraph(f"Generated on: {current_date}", normal_style))
        story.append(Spacer(1, 20))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        
        # Get platform statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True, account_status='active').count()
        pending_users = User.objects.filter(account_status='pending').count()
        suspended_users = User.objects.filter(account_status='suspended').count()
        
        total_transactions = Transaction.objects.count()
        total_volume = Transaction.objects.aggregate(total=Sum('amount'))['total'] or 0
        verified_transactions = Transaction.objects.filter(verified=True).count()
        pending_transactions = Transaction.objects.filter(verified=False).count()
        
        # Calculate revenue (1% of total volume)
        revenue = float(total_volume) * 0.01
        
        # Summary table
        summary_data = [
            ['Metric', 'Count', 'Value'],
            ['Total Users', str(total_users), ''],
            ['Active Users', str(active_users), ''],
            ['Pending Users', str(pending_users), ''],
            ['Suspended Users', str(suspended_users), ''],
            ['Total Transactions', str(total_transactions), ''],
            ['Verified Transactions', str(verified_transactions), ''],
            ['Pending Transactions', str(pending_transactions), ''],
            ['Total Volume', '', f'₦{total_volume:,.2f}'],
            ['Platform Revenue (1%)', '', f'₦{revenue:,.2f}'],
        ]
        
        summary_table = Table(summary_data, colWidths=[2*inch, 1.5*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (2, 1), (2, -1), 'RIGHT'),
        ]))
        
        story.append(summary_table)
        story.append(Spacer(1, 20))
        
        # Recent Activity
        story.append(Paragraph("Recent Activity (Last 30 Days)", heading_style))
        
        # Get recent statistics
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_transactions = Transaction.objects.filter(
            transaction_time__gte=thirty_days_ago
        ).count()
        
        recent_users = User.objects.filter(
            date_joined__gte=thirty_days_ago
        ).count()
        
        recent_volume = Transaction.objects.filter(
            transaction_time__gte=thirty_days_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        recent_data = [
            ['Period', 'Transactions', 'New Users', 'Volume'],
            ['Last 30 Days', str(recent_transactions), str(recent_users), f'₦{recent_volume:,.2f}'],
        ]
        
        recent_table = Table(recent_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 2*inch])
        recent_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgreen),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgreen),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (3, 1), (3, -1), 'RIGHT'),
        ]))
        
        story.append(recent_table)
        story.append(Spacer(1, 20))
        
        # Top Users by Transaction Volume
        story.append(Paragraph("Top Users by Transaction Volume", heading_style))
        
        # Get users with their transaction volumes
        users_with_transactions = []
        for user in User.objects.all():
            sent_amount = Transaction.objects.filter(sender=user).aggregate(total=Sum('amount'))['total'] or 0
            received_amount = Transaction.objects.filter(receiver=user).aggregate(total=Sum('amount'))['total'] or 0
            total_volume = float(sent_amount) + float(received_amount)
            
            if total_volume > 0:
                users_with_transactions.append({
                    'user': user,
                    'total_volume': total_volume,
                    'sent_amount': float(sent_amount),
                    'received_amount': float(received_amount)
                })
        
        # Sort by total volume and take top 10
        users_with_transactions.sort(key=lambda x: x['total_volume'], reverse=True)
        top_users = users_with_transactions[:10]
        
        if top_users:
            user_data = [['Rank', 'User', 'Email', 'Total Volume']]
            for i, user_data_item in enumerate(top_users, 1):
                user = user_data_item['user']
                total_volume = user_data_item['total_volume']
                user_data.append([
                    str(i),
                    f"{user.first_name} {user.last_name}".strip() or user.email,
                    user.email,
                    f'₦{total_volume:,.2f}'
                ])
            
            user_table = Table(user_data, colWidths=[0.5*inch, 2*inch, 2*inch, 1.5*inch])
            user_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkred),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightcoral),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('ALIGN', (3, 1), (3, -1), 'RIGHT'),
            ]))
            
            story.append(user_table)
        else:
            story.append(Paragraph("No transaction data available", normal_style))
        
        story.append(Spacer(1, 20))
        
        # Transaction Types Breakdown
        story.append(Paragraph("Transaction Types Breakdown", heading_style))
        
        deposit_count = Transaction.objects.filter(transaction_type='D').count()
        transfer_count = Transaction.objects.filter(transaction_type='T').count()
        withdrawal_count = Transaction.objects.filter(transaction_type='W').count()
        
        type_data = [
            ['Transaction Type', 'Count', 'Percentage'],
            ['Deposits', str(deposit_count), f'{(deposit_count/total_transactions*100):.1f}%' if total_transactions > 0 else '0%'],
            ['Transfers', str(transfer_count), f'{(transfer_count/total_transactions*100):.1f}%' if total_transactions > 0 else '0%'],
            ['Withdrawals', str(withdrawal_count), f'{(withdrawal_count/total_transactions*100):.1f}%' if total_transactions > 0 else '0%'],
        ]
        
        type_table = Table(type_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
        type_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkorange),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightyellow),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
        ]))
        
        story.append(type_table)
        story.append(Spacer(1, 20))
        
        # Footer
        story.append(Paragraph("--- End of Report ---", normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph("This report was automatically generated by the EaziPurse platform.", normal_style))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
    except Exception as e:
        print(f"Error generating PDF report: {e}")
        raise 