from rest_framework import serializers
from .models import Transaction
from user.serializers import CustomUserSerializer


class FundSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1000, max_value=10000000)


class TransferFundSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1000, max_value=10000000)
    account_number = serializers.CharField(max_length=100)


class TransactionSerializer(serializers.ModelSerializer):
    sender = CustomUserSerializer(read_only=True)
    receiver = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'reference', 'transaction_type', 'amount', 
            'transaction_time', 'verified', 'sender', 'receiver'
        ]

