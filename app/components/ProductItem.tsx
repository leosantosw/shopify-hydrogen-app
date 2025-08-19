import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      to={variantUrl}
      prefetch="intent"
      key={product.id}
      className="group flex flex-col rounded-xl overflow-hidden bg-white shadow-sm 
                 hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      {/* Imagem */}
      <div className="relative w-full overflow-hidden bg-gray-50">
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-gray-400 text-sm">
            Sem imagem
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h4>

        <div className="mt-auto">
          <span className="text-base font-semibold text-gray-800">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
        </div>
      </div>
    </Link>
  );
}
