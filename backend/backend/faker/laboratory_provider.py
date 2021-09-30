from faker.providers import BaseProvider


class LaboratoryProvider(BaseProvider):
    LAB_NAMES = (
        "ARANDA",
        "PISA",
        "BOEHRINGER",
        "ANIMAL CARE PRODUCTS",
        "ZOETIS",
        "SENOSIAIN",
        "HOLLAND",
        "ORYX",
        "SYVA",
        "Asa quim",
        "Varios",
        "COLLINS DIVISION VET"
    )

    def lab_name(self) -> str:
        return self.random_element(self.LAB_NAMES)
