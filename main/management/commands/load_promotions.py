import json
from django.core.management.base import BaseCommand
from main.models import Promotion

class Command(BaseCommand):
    help = 'Load promotions from JSON file'

    def handle(self, *args, **kwargs):
        with open('main/static/js/promociones.json') as f:
            promotions = json.load(f)
            for promo in promotions:
                Promotion.objects.create(
                    id=promo['id'],
                    title=promo['titulo'],
                    price=promo['precio'],
                    description='\n'.join(promo['descripcion'])
                )
        self.stdout.write(self.style.SUCCESS('Promotions loaded successfully'))
