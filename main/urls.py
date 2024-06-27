# main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('alineacion/', views.alineacion, name='alineacion'),
    path('frenos/', views.frenos, name='frenos'),
    path('motor/', views.motor, name='motor'),
]