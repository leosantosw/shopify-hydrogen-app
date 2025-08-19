import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

interface ProductPriceProps {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}

export function ProductPrice({price, compareAtPrice}: ProductPriceProps) {
  const isFree = price?.amount === '0.0' || price?.amount === '0';
  const isOnSale =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  if (!price && !compareAtPrice) {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <div className="product-price flex items-center gap-2">
      {isFree ? (
        <span
          className="text-green-600 font-semibold"
          aria-label="Produto grátis"
        >
          Grátis
        </span>
      ) : isOnSale && price ? (
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-bold">
            <Money data={price} />
          </span>
          <s className="text-gray-400">
            <Money data={compareAtPrice!} />
          </s>
        </div>
      ) : (
        price && (
          <span className="text-gray-800">
            <Money data={price} />
          </span>
        )
      )}
    </div>
  );
}
