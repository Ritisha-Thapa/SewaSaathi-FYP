from datetime import date, time

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIRequestFactory, APITestCase

from booking.models import Booking
from booking.serializers import BookingSerializer
from services.models import Service, ServiceCategory


User = get_user_model()


class ServiceLocalizationTests(APITestCase):
    def setUp(self):
        self.category = ServiceCategory.objects.create(
            name="Cleaning",
            name_translations={"ne": "सफा-सफाइ"},
            description="Professional home cleaning",
            description_translations={"ne": "व्यावसायिक घर सफाइ"},
        )
        self.service = Service.objects.create(
            category=self.category,
            name="Deep Cleaning",
            name_translations={"ne": "गहिरो सफाइ"},
            description="Detailed room-by-room cleaning",
            description_translations={"ne": "कोठा-कोठा विस्तृत सफाइ"},
            base_price=2500,
        )

    def test_service_categories_use_accept_language_for_localized_fields(self):
        response = self.client.get(
            reverse("services-category-list"),
            HTTP_ACCEPT_LANGUAGE="ne",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["name"], "सफा-सफाइ")
        self.assertEqual(response.data[0]["description"], "व्यावसायिक घर सफाइ")
        self.assertEqual(response.data[0]["slug"], "cleaning")

    def test_service_detail_accepts_lang_query_param(self):
        response = self.client.get(
            f"{reverse('service-detail', kwargs={'pk': self.service.pk})}?lang=ne",
            HTTP_ACCEPT_LANGUAGE="en",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "गहिरो सफाइ")
        self.assertEqual(response.data["description"], "कोठा-कोठा विस्तृत सफाइ")
        self.assertEqual(response.data["category"]["name"], "सफा-सफाइ")
        self.assertEqual(response.data["category"]["slug"], "cleaning")

    def test_booking_serializer_localizes_related_service_fields(self):
        customer = User.objects.create_user(
            phone="9800000001",
            email="customer@example.com",
            password="testpass123",
            first_name="Test",
            last_name="Customer",
            address="Kathmandu",
            city="Kathmandu",
            role="customer",
        )
        booking = Booking.objects.create(
            customer=customer,
            service=self.service,
            scheduled_date=date.today(),
            scheduled_time=time(10, 0),
            service_price=self.service.base_price,
            address="Baneshwor",
            phone="9800000001",
        )

        request = APIRequestFactory().get("/booking/bookings/", HTTP_ACCEPT_LANGUAGE="ne")
        data = BookingSerializer(booking, context={"request": request}).data

        self.assertEqual(data["service_name"], "गहिरो सफाइ")
        self.assertEqual(data["service_category_name"], "सफा-सफाइ")
        self.assertEqual(data["service_category_slug"], "cleaning")
