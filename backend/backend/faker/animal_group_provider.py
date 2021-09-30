from faker.providers import BaseProvider


class AnimalGroupProvider(BaseProvider):
    GROUP_NAMES = (
        "Bovinos",
        "Ovinos",
        "Cerdos",
        "Venados",
        "Otros",
    )

    def animal_group_name(self) -> str:
        return self.random_element(self.GROUP_NAMES)
