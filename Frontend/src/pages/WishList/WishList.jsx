import React from 'react';
import { Link } from 'react-router-dom';

const wishlistItems = [
  {
    id: 1,
    name: 'Lime Ease Hoodie',
    category: 'Relaxed Streetwear',
    price: 'Rs. 1,899',
    color: 'Soft olive',
    accent: 'from-lime-200 via-lime-50 to-white',
  },
  {
    id: 2,
    name: 'Cloud Cotton Tee',
    category: 'Daily Essential',
    price: 'Rs. 999',
    color: 'Warm sand',
    accent: 'from-stone-200 via-white to-lime-50',
  },
  {
    id: 3,
    name: 'Weekend Utility Pants',
    category: 'Comfort Fit',
    price: 'Rs. 2,299',
    color: 'Muted charcoal',
    accent: 'from-zinc-200 via-stone-50 to-lime-50',
  },
];

const WishList = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ee] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-lime-100 via-white to-[#ece6db] shadow-sm">
          <div className="grid gap-8 px-6 py-10 md:grid-cols-[1.4fr_0.9fr] md:px-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-700">
                Your wishlist
              </p>
              <h1 className="max-w-xl text-4xl font-black uppercase tracking-tight text-black md:text-5xl">
                Saved styles that still match your comfort-first vibe.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
                Everything here follows the same clean LimeStreet feel so the page fits naturally with the rest of the app.
              </p>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] bg-black px-6 py-6 text-white shadow-xl">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-lime-300">Saved items</p>
                <p className="mt-2 text-4xl font-black">{wishlistItems.length}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-lime-300">Ready</p>
                  <p className="mt-2 text-lg font-semibold text-white">For checkout</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-lime-300">Theme</p>
                  <p className="mt-2 text-lg font-semibold text-white">LimeStreet</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlistItems.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5"
            >
              <div className={`h-64 bg-gradient-to-br ${item.accent} p-6`}>
                <div className="flex h-full items-start justify-between">
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-sm"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-lime-600">
                      <path d="M12 21.35 10.55 20C5.4 15.24 2 12.09 2 8.25A5.25 5.25 0 0 1 7.25 3c1.74 0 3.41.81 4.5 2.09A5.95 5.95 0 0 1 16.25 3 5.25 5.25 0 0 1 21.5 8.25c0 3.84-3.4 6.99-8.55 11.78Z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-black">{item.name}</h2>
                  <p className="text-sm text-gray-500">Color note: {item.color}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-lime-700">{item.price}</p>
                  <span className="rounded-full bg-lime-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lime-700">
                    Saved
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-full bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-lime-700"
                  >
                    Move to cart
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:border-lime-600 hover:text-lime-700"
                  >
                    Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-col items-center justify-between gap-4 rounded-[1.75rem] bg-white px-6 py-6 text-center shadow-sm md:flex-row md:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-700">Keep browsing</p>
            <h2 className="mt-2 text-2xl font-bold text-black">Need more options before checkout?</h2>
          </div>
          <Link
            to="/"
            className="rounded-full bg-lime-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-lime-700"
          >
            Continue shopping
          </Link>
        </section>
      </div>
    </div>
  );
};

export default WishList;
