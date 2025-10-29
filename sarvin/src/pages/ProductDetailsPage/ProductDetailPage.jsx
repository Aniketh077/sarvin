import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import { useCart } from '../../contexts/CartContext';
import { fetchProductDetails, fetchProducts } from '../../store/slices/productSlice';
import ProductBreadcrumb from './components/ProductBreadcrumb';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import ProductReviews from './components/ProductReviews';
import RelatedProducts from './components/RelatedProducts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { Helmet } from 'react-helmet-async'; 

const ProductDetailPage = () => {
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('specifications'); 
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [sortType, setSortType] = useState('newest');
  const reviewsPerPage = 3;
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (identifier) { 
      dispatch(fetchProductDetails(identifier)); 
    }
  }, [identifier, dispatch]);



useEffect(() => {
  if (product && product.productCollection && product.type?._id) {
    console.log("[Limit 10 Effect] Fetching related for:", product.productCollection, product.type.name);

    dispatch(
      fetchProducts({
        collection: product.productCollection,
        type: product.type._id,
        limit: 10, // Using limit 10
      })
    ).then((action) => {
      console.log("[Limit 10 Effect] API Response:", action.payload); // Log raw response

      if (action.payload && Array.isArray(action.payload.products)) {
        // Filter out the current product
        let relatedBeforeFilter = action.payload.products;
        let relatedAfterFilter = relatedBeforeFilter.filter((p) => p._id !== product._id);

        // console.log(`[Limit 10 Effect] Products received: ${relatedBeforeFilter.length}, After filtering current: ${relatedAfterFilter.length}`, relatedAfterFilter); 
        let shuffledRelated = [...relatedAfterFilter]; // Work on a copy
        for (let i = shuffledRelated.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledRelated[i], shuffledRelated[j]] = [shuffledRelated[j], shuffledRelated[i]];
        }
        // console.log("[Limit 10 Effect] After shuffle:", shuffledRelated); // Log after shuffle

        // Slice after shuffling
        let finalRelated = shuffledRelated.slice(0, 4);
        // console.log("[Limit 10 Effect] After slice(0, 4):", finalRelated); // Log after slice

        setRelatedProducts(finalRelated); // Set the final result

      } else {
        console.log("[Limit 10 Effect] No 'products' array found in payload or payload is invalid.");
        setRelatedProducts([]); // Ensure state is cleared if no products
      }
    }).catch(error => {
      console.error("[Limit 10 Effect] Error fetching related products:", error);
      setRelatedProducts([]); // Clear on error
    });
  } else {
    // console.log("[Limit 10 Effect] Skipping fetch: product/collection/type missing.", product);
    // setRelatedProducts([]); // Optionally clear here too if needed
  }
}, [product, dispatch, product?.productCollection, product?.type?._id]);

  useEffect(() => {
    if (product) {
      setActiveImage(0);
    }
  }, [product]);

const handleAddToCart = () => {
  // Add a check to make sure product is fully loaded
  if (product && product._id) { 
    addToCart(product, quantity); // <--- PASS THE ORIGINAL 'product'
  } else {
    // You can add a toast error here
    console.error("Cannot add to cart: Product data is not available.");
  }
};

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!product) {
    return <ErrorMessage error="Product not found" />;
  }

  const collectionName = product.productCollection || 'Unknown';

  return (
    <>
     <Helmet>
        <title>{`${product.name} - Sarvin India`}</title>
        <meta name="description" content={product.description.substring(0, 160)} />

        {/* --- Open Graph / Facebook / WhatsApp Meta Tags --- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={`${product.name} - Sarvin India`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.image} />

        {/* --- Twitter Card Meta Tags --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={`${product.name} - Sarvin India`} />
        <meta name="twitter:description" content={product.description.substring(0, 160)} />
        <meta name="twitter:image" content={product.image} />
      </Helmet>
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <ProductBreadcrumb 
          product={product}
          collectionName={collectionName}
        />
        
        <div className="bg-white  shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <ProductImages
              product={product}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />
            
            <ProductInfo
              product={product}
              quantity={quantity}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
              isDescriptionExpanded={isDescriptionExpanded}
              setIsDescriptionExpanded={setIsDescriptionExpanded}
              collectionName={collectionName}
            />
          </div>

          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <ProductReviews
          product={product}
          currentReviewPage={currentReviewPage}
          setCurrentReviewPage={setCurrentReviewPage}
          reviewsPerPage={reviewsPerPage}
          sortType={sortType}
          setSortType={setSortType}
        />
        
        {relatedProducts.length > 0 && (
          <RelatedProducts
            relatedProducts={relatedProducts}
           collectionName={collectionName}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;