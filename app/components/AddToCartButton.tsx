import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ShoppingCart} from 'lucide-react';

export function AddToCartButton({
  analytics,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-full bg-[#addc39] px-6 font-semibold text-white shadow-sm transition hover:bg-lime-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart size={20} />
            <span>Adicionar ao carrinho</span>
          </button>
        </>
      )}
    </CartForm>
  );
}
