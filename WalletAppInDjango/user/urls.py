from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, ProfileViewSet, ProfileUpdateView, DashboardView, 
    UserDetailView, ChangePasswordView, LoginHistoryView,
    AdminDashboardView, AdminUsersView, AdminUserDetailView, AdminSettingsView, AdminAnalyticsView, AdminReportDownloadView
)

router = DefaultRouter()
router.register('profile', ProfileViewSet, basename='profile')

urlpatterns = [
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
    path('users/me/', UserDetailView.as_view(), name='user-detail'),
    path('profile/', ProfileUpdateView.as_view(), name='profile-update'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('login-history/', LoginHistoryView.as_view(), name='login-history'),
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # Admin URLs
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/users/', AdminUsersView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/settings/', AdminSettingsView.as_view(), name='admin-settings'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('admin/reports/download/', AdminReportDownloadView.as_view(), name='admin-report-download'),
]


