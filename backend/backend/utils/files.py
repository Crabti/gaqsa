import xml.etree.ElementTree as ET
from django.utils import timezone
from django.utils.dateparse import parse_datetime


def parse_invoice_xml(file) -> dict:
    tree = ET.parse(file)
    root = tree.getroot()
    namespaces = {'cfdi': root.tag.split('}')[0].strip('{')}
    invoice_folio = root.get("Folio")
    invoice_date = parse_datetime(root.get("Fecha"))
    invoice_date = timezone.make_aware(
        invoice_date, timezone.get_current_timezone()
    )
    amount = root.get("Total")
    client = root.find("cfdi:Receptor", namespaces).get("Rfc")
    return {
        "invoice_folio": invoice_folio,
        "invoice_date": invoice_date,
        "amount": amount,
        "client": client,
    }
