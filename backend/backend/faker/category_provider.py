from faker.providers import BaseProvider


class CategoryProvider(BaseProvider):
    CATEGORY_NAMES = (
        "ANALGESICO",
        "INSECTICIDA",
        "ACCESORIOS",
        "VACUNA",
        "ANTIBIOTICO",
        "METABOLISMO",
        "LAXANTE",
    )

    def category_name(self) -> str:
        return self.random_element(self.CATEGORY_NAMES)
