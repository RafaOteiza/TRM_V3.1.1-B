# main/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Promotion, Cart

def index(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Correo electrónico o contraseña incorrectos.')
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

def register(request):
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        if password1 == password2:
            user = User.objects.create_user(username=email, password=password1, first_name=first_name, last_name=last_name)
            user.save()
            messages.success(request, '¡Gracias por registrarte!')
            return redirect('login')  # Redirigir a la misma página para mostrar el mensaje de éxito
        else:
            messages.error(request, 'Las contraseñas no coinciden.')
    return render(request, 'register.html')

def profile(request):
    return render(request, 'profile.html')

def alineacion(request):
    return render(request, 'alineacion.html')

def frenos(request):
    return render(request, 'frenos.html')

def motor(request):
    return render(request, 'motor.html')

@login_required
def add_to_cart(request, promotion_id):
    promotion = get_object_or_404(Promotion, id=promotion_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.promotions.add(promotion)
    return redirect('profile')

@login_required
def profile(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    return render(request, 'profile.html', {'cart': cart})

def remove_from_cart(request, promotion_id):
    cart = request.user.cart
    promotion = get_object_or_404(Promotion, id=promotion_id)
    cart.promotions.remove(promotion)
    cart.save()
    return redirect('profile')

@login_required
def checkout(request):
    cart = request.user.cart
    if request.method == 'POST':
        # Aquí puedes añadir la lógica de procesamiento de pago
        # Si el pago es exitoso, vaciar el carrito
        cart.promotions.clear()
        cart.save()
        return redirect('profile')
    return render(request, 'checkout.html', {'cart': cart})