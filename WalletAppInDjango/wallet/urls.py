from django.urls import path
from . import views

urlpatterns = [
    path('welcome/', views.welcome, name='welcome'),
    path('greet/<str:name>', views.greeting, name='greet'),

    path('secondgreet/<str:name>', views.second_greeting, name='greet'),

    path('fund/account', views.fund_wallet, name = 'fund_wallet'),

    path('fund/verify', views.verify_fund, name = 'verify_fund'),

    path('fund/transfer', views.transfer, name = 'transfer'),
    
    path('transactions/', views.transaction_history, name='transaction_history'),
    path('admin/transactions/', views.admin_transaction_history, name='admin_transaction_history'),
    path('admin/report/', views.generate_report, name='generate_report'),
]