import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingCart, ArrowRight} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={`${className} flex flex-col justify-end`}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details min-h-0 flex flex-col flex-1">
        <div aria-labelledby="cart-lines" className="flex-1 overflow-y-auto">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && (
          <div className="absolute bottom-2 left-0 right-0">
            <CartSummary cart={cart} layout={layout} />
          </div>
        )}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div
      hidden={hidden}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      <div className="max-w-sm">
        <div className="mb-6">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 my-4">
          Seu carrinho está vazio
        </h3>

        <p className="text-gray-600">
          Parece que você ainda não adicionou nada. Vamos começar suas compras!
        </p>

        <Link
          to="/collections"
          onClick={close}
          prefetch="viewport"
          className="mt-4 inline-flex items-center px-6 py-3 bg-lime-500 text-white font-semibold rounded-lg hover:bg-lime-600 transition-colors duration-200"
        >
          Continuar comprando
          <ArrowRight className="w-4 h-4 ml-3" />
        </Link>
      </div>
    </div>
  );
}
