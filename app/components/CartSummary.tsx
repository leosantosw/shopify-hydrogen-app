import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';

export function CartSummary({
  cart,
  layout,
}: {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
}) {
  const containerClasses =
    layout === 'page' ? 'flex-grow md:sticky md:top-28' : '';

  return (
    <section
      aria-labelledby="cart-summary"
      className={`${containerClasses} bg-gray-100 rounded-lg mx-2`}
    >
      <div className="space-y-3 px-2">
        <div className="flex items-center justify-between text-gray-600 px-2">
          <span>Subtotal</span>
          <span>
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : (
              'R$ 0,00'
            )}
          </span>
        </div>

        {cart.cost?.totalDutyAmount?.amount && (
          <div className="flex items-center justify-between text-red-500">
            <span>Descontos</span>
            <span>
              - <Money data={cart.cost.totalDutyAmount} />
            </span>
          </div>
        )}

        <hr className="border-gray-300" />

        <div className="flex items-center justify-between font-bold text-lg px-2">
          <span>Total</span>
          <span className="text-green-600">
            {cart.cost?.totalAmount?.amount ? (
              <Money data={cart.cost.totalAmount} />
            ) : (
              'R$ 0,00'
            )}
          </span>
        </div>

        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>
    </section>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="pt-2">
      <a
        href={checkoutUrl}
        target="_self"
        className="flex h-12 w-full items-center justify-center g rounded-lg bg-lime-500 px-6 font-semibold text-white hover:bg-lime-600"
      >
        <span>Finalizar Compra</span>
        <ArrowRight size={18} />
      </a>
    </div>
  );
}
