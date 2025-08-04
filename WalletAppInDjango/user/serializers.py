
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers

from wallet.models import Wallet
from .models import Profile, AdminSettings

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    re_password = serializers.CharField(write_only=True)
    
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'password', 're_password', 'first_name', 'last_name', 'phone')
    
    def validate(self, attrs):
        print(f"Validating attrs: {attrs}")
        
        # Validate password confirmation
        if attrs['password'] != attrs['re_password']:
            raise serializers.ValidationError("Passwords don't match.")
        
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        # Check if phone already exists
        if User.objects.filter(phone=attrs['phone']).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        
        # Validate phone number format (should be 11 digits starting with 0)
        phone = attrs.get('phone', '')
        if not phone.startswith('0') or len(phone) != 11 or not phone.isdigit():
            raise serializers.ValidationError("Phone number must be 11 digits starting with 0.")
        
        print(f"Validation passed for: {attrs['email']}")
        return attrs
    
    def create(self, validated_data):
        print(f"Creating user with data: {validated_data}")
        
        # Remove re_password from validated_data as it's not a model field
        validated_data.pop('re_password', None)
        
        try:
            # Generate username from first_name if not provided
            username = validated_data.get('username')
            if not username and validated_data.get('first_name'):
                base_username = validated_data.get('first_name').lower().replace(' ', '')
                username = base_username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
            
            print(f"Generated username: {username}")
            
            # Create user with all fields explicitly
            user = User.objects.create_user(
                email=validated_data.get('email'),
                password=validated_data.get('password'),
                username=username or validated_data.get('email'),  # Fallback to email if no username
            )
            
            print(f"User created with ID: {user.id}")
            
            # Set additional fields after creation
            user.first_name = validated_data.get('first_name', '')
            user.last_name = validated_data.get('last_name', '')
            user.phone = validated_data.get('phone', '')
            user.is_active = True  
            user.save()
            
            print(f"User saved successfully: {user.email}")
            return user
        except Exception as e:
            # Log the error for debugging
            print(f"Error creating user: {e}")
            import traceback
            traceback.print_exc()
            raise serializers.ValidationError(f"Unable to create account: {str(e)}")

class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'phone', 'date_joined')
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Handle null/empty first_name and last_name
        if not data.get('first_name'):
            data['first_name'] = ''
        if not data.get('last_name'):
            data['last_name'] = ''
        return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'  # Use standard username field
    
    def validate(self, attrs):
        print(f"CustomTokenObtainPairSerializer.validate called with attrs: {attrs}")
        
        username = attrs.get('username')
        password = attrs.get('password')
        
        print(f"Username: {username}, Password provided: {bool(password)}")
        
        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            print(f"Authentication result: {user}")
            if not user:
                raise serializers.ValidationError('No active account found with the given credentials')
            if not user.is_active:
                raise serializers.ValidationError('This account is inactive')
            if user.account_status != 'active':
                raise serializers.ValidationError(f'This account is {user.account_status}. Please contact support.')
        else:
            raise serializers.ValidationError('Must include "username" and "password"')
        
        # Call parent validate to get the token
        try:
            data = super().validate(attrs)
            print(f"Parent validate result: {data}")
            
            # Add user data to response
            user_data = CustomUserSerializer(user).data
            data['user'] = user_data
            print(f"Final response data: {data}")
            
            return data
        except Exception as e:
            print(f"Exception in parent validate: {e}")
            raise


class ProfileSerializer(serializers.ModelSerializer):
    bvn = serializers.CharField(max_length=11, min_length=11)
    nin = serializers.CharField(max_length=11, min_length=11)
    
    class Meta:
        model = Profile
        fields = ['image', 'address', 'bvn', 'nin']
        read_only_fields = ['user']
    
    def validate_bvn(self, value):
        # Check if BVN is already used by another user
        if Profile.objects.filter(bvn=value).exclude(user=self.context['request'].user).exists():
            raise serializers.ValidationError('This BVN is already registered with another account.')
        return value
    
    def validate_nin(self, value):
        # Check if NIN is already used by another user
        if Profile.objects.filter(nin=value).exclude(user=self.context['request'].user).exists():
            raise serializers.ValidationError('This NIN is already registered with another account.')
        return value


class WalletSerializer(serializers.Serializer):
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    account_number = serializers.CharField(max_length=10, read_only=True)


class DashboardSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    date_joined = serializers.DateTimeField()
    wallet = WalletSerializer(read_only=True, allow_null=True)
    total_transactions = serializers.IntegerField()
    recent_transactions = serializers.ListField()
    savings_growth = serializers.FloatField()
    transaction_volume = serializers.FloatField()
    account_status = serializers.CharField()


# Admin Serializers
class LoginHistorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    timestamp = serializers.DateTimeField()
    ip_address = serializers.IPAddressField(allow_null=True)
    user_agent = serializers.CharField(allow_null=True)
    success = serializers.BooleanField()


class AdminDashboardSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_users = serializers.IntegerField()
    total_transactions = serializers.IntegerField()
    total_transaction_volume = serializers.FloatField()
    revenue = serializers.FloatField()
    active_wallets = serializers.IntegerField()
    recent_users = serializers.ListField()
    recent_transactions = serializers.ListField()


class AdminUserSerializer(serializers.ModelSerializer):
    wallet_balance = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    can_operate = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'is_active', 'account_status', 'date_joined', 'wallet_balance', 'status', 'can_operate']
    
    def get_wallet_balance(self, obj):
        try:
            return float(obj.wallet.balance) if obj.wallet else 0
        except:
            return 0
    
    def get_full_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        elif obj.first_name:
            return obj.first_name
        elif obj.last_name:
            return obj.last_name
        else:
            return obj.email
    
    def get_status(self, obj):
        return 'active' if obj.is_active else 'inactive'
    
    def get_can_operate(self, obj):
        return obj.can_operate


class AdminSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminSettings
        fields = [
            'email_notifications', 'sms_notifications', 'transaction_limit',
            'currency', 'timezone', 'platform_version', 'database',
            'system_status', 'uptime', 'updated_at'
        ]
        read_only_fields = ['currency', 'timezone', 'platform_version', 'database', 'system_status', 'uptime', 'updated_at']
