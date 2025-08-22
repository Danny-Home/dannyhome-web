# Storefront UI Drop-in

Added new storefront pages and components under `src/app/(storefront)` and `src/app/page.tsx`.

- Home: `/` with hero banner, category grid, product carousels, about, FAQ.
- Catalog: `/shop` with filters sidebar and responsive product grid.
- Product: `/product/[slug]` with gallery, details, and actions.
- Cart: `/cart` placeholder page.
- Contact: `/contact` info and map.
- Reusable components: `product-card.tsx`, `product-carousel.tsx`, `category-card.tsx`, `filters-sidebar.tsx`, `about.tsx`, `faq.tsx`, `footer.tsx`.

Code splitting: dynamic imports for heavy client components.

All pages are mobile responsive using Tailwind.