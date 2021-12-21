from django.test import TestCase
from django.core import mail

import os
import json
from datetime import datetime
from django.conf import settings
import tempfile
from http import HTTPStatus

from django.urls import reverse
from factory import django

from backend.utils.files import parse_invoice_xml
from backend.utils.tests import BaseTestCase
from invoices.factories.invoice import InvoiceFactory
from order.factories.order import OrderFactory, RequisitionFactory
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory
from order.models import Order
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile


THIS_DIR = os.path.dirname(os.path.abspath(__file__))

INVOICE_EXPECTED_TEST_ARRAY = [
    {
        "expected": {
            "invoice_folio": "19238",
            "amount": "1940.00",
            "client": "CEGI500910I76",
        },
        "file_dir": os.path.join(THIS_DIR, 'test_files/xml/sample1.xml')
    },
    {
        "expected": {
            "invoice_folio": "263",
            "amount": "0",
            "client": "PGU160210KKA",
        },
        "file_dir": os.path.join(THIS_DIR, 'test_files/xml/sample2.xml')
    }
]


class XMLParser(TestCase):
    def test_parse_xml(self) -> None:
        for invoice in INVOICE_EXPECTED_TEST_ARRAY:
            parsed_attributes = parse_invoice_xml(invoice["file_dir"])
            # Ignore date field since it may change with timezone setting
            parsed_attributes.pop("invoice_date")
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
            "delivery_date": datetime.now(),
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
        self.assertEqual(self.order.invoice_status, Order.INVOICE_PENDING)


class ListInvoice(BaseTestCase):
    def setUp(self) -> None:
        self.invoice_amount = 5
        InvoiceFactory.create_batch(
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
