from faker.providers import BaseProvider


class ProductProvider(BaseProvider):
    PRODUCT_NAMES = (
        "PRO PLAN CACHORRO CO",
        "GREEN MIX",
        "BAYOVAC HORIZON X",
        "ABSORBINE LINIM",
        "ABSORBINE LINIM",
        "ABSORVET",
        "BUSCAPINA",
        "DOMOSO",
        "TIAMUCOLL-100",
        "TILO-VET 50",
        "OXITETRACICLINA POLV",
        "ACTYNOXEL RTU INY",
        "ACTYNOXEL RTU INY",
        "ADVOCIN INY. 18%",
        "AMPIPEN",
    )

    PRESENTATIONS = (
        "25 DOSIS",
        "PZA 460 ML",
        "CUBETA 10",
        "PZA CBTA 5KG",
        "ML 100 ML",
    )

    ACTIVE_SUBSTANCES = (
        "BRUCELLA A",
        "AMPICILINA",
        "TILOSINA",
        "CEFTIOFUR",
        "ACEITE MIN",
        "ACIDO ACET",
        "CALCIO+GLUCONATO",
        "CEFTIOFUR 5%",
        "GENTAMICIN",
        "SYRVET",
        "LATEX",
        "MONOMERO-A"
    )

    def product_name(self) -> str:
        return self.random_element(self.PRODUCT_NAMES)

    def product_active_substance(self) -> str:
        return self.random_element(self.ACTIVE_SUBSTANCES)

    def product_presentation(self) -> str:
        return self.random_element(self.PRESENTATIONS)
