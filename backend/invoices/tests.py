from django.test import TestCase
from django.core import mail

import os
import json
from datetime import date
import tempfile
from http import HTTPStatus
from django.test.utils import override_settings

from django.urls import reverse
from factory import django

from backend.utils.files import parse_invoice_xml
from backend.utils.tests import BaseTestCase
from invoices.factories.invoice import InvoiceFactory
from invoices.models import Invoice
from order.factories.order import OrderFactory, RequisitionFactory
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings

THIS_DIR = os.path.dirname(os.path.abspath(__file__))

INVOICE_EXPECTED_TEST_ARRAY = [
    {
        "expected": {
            "invoice_folio": "19238",
            "amount": "1940.00",
            "client": "CEGI500910I76",
            "invoice_date": "2021-12-16 09:10:32+00:00",
        },
        "file_dir": os.path.join(THIS_DIR, 'test_files/xml/sample1.xml')
    },
    {
        "expected": {
            "invoice_folio": "263",
            "amount": "0",
            "client": "PGU160210KKA",
            "invoice_date": "2021-12-15 17:35:03+00:00",
        },
        "file_dir": os.path.join(THIS_DIR, 'test_files/xml/sample2.xml')
    }
]


class XMLParser(TestCase):
    def test_parse_xml(self) -> None:
        for invoice in INVOICE_EXPECTED_TEST_ARRAY:
            parsed_attributes = parse_invoice_xml(invoice["file_dir"])
            parsed_attributes["invoice_date"] = str(
                parsed_attributes["invoice_date"]
            )
            self.assertEqual(parsed_attributes, invoice["expected"])


class InvoiceUpload(BaseTestCase):
    def setUp(self) -> None:
        mail.outbox = []
        self.temp_dir = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self.temp_dir

        user = UserFactory.create()
        provider = ProviderFactory.create(
            user=user
        )
        self.order = OrderFactory.create(
            provider=provider,
            user=user
        )
        RequisitionFactory.create(
            price=INVOICE_EXPECTED_TEST_ARRAY[0]["expected"]["amount"],
            order=self.order
        )

        xml_file_data = File(open(os.path.join(
            THIS_DIR, 'test_files/xml/sample1.xml'), 'rb'))
        xml_file = SimpleUploadedFile(
            'sample1.xml',
            xml_file_data.read(),
            content_type="multipart/form-data"
        )
        invoice_file_data = File(open(
            os.path.join(THIS_DIR, 'test_files/pdf/sample1.pdf'), 'rb'))
        invoice_file = SimpleUploadedFile(
            'sample1.pdf',
            invoice_file_data.read(),
            content_type="multipart/form-data"
        )
        extra_file_data = File(open(os.path.join(
            THIS_DIR, 'test_files/pdf/sample2.pdf'), 'rb'))
        extra_file = SimpleUploadedFile(
            'sample2.pdf',
            extra_file_data.read(),
            content_type="multipart/form-data"
        )
        self.valid_payload = {
            "order": self.order.pk,
            "xml_file": xml_file,
            "delivery_date": date.today(),
            "invoice_file": invoice_file,
            "extra_file": extra_file,
        }

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("create_invoice"),
            data=self.valid_payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin_or_provider(self) -> None:
        response = self.service_client.post(
            reverse("create_invoice"),
            data=self.valid_payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_upload_on_valid_payload(self) -> None:
        response = self.admin_client.post(
            reverse("create_invoice"),
            data=self.valid_payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        dir_files_count = sum(
            [len(files) for r, d, files in os.walk(self.temp_dir)]
        )
        self.assertEqual(dir_files_count, 3)
        self.assertGreater(len(mail.outbox), 0)
        # Should return None since invoice not accepted
        self.assertEqual(self.order.invoice_status, None)


class ListInvoice(BaseTestCase):
    def setUp(self) -> None:
        self.invoice_amount = 5
        self.invoices = InvoiceFactory.create_batch(
            self.invoice_amount,
            invoice_file=django.FileField(
                from_path=os.path.join(
                    THIS_DIR, 'test_files/pdf/sample1.pdf'
                ),
            ),
            extra_file=django.FileField(
                from_path=os.path.join(
                    THIS_DIR, 'test_files/pdf/sample2.pdf'
                ),
            ),
            xml_file=django.FileField(
                from_path=os.path.join(
                    THIS_DIR, 'test_files/xml/sample1.xml'
                ),
            ),
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin(self) -> None:
        response = self.service_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

        response = self.provider_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_list_valid(self) -> None:
        response = self.admin_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.invoice_amount)


class UpdateInvoiceStatus(BaseTestCase):
    def setUp(self) -> None:
        mail.outbox = []
        xml_file_data = File(open(os.path.join(
            THIS_DIR, 'test_files/xml/sample1.xml'), 'rb'))
        xml_file = SimpleUploadedFile(
            'sample1.xml',
            xml_file_data.read(),
            content_type="multipart/form-data"
        )
        invoice_file_data = File(open(
            os.path.join(THIS_DIR, 'test_files/pdf/sample1.pdf'), 'rb'))
        invoice_file = SimpleUploadedFile(
            'sample1.pdf',
            invoice_file_data.read(),
            content_type="multipart/form-data"
        )
        self.invoice = InvoiceFactory.create(
            invoice_file=invoice_file,
            xml_file=xml_file,
        )
        self.valid_payload_accept = {
            "status": Invoice.ACCEPTED,
        }
        self.valid_payload_reject = {
            "status": Invoice.REJECTED,
            "reject_reason": "...",
        }

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=None)
    def test_require_authentication(self) -> None:
        response = self.anonymous.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=None)
    def test_require_admin(self) -> None:
        response = self.service_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

        response = self.provider_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=[9])
    def test_reject_on_non_valid_days(self) -> None:
        print(settings.INVOICE_STATUS_UPDATE_WEEKDAYS)
        yesterday = date.today().weekday() - 1
        settings.INVOICE_STATUS_UPDATE_WEEKDAYS = [
            yesterday
        ]
        response = self.provider_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=None)
    def test_accept_on_valid(self) -> None:
        response = self.admin_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.invoice.refresh_from_db(
            fields=["status", "reject_reason"]
        )
        self.assertEqual(self.invoice.status, Invoice.ACCEPTED)
        self.assertGreater(len(mail.outbox), 0)

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=None)
    def test_reject_on_valid(self) -> None:
        response = self.admin_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_reject),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.invoice.refresh_from_db(
            fields=["status", "reject_reason"]
        )
        self.assertEqual(self.invoice.status, Invoice.REJECTED)
        self.assertEqual(
            self.invoice.reject_reason,
            self.valid_payload_reject['reject_reason']
        )

        self.assertGreater(len(mail.outbox), 0)

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=None)
    def test_reject_on_valid_without_reason(self) -> None:
        valid_payload_reject_no_reason = self.valid_payload_reject
        valid_payload_reject_no_reason.pop("reject_reason")
        response = self.admin_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(valid_payload_reject_no_reason),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.invoice.refresh_from_db(
            fields=["status", "reject_reason"]
        )
        self.assertEqual(self.invoice.status, Invoice.REJECTED)
        self.assertEqual(
            self.invoice.reject_reason,
            "N/A"
        )

        self.assertGreater(len(mail.outbox), 0)
