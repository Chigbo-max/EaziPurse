from decimal import Decimal
from datetime import datetime
from django.utils import timezone

import requests

from uuid import uuid4

from django.core.mail import send_mail
from django.db import transaction, models
from django.http import HttpResponse

from django.conf import settings
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Transaction, Wallet
from .utils import generate_platform_report

from wallet.serializers import FundSerializer, TransferFundSerializer, TransactionSerializer


@api_view()
def welcome(request):
    return Response("Welcome to eaziPurse")

def greeting(request, name):
    return HttpResponse(f"Hello,{name}")

def second_greeting(request, name):
    return render(request, 'hello.html', {'name': name})
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def fund_wallet(request):
    # Check if user can operate
    if not request.user.can_operate:
        return Response(
            {"message": "Your account is not active. Please contact support."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        data=FundSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        amount = data.validated_data['amount']
        amount*= 100
        email = request.user.email
        reference = f'ref_{uuid4().hex}'



        Transaction.objects.create(
            amount=(amount/100),
            reference=reference,
            sender =  request.user,
            )

        url = 'https://api.paystack.co/transaction/initialize'

        secret = settings.PAYSTACK_SECRET_KEY
        headers = {
            "Authorization": f"Bearer {secret}",
        }

        data = {
            "amount": amount,
            "reference": reference,
            "email": email,
            "callback_url": "http://localhost:5173/wallet/verify"
        }

        response_str = requests.post(url=url, json=data, headers=headers)
        response = response_str.json()
        if response['status']:
            return Response(data=response['data'], status=status.HTTP_200_OK)
        return Response({"message": "Unable to complete transactions"}, status=status.HTTP_302_FOUND)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


"""
curl https://api.paystack.co/transaction/initialize 
-H "Authorization: Bearer YOUR_SECRET_KEY"
-H "Content-Type: application/json"
-X POST
"""


@api_view(['GET'])
def verify_fund(request):

    reference = request.GET.get('reference')
    secret = settings.PAYSTACK_SECRET_KEY

    headers = {
        "Authorization": f"Bearer {secret}",
    }

    url =f'https://api.paystack.co/transaction/verify/{reference}'
    response_str = requests.get(url=url, headers=headers)
    response = response_str.json()
    if response['status'] and response['data']['status'] == 'success': 
        amount =  (response['data']['amount']/100)
        try:
            transaction = Transaction.objects.get(reference=reference, verified=False)
        except Transaction.DoesNotExist:
            return Response({"message": "Transaction does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Get the user from the transaction instead of request.user
        user = transaction.sender
        wallet = get_object_or_404(Wallet, user=user) #django's shortcut to get from model, instead of try and catch
        wallet.deposit(Decimal(amount))
        transaction.verified = True
        transaction.save()
        subject="EaziPurse Transaction Alert"
        message = f"""
            Transaction History:
            Your wallet has been funded with: ₦{amount}
            Reference: {reference}
            *** Thank you for using EaziPurse ***
        """
        from_email = settings.EMAIL_HOST_USER
        recipient_email= user.email
        send_mail(subject=subject,
                  message=message,
                  from_email=from_email,
                  recipient_list=[recipient_email])

        return Response({"message": "Transaction successfully verified"}, status=status.HTTP_200_OK)
    return Response({"message": "Unable to verify transaction"}, status=status.HTTP_400_BAD_REQUEST)
        # return Response(data=response['data'], status=status.HTTP_200_OK)


"""
curl https://api.paystack.co/transferrecipient 
-H "Authorization: Bearer YOUR_SECRET_KEY"
-H "Content-Type: application/json"
-X POST
"""

# @permission_classes([IsAuthenticated])
# @api_view(['POST'])
# def make_transfer_to_another_wallet(request):
#     data = TransferFundSerializer(data=request.data)
#     data.is_valid(raise_exception=True)
#     amount = data.validated_data['amount']
#     recipient_account_number = data.validated_data['account_number']
#     reference = f'ref_{uuid4().hex}'

    # sender=Wallet.objects.get(user=request.user)
    # receiver = get_object_or_404(Wallet, account_number=recipient_account_number)
    # with transaction.atomic():
    #     sender.withdraw(amount)
    #     Transaction.objects.create(
    #         amount=amount,
    #         sender=sender,
    #         reference=reference,
    #         transaction_type='T',
    #     )
    #     receiver.deposit(amount)
    #     reference=f"ref_{uuid4().hex}"
    #     Transaction.objects.create(
    #         amount=amount,
    #         receiver=receiver,
    #         reference=reference,
    #         transaction_type='D',
    #     )

    # try:
    #    sender_wallet = Wallet.objects.get(user=request.user)
    #    receiver_wallet = Wallet.objects.get(account_number=recipient_account_number)
    #
    #    if sender_wallet.balance < amount:
    #        return Response({"message": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)
    #
    #    if sender_wallet == receiver_wallet:
    #        return Response({"message":"You cannot make transfer to yourself"}, status=status.HTTP_400_BAD_REQUEST)
    #
    #    sender_wallet.balance -= amount
    #    receiver_wallet.balance += amount
    #
    #    Transaction.objects.create(
    #        reference=reference,
    #        amount=amount,
    #        sender=request.user,
    #        receiver_id=receiver_wallet.id,
    #        transaction_type='T',
    #        verified=True
    #    )
    #
    #    sender_wallet.save()
    #    receiver_wallet.save()
    #
    #    return Response({"message": f"Transfer to {recipient_account_number} was successful", "reference": f"{reference}"
    #                             , "new balance": f'{sender_wallet.balance}' }, status=status.HTTP_200_OK)
    #
    # except Wallet.DoesNotExist:
    #     return Response({"message": "Wallet does not exist"}, status=status.HTTP_404_NOT_FOUND)
    #
    # except Exception as e:
    #     return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)




@permission_classes([IsAuthenticated])
@api_view(['POST'])
def transfer(request):
    # Check if user can operate
    if not request.user.can_operate:
        return Response(
            {"message": "Your account is not active. Please contact support."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    data = TransferFundSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    amount = data.validated_data['amount']
    recipient_account_number = data.validated_data['account_number']

    # sender=Wallet.objects.get(user=request.user)
    sender_wallet = get_object_or_404(Wallet, user=request.user)
    receiver_wallet = get_object_or_404(Wallet, account_number=recipient_account_number)

    sender = request.user
    receiver = receiver_wallet.user

    with transaction.atomic():
        reference = f'ref_{uuid4().hex}'
        try:
            if sender_wallet == receiver_wallet:
                return Response({"message": "You cannot make transfer to yourself"}, status=status.HTTP_400_BAD_REQUEST)
            sender_wallet.withdraw(amount)
        except Wallet.DoesNotExist:
            return Response({"message": "Wallet does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({"message": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)

        sender_wallet.save()

        Transaction.objects.create(
            amount=amount,
            sender=sender,
            receiver=receiver,
            reference=reference,
            transaction_type='T',
            verified=True,
        )

        subject="EaziPurse Transaction Alert"
        message=f"""
        Transaction History:
        Reference id: {reference}
        You transferred ₦{amount} to {receiver.first_name or 'Unknown'} {receiver.last_name or ''}
        ***Thank you for using EaziPurse***
        """
        from_email = settings.EMAIL_HOST_USER
        sender_email = sender.email
        send_mail(subject=subject,message=message,from_email=from_email,recipient_list=[sender_email])


        receiver_wallet.deposit(amount)
        receiver_wallet.save()
        reference=f"ref_{uuid4().hex}"
        Transaction.objects.create(
            amount=amount,
            receiver=receiver,
            reference=reference,
            transaction_type='D',
            verified=True,
        )

        subject = "EaziPurse Transaction Alert"
        message = f"""
        Transaction History:
        Reference id: {reference}
        You have received ₦{amount} from {sender.first_name or 'Unknown'} {sender.last_name or ''}
        *** EaziPurse ***
        """
        from_email = settings.EMAIL_HOST_USER
        receiver_email = receiver.email

        send_mail(subject, message, from_email, recipient_list=[receiver_email])

    return Response({"message": f"Transfer to {recipient_account_number} was successful", "reference": f"{reference}"
                                , "new balance": f'{sender_wallet.balance}' }, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def transaction_history(request):
    """Get transaction history for the current user"""
    # Check if user can operate
    if not request.user.can_operate:
        return Response(
            {"message": "Your account is not active. Please contact support."}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Get latest 4 transactions where user is sender or receiver
        transactions = Transaction.objects.filter(
            models.Q(sender=request.user) | models.Q(receiver=request.user)
        ).order_by('-transaction_time')[:4]
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def admin_transaction_history(request):
    """Get all platform transactions for admin"""
    # Check if user is admin
    if not request.user.is_staff:
        return Response(
            {"message": "Admin access required"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Get all transactions with sender and receiver details
        transactions = Transaction.objects.select_related(
            'sender', 'receiver'
        ).order_by('-transaction_time')
        
        # Apply filters
        filter_type = request.GET.get('filter', 'all')
        if filter_type == 'deposits':
            transactions = transactions.filter(transaction_type='D')
        elif filter_type == 'transfers':
            transactions = transactions.filter(transaction_type='T')
        elif filter_type == 'withdrawals':
            transactions = transactions.filter(transaction_type='W')
        elif filter_type == 'verified':
            transactions = transactions.filter(verified=True)
        elif filter_type == 'pending':
            transactions = transactions.filter(verified=False)
        
        # Apply search
        search = request.GET.get('search', '')
        if search:
            transactions = transactions.filter(
                models.Q(sender__email__icontains=search) |
                models.Q(sender__first_name__icontains=search) |
                models.Q(sender__last_name__icontains=search) |
                models.Q(receiver__email__icontains=search) |
                models.Q(receiver__first_name__icontains=search) |
                models.Q(receiver__last_name__icontains=search) |
                models.Q(reference__icontains=search)
            )
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def generate_report(request):
    """Generate and download platform report as PDF"""
    # Check if user is admin
    if not request.user.is_staff:
        return Response(
            {"message": "Admin access required"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Generate the PDF report
        pdf_buffer = generate_platform_report()
        
        # Create HTTP response with PDF
        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="eazipurse_report_{timezone.now().strftime("%Y%m%d_%H%M%S")}.pdf"'
        
        return response
    except Exception as e:
        return Response({"message": f"Failed to generate report: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


