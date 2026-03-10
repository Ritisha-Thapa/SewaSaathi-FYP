from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from accounts.models import User
from services.models import Service, ServiceCategory
from booking.models import Booking
from insurance.models import InsurancePool, InsuranceClaim

class InsuranceLogicTest(TestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(name="Cleaning")
        self.service = Service.objects.create(
            category=self.category,
            name="House Cleaning",
            base_price=Decimal("1000.00")
        )
        self.customer = User.objects.create_user(
            username="customer",
            password="password",
            role="customer"
        )
        self.other_customer = User.objects.create_user(
            username="other",
            password="password",
            role="customer"
        )

    def test_insurance_pool_increment_on_booking(self):
        """Test that InsurancePool increases when a booking is created."""
        initial_pool_funds = InsurancePool.objects.get_or_create(id=1)[0].total_funds
        
        Booking.objects.create(
            customer=self.customer,
            service=self.service,
            service_price=self.service.base_price,
            scheduled_date=timezone.now().date(),
            scheduled_time=timezone.now().time()
        )
        
        pool = InsurancePool.objects.get(id=1)
        expected_fee = Decimal("1000.00") * Decimal("0.01")
        self.assertEqual(pool.total_funds, initial_pool_funds + expected_fee)

    def test_claim_submission_within_48h(self):
        """Test that a claim can be submitted within 48h and not after."""
        booking = Booking.objects.create(
            customer=self.customer,
            service=self.service,
            service_price=self.service.base_price,
            scheduled_date=timezone.now().date(),
            scheduled_time=timezone.now().time(),
            status='completed',
            completed_at=timezone.now()
        )

        from insurance.serializers import InsuranceClaimSerializer
        from rest_framework.request import Request
        from rest_framework.test import APIRequestFactory

        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = self.customer

        data = {
            'booking': booking.id,
            'description': "Damage occurred"
        }
        
        # Valid claim
        serializer = InsuranceClaimSerializer(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Invalid claim (after 48h)
        booking.completed_at = timezone.now() - timedelta(hours=49)
        booking.save()
        
        serializer = InsuranceClaimSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("Claims must be submitted within 48 hours", str(serializer.errors))

    def test_claim_ownership_validation(self):
        """Test that only the booking owner can file a claim."""
        booking = Booking.objects.create(
            customer=self.customer,
            service=self.service,
            service_price=self.service.base_price,
            scheduled_date=timezone.now().date(),
            scheduled_time=timezone.now().time(),
            status='completed',
            completed_at=timezone.now()
        )

        from insurance.serializers import InsuranceClaimSerializer
        from rest_framework.test import APIRequestFactory

        factory = APIRequestFactory()
        request = factory.get('/')
        request.user = self.other_customer

        data = {
            'booking': booking.id,
            'description': "Damage occurred"
        }
        
        serializer = InsuranceClaimSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn("You can only file a claim for your own bookings", str(serializer.errors))
