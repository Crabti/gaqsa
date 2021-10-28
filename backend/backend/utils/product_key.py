from products.models import Product, Category


def create_product_key(category_pk, product_name):
    category = Category.objects.get(pk=category_pk)
    products_with_category = Product.objects.filter(
        category=category.pk
    ).count()
    if products_with_category < 10:
        key = f"{category.name[0:3]}" \
          f"-{product_name[0:1]}{(str(products_with_category + 1)).zfill(3)}"
    else:
        key = f"{category.name[0:3]}" \
          f"-{product_name[0:1]}{(str(products_with_category + 1)).zfill(2)}"

    

    return str(key)
