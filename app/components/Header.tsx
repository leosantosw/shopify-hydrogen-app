import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingCart, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink
          prefetch="intent"
          to="/"
          className="text-xl font-semibold text-gray-800"
          end
        >
          {shop.name}
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav
      className={`${className} hidden md:flex items-center gap-8`}
      role="navigation"
    >
      {menu?.items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="text-sm font-medium text-gray-600 hover:text-lime-600 transition-colors"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-2 sm:gap-4" role="navigation">
      <HeaderMenuMobileToggle />
      <SearchToggle />
      <NavLink
        prefetch="intent"
        to="/login"
        className="hidden sm:flex items-center text-gray-600 hover:text-lime-600 transition-colors"
      >
        <Suspense fallback={<User className="w-5 h-5" />}>
          <Await
            resolve={isLoggedIn}
            errorElement={<User className="w-5 h-5" />}
          >
            {(isLoggedIn) => (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isLoggedIn ? 'Conta' : 'Entrar'}
                </span>
              </div>
            )}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-lime-600 transition-colors"
      onClick={() => open('mobile')}
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-lime-600 transition-colors"
      onClick={() => open('search')}
    >
      <Search className="w-5 h-5" />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-lime-600 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <ShoppingCart className="w-5 h-5" />
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-lime-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
