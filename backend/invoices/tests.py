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


@override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=False)
class InvoiceUpload(BaseTestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self.temp_dir

        user = UserFactory.create()
        provider = ProviderFactory.create(
            user=user
        )
        self.order = OrderFactory.create(
            provider=provider,
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

    @override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=False)
    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("create_invoice"),
            data=self.valid_payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    @override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=False)
    def test_require_admin_or_provider(self) -> None:
        response = self.service_client.post(
            reverse("create_invoice"),
            data=self.valid_payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    @override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=True)
    def test_return_bad_request_on_wrong_rfc(self) -> None:
        response = self.admin_client.post(
            reverse("create_invoice"),
            data=self.valid_payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    @override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=False)
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
        # Should return None since invoice not accepted
        self.assertEqual(self.order.invoice_status, None)


@override_settings(
    VALIDATE_RFC_ON_INVOICE_UPLOAD=False,
)
class ListInvoice(BaseTestCase):
    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    @override_settings(INVOICE_DAYS_UNTIL_INVOICE_MANAGER_ACCEPTS=1)
    def test_show_list_expired_as_invoice_manager(self) -> None:
        invoice_amount = 3
        # Should show in list
        InvoiceFactory.create_batch(
            invoice_amount,
            order=OrderFactory.create(
                user=self.client_user,
            ),
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
        response = self.invoice_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        # Show expired
        self.assertEqual(len(result), 3)

    @override_settings(INVOICE_DAYS_UNTIL_INVOICE_MANAGER_ACCEPTS=None)
    def test_hide_list_non_expired_as_invoice_manager(self) -> None:
        invoice_amount = 3
        # Should show in list
        InvoiceFactory.create_batch(
            invoice_amount,
            order=OrderFactory.create(
                user=self.client_user,
            ),
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
        response = self.invoice_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        # Show expired
        self.assertEqual(len(result), 0)

    @override_settings(INVOICE_DAYS_UNTIL_INVOICE_MANAGER_ACCEPTS=None)
    def test_show_list_on_valid_as_client(self) -> None:
        invoice_amount = 3
        # Should show in list
        InvoiceFactory.create_batch(
            invoice_amount,
            order=OrderFactory.create(
                user=self.client_user,
            ),
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
        response = self.service_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        # Dont show expired
        self.assertEqual(len(result), 3)

    def test_list_valid_as_provider(self) -> None:
        invoice_amount = 5
        InvoiceFactory.create_batch(
            invoice_amount,
            order=OrderFactory(
                provider=ProviderFactory(
                    user=self.provider_user,
                ),
            ),
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
        response = self.provider_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), invoice_amount)

    def test_list_valid_as_admin(self) -> None:
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
        response = self.admin_client.get(
            reverse("list_invoice"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.invoice_amount)


@override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=False)
class UpdateInvoiceStatus(BaseTestCase):
    def setUp(self) -> None:
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
    def test_provider_forbidden(self) -> None:
        response = self.provider_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    @override_settings(INVOICE_STATUS_UPDATE_WEEKDAYS=[9])
    def test_reject_on_non_valid_days(self) -> None:
        response = self.admin_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    @override_settings(
        INVOICE_STATUS_UPDATE_WEEKDAYS=None,
        INVOICE_DAYS_UNTIL_INVOICE_MANAGER_ACCEPTS=None,
    )
    def test_client_owns_invoice_permission(self) -> None:
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
        client_invoice = InvoiceFactory.create(
            invoice_file=invoice_file,
            xml_file=xml_file,
            order=OrderFactory.create(
                user=self.client_user,
            )
        )
        # Forbidden if client doesnt own invoice
        response = self.service_client.patch(
            reverse("update_invoice_status", kwargs={"pk": self.invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

        response = self.service_client.patch(
            reverse("update_invoice_status", kwargs={"pk": client_invoice.pk}),
            data=json.dumps(self.valid_payload_accept),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        client_invoice.refresh_from_db(
            fields=["status", "reject_reason"]
        )
        self.assertEqual(client_invoice.status, Invoice.ACCEPTED)
        self.assertGreater(len(mail.outbox), 0)

    @override_settings(
        INVOICE_STATUS_UPDATE_WEEKDAYS=None,
        INVOICE_DAYS_UNTIL_INVOICE_MANAGER_ACCEPTS=1,
    )
    def test_client_not_responsible_forbidden(self) -> None:
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
        client_invoice = InvoiceFactory.create(
            invoice_file=invoice_file,
            xml_file=xml_file,
            order=OrderFactory.create(
                user=self.client_user,
            )
        )

        response = self.service_client.patch(
            reverse("update_invoice_status", kwargs={"pk": client_invoice.pk}),
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

        response = self.invoice_client.patch(
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


@override_settings(VALIDATE_RFC_ON_INVOICE_UPLOAD=False)
class NotifyInvoice(BaseTestCase):
    def setUp(self) -> None:
        self.invoice_amount = 5
        self.invoices_notified = InvoiceFactory.create_batch(
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
            notified=True,
        )
        self.invoices_not_notified = InvoiceFactory.create_batch(
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
            notified=False,
        )
        self.valid_payload = {
            "invoices": [invoice.pk for invoice in self.invoices_not_notified]
        }

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin_or_provider(self) -> None:
        response = self.service_client.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

        response = self.invoice_client.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_return_ok_on_valid(self) -> None:
        response = self.provider_client.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_notify_change_notified_value(self) -> None:
        self.provider_client.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        for provider in self.invoices_not_notified:
            provider.refresh_from_db(
                fields=["notified"]
            )
            self.assertEqual(provider.notified, True)

    def test_return_notified_invoices(self) -> None:
        response = self.provider_client.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(
            len(result["invoices"]),
            len(self.invoices_not_notified)
        )

    def test_send_mail(self) -> None:
        mail.outbox = []
        self.provider_client.post(
            reverse("notify_invoice"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertGreater(len(mail.outbox), 0)
