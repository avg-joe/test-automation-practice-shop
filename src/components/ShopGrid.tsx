import { useState, useMemo } from 'react';
import AddToCart from './AddToCart';
import { getTestId } from '../utils/testId';
import type { Product, Category, CategorySlug } from '../config/products';
import { CATEGORIES } from '../config/products';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const validSlugs = new Set<string>(CATEGORIES.map((c) => c.slug));

function isValidCategory(value: string | undefined): value is CategorySlug {
  return value !== undefined && validSlugs.has(value);
}

interface ShopGridProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ShopGrid({ products, categories, initialCategory }: ShopGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>(
    isValidCategory(initialCategory) ? initialCategory : 'all',
  );
  const [sort, setSort] = useState<SortOption>('featured');

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, sort]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  return (
    <>
      {/* Toolbar */}
      <div className="shop-toolbar" data-testid={getTestId('shop-toolbar')}>
        <span className="shop-result-count" data-testid={getTestId('shop-result-count')}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </span>
        <div className="shop-sort">
          <label className="shop-sort__label" htmlFor="shop-sort">Sort by:</label>
          <select
            id="shop-sort"
            className="shop-sort__select"
            data-testid={getTestId('shop-sort-select')}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
            <option value="name-asc">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-filter" data-testid={getTestId('shop-filter')}>
          <h3 className="shop-filter__heading">Categories</h3>
          <ul className="shop-filter__list">
            <li>
              <button
                className={`shop-filter__item${activeCategory === 'all' ? ' shop-filter__item--active' : ''}`}
                data-testid={getTestId('shop-filter-all')}
                onClick={() => setActiveCategory('all')}
              >
                <span>All Products</span>
                <span className="shop-filter__item-count">{products.length}</span>
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  className={`shop-filter__item${activeCategory === cat.slug ? ' shop-filter__item--active' : ''}`}
                  data-testid={getTestId(`shop-filter-${cat.slug}`)}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  <span>
                    <span className="shop-filter__item-emoji">{cat.emoji}</span>
                    {cat.label}
                  </span>
                  <span className="shop-filter__item-count">{categoryCounts[cat.slug] || 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div className="shop-grid">
          {filtered.length === 0 ? (
            <div className="shop-empty" data-testid={getTestId('shop-empty')}>
              <div className="shop-empty__icon">🔍</div>
              <h3 className="shop-empty__title">No products found</h3>
              <p className="shop-empty__text">Try selecting a different category.</p>
              <button
                className="shop-empty__btn"
                data-testid={getTestId('shop-empty-clear-btn')}
                onClick={() => setActiveCategory('all')}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="product-grid" data-testid={getTestId('shop-grid')}>
              {filtered.map((product) => (
                <div
                  key={product.id}
                  data-testid={getTestId(`shop-product-card-${product.id}`)}
                  className="product-card"
                >
                  <div className="product-card__image">
                    {product.emoji}
                    {product.badge && (
                      <span className="product-card__badge">{product.badge}</span>
                    )}
                  </div>
                  <div className="product-card__content">
                    <p className="product-card__category">
                      {categories.find((c) => c.slug === product.category)?.label || product.category}
                    </p>
                    <h3 className="product-card__name">{product.name}</h3>
                    <div className="product-card__footer">
                      <span
                        data-testid={getTestId(`shop-product-price-${product.id}`)}
                        className="product-card__price"
                      >
                        ${product.price}
                        {product.originalPrice && (
                          <del className="product-card__price-original">${product.originalPrice}</del>
                        )}
                      </span>
                      <AddToCart
                        productId={product.id}
                        productName={product.name}
                        price={product.price}
                        emoji={product.emoji}
                        testIdSuffix={`shop-${product.id}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
