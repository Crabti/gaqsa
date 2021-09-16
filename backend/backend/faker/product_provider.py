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

    DOSES = (
        "EXTRACTOS HERBACEOS",
        "BIOLOGICO",
        "TIAMULINA",
        "TILOSINA TARTRATO AL 50%",
        "OXITETRACI",
        "CEFTIOFUR",
        "AMPICILINA",
        "AMOXICILINA 40% PREMEZC Y SOLU",
    )

    PRESENTATIONS = (
        "25 DOSIS",
        "PZA 460 ML",
        "CUBETA 10",
        "PZA CBTA 5KG",
        "ML 100 ML",
    )

    def product_name(self) -> str:
        return self.random_element(self.PRODUCT_NAMES)

    def product_dose(self) -> str:
        return self.random_element(self.DOSES)

    def product_presentation(self) -> str:
        return self.random_element(self.PRESENTATIONS)
