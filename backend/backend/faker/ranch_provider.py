from faker.providers import BaseProvider


class RanchProvider(BaseProvider):
    RANCH_NAMES = (
        "AGUILAR LOYOLA TIRSO CANDIDO",
        "CARACHEO SPR DE RL DE CV",
        "MORENO GUTIERREZ ALFREDO",
        "NEGOCIACION LECHERA EL OLIMPO, SPR DE RL DE C.V.",
        "SOTO PESQUERA ALFONSO",
        "HUMBERTO JOSE URQUIZA ROIZ"
    )

    def ranch_name(self) -> str:
        return self.random_element(self.RANCH_NAMES)
