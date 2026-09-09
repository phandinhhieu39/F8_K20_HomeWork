import Badge from './Badge';
import { formatCurrency } from '../utils/formatCurrency';
import './ProductItem.css';

function ProductItem({ product, onAddToCart }) {
  const { name, price, image, inStock, discountPercent } = product;
  const finalPrice = discountPercent > 0 ? price * (1 - discountPercent / 100) : price;

  const handleClick = () => {
    if (inStock && onAddToCart) {
      onAddToCart(name, finalPrice);
    }
  };

  return (
    <article className={`product-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
        <div className="badge-wrapper">
          {!inStock && <Badge type="outOfStock" text="Hết hàng" />}
          {discountPercent > 0 && <Badge type="discount" text={`-${discountPercent}%`} />}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="product-pricing">
          <span className="final-price">{formatCurrency(finalPrice)}</span>
          {discountPercent > 0 && (
            <span className="original-price">{formatCurrency(price)}</span>
          )}
        </div>

        <button
          type="button"
          className="cart-button"
          disabled={!inStock}
          onClick={handleClick}
        >
          {inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </article>
  );
}

export default ProductItem;