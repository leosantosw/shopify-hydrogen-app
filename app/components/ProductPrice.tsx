import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

interface ProductPriceProps {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  isAsideCart?: boolean; // Nova prop
}

export function ProductPrice({
  price,
  compareAtPrice,
  isAsideCart = true,
}: ProductPriceProps) {
  const isFree = price?.amount === '0.0' || price?.amount === '0';
  const isOnSale =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  // Define as classes de tamanho de fonte com base em isAsideCart
  const mainPriceClasses = isAsideCart
    ? 'text-base font-semibold'
    : 'text-xl md:text-2xl font-semibold';
  const salePriceClasses = isAsideCart
    ? 'text-base font-bold'
    : 'text-xl md:text-2xl font-bold';
  const comparePriceClasses = isAsideCart
    ? 'text-xs line-through'
    : 'text-base md:text-lg line-through';
  const freePriceClasses = isAsideCart
    ? 'text-base font-bold'
    : 'text-xl md:text-2xl font-bold';

  if (!price && !compareAtPrice) {
    return (
      <span className={isAsideCart ? 'inline-block h-4' : 'inline-block h-6'}>
        &nbsp;
      </span>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      {isFree ? (
        <span
          className={`text-green-600 ${freePriceClasses}`}
          aria-label="Produto grátis"
        >
          Grátis
        </span>
      ) : isOnSale && price ? (
        <div className="flex items-baseline gap-2">
          <span className={`text-red-600 ${salePriceClasses}`}>
            <Money data={price} />
          </span>
          <s className={`text-gray-500 ${comparePriceClasses}`}>
            <Money data={compareAtPrice!} />
          </s>
          {!isAsideCart && (
            <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              Oferta!
            </span>
          )}
        </div>
      ) : (
        price && (
          <span className={`text-gray-800 ${mainPriceClasses}`}>
            <Money data={price} />
          </span>
        )
      )}
    </div>
  );
}
