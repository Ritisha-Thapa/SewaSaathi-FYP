from django.core.management.base import BaseCommand

from booking.expiration import expire_pending_bookings


class Command(BaseCommand):
    help = "Mark unassigned pending bookings as not_accepted after their scheduled date and time."

    def handle(self, *args, **options):
        expire_pending_bookings()
        self.stdout.write(self.style.SUCCESS("Expired pending bookings processed."))
