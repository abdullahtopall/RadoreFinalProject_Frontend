import React, { useEffect, useState } from 'react';
import { getProductById } from '../app/data/apiService';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDetail = await getProductById(id);
        setProduct(productDetail);
      } catch (error) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return product ? (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.categoryName}</p>
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
    </div>
  ) : (
    <p>Product not found</p>
  );
};

export default ProductDetail;
