from django.db import models
from django.contrib.auth.models import User

class Promotion(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.title

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    promotions = models.ManyToManyField(Promotion, related_name='carts')

    def __str__(self):
        return f"Carrito de {self.user.username}"
