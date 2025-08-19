import {Link} from '@remix-run/react';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Minus, Plus, Trash2} from 'lucide-react';

import {useAside} from '~/components/Aside';
import {ProductPrice} from '~/components/ProductPrice';
import type {CartLayout} from '~/components/CartMain';
import {useVariantUrl} from '~/lib/variants';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li
      key={id}
      className="flex items-center gap-4 border-b border-gray-200 py-4"
    >
      {image && (
        <div className="flex-shrink-0">
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={104}
            loading="lazy"
            width={104}
            className="rounded-md border border-gray-200 object-cover object-center"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between self-stretch">
        <div>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') close();
            }}
          >
            <p className="font-semibold text-gray-800 hover:underline">
              {product.title}
            </p>
          </Link>
          <ProductPrice price={line?.cost?.totalAmount} />
          <ul className="mt-1 space-y-1 text-sm text-gray-500">
            {selectedOptions.map((option) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <CartLineQuantity line={line} />
          <CartLineRemoveButton lineIds={[id]} />
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="flex items-center gap-2">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Diminuir quantidade"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus size={16} />
        </button>
      </CartLineUpdateButton>
      <div className="text-center font-medium" style={{minWidth: '2rem'}}>
        {quantity}
      </div>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Aumentar quantidade"
          disabled={!!isOptimistic}
          name="increase-quantity"
          value={nextQuantity}
          className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        type="submit"
        className="flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
