import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check
} from "lucide-react";
import {
  fetchProducts,
  fetchTypes,
  fetchCollections,
} from "../store/slices/productSlice";
import ProductCard from "../components/ui/ProductCard";
import Button from "../components/ui/Button";
import CustomSelect from "../components/ui/CustomSelect";

// Helper component for collapsible filter sections
const FilterSection = ({ title, children, isOpen, onToggle }) => (
  <div className="border-b">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center py-4 text-left font-semibold text-gray-800 hover:text-[#2A4365]"
    >
      <span>{title}</span>
      <ChevronDown
        size={20}
        className={`transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
    {isOpen && <div className="pb-4">{children}</div>}
  </div>
);

// Helper component for filter checkboxes
const FilterCheckbox = ({ label, value, checked, onChange, count }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <input
      type="checkbox"
      value={value}
      checked={checked}
      onChange={onChange}
      className="sr-only peer" 
    />
    <span
      className={`
        h-4 w-4 rounded border border-gray-400 flex items-center justify-center transition-colors
        peer-checked:bg-[#C87941] peer-checked:border-[#C87941]
        peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-[#C87941]
        group-hover:border-[#C87941]
      `}
    >
      {/* Checkmark icon appears when checked */}
      {checked && <Check size={12} className="text-white" />}
    </span>
    <span className="text-sm text-gray-700 group-hover:text-black">
      {label} {count && `(${count})`}
    </span>
  </label>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2  border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
      >
        <ChevronLeft size={16} />
      </button>
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2  border border-gray-300 hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}
      {pages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-3 py-2  border ${
            pageNum === currentPage
              ? "bg-[#2A4365] text-white border-[#2A4365]"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {pageNum}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2  border border-gray-300 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2  border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const ProductsPage = () => {
  const { collectionName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, types, collections, loading, totalPages, currentPage } =
    useSelector((state) => state.products);

  // UI state driven by URL
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBurnerTypes, setSelectedBurnerTypes] = useState([]);
  const [selectedIgnitionTypes, setSelectedIgnitionTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  // Local component state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [openSections, setOpenSections] = useState({
    price: true,
    availability: false,
    burner: false,
    ignition: false,
    type: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const decodedCollectionName = useMemo(
    () => collectionName?.replace(/-/g, " "),
    [collectionName]
  );

  // Filter options constants
  const priceOptions = [
    { label: "Under 5000", value: "0-4999" },
    { label: "5000 to 10000", value: "5000-10000" },
    { label: "10000 to 15000", value: "10000-15000" },
    { label: "15000 to 20000", value: "15000-20000" },
    { label: "Above 20000", value: "20000+" },
  ];
  const burnerTypeOptions = [
    { label: "1 Burner", value: "1" },
    { label: "2 Burners", value: "2" },
    { label: "3 Burners", value: "3" },
    { label: "4 Burners", value: "4" },
    { label: "5 Burners", value: "5" },
  ];
  const ignitionTypeOptions = [
    { label: "Auto Ignition", value: "Auto Ignition" },
    { label: "Manual Ignition", value: "Manual Ignition" },
  ];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "name", label: "Name A-Z" },
  ];

  useEffect(() => {
    dispatch(fetchTypes());
    dispatch(fetchCollections());
  }, [dispatch]);

  const relevantTypes = useMemo(() => {
    if (decodedCollectionName && collections.length > 0) {
      const currentCollection = collections.find(
        (c) => c.name.toLowerCase() === decodedCollectionName.toLowerCase()
      );
      return currentCollection ? currentCollection.types : [];
    }
    return types;
  }, [decodedCollectionName, collections, types]);

  // Sync URL params to local UI state
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setSelectedPriceRanges(params.get("priceRanges")?.split(",") || []);
    setSelectedBurnerTypes(params.get("burners")?.split(",") || []);
    setSelectedIgnitionTypes(params.get("ignition")?.split(",") || []);
    setInStockOnly(params.get("inStock") === "true");
    setSortBy(params.get("sortBy") || "featured");

    const typesFromURL = params.get("types")?.split(",") || [];
    const typeFromURL = params.get("type");
    const allTypes = new Set(typesFromURL.filter(Boolean));
    if (typeFromURL) allTypes.add(typeFromURL);
    setSelectedTypes(Array.from(allTypes));
  }, [searchParams]);

  // Fetch data based on URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const filters = {
      page: parseInt(params.get("page") || "1", 10),
      limit: 6,
      sortBy: params.get("sortBy") || "featured",
    };

    if (collectionName) filters.collection = collectionName;
    if (params.get("q")) filters.search = params.get("q");
    if (params.get("filter") === "featured") filters.featured = true;
    if (params.get("filter") === "new") filters.newArrival = true;
    if (params.get("inStock") === "true") filters.inStock = true;
    if (params.get("burners")) filters.burners = params.get("burners");
    if (params.get("ignition")) filters.ignition = params.get("ignition");

    const priceRangesFromURL = params.get("priceRanges");
    if (priceRangesFromURL) {
      const allRanges = priceRangesFromURL.split(",").map((range) => {
        const [min, max] = range.split("-");
        return {
          min: parseInt(min, 10),
          max: max === "+" ? Infinity : parseInt(max, 10),
        };
      });
      filters.minPrice = Math.min(...allRanges.map((r) => r.min));
      const maxVal = Math.max(...allRanges.map((r) => r.max));
      if (isFinite(maxVal)) filters.maxPrice = maxVal;
    }

    const typesSet = new Set();
    const typesParam = params.get("types");
    const typeParam = params.get("type");
    if (typesParam) typesParam.split(",").forEach((t) => typesSet.add(t));
    if (typeParam) typesSet.add(typeParam);
    if (typesSet.size > 0) filters.types = Array.from(typesSet).join(",");

    dispatch(fetchProducts(filters));
  }, [dispatch, collectionName, searchParams]);

  // Clean up irrelevant URL params on collection change
  useEffect(() => {
    if (collectionName) {
      setSearchParams(
        (prev) => {
          if (collectionName !== "cooking-appliances") {
            if (prev.has("burners") || prev.has("ignition")) {
              prev.delete("burners");
              prev.delete("ignition");
            }
          }
          return prev;
        },
        { replace: true }
      );
    }
  }, [collectionName, setSearchParams]);

  const updateURLParams = (key, value) => {
    setSearchParams(
      (prev) => {
        prev.set("page", "1");
        if (!value || value.length === 0) {
          prev.delete(key);
        } else {
          prev.set(key, Array.isArray(value) ? value.join(",") : value);
        }
        return prev;
      },
      { replace: true }
    );
  };

  const handleCheckboxChange = (value, state, paramKey) => {
    const newState = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];
    updateURLParams(paramKey, newState);
  };

  const handleSortChange = (newSort) => {
    updateURLParams("sortBy", newSort);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set("page", newPage);
      setSearchParams(currentParams);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams();
    const searchQuery = searchParams.get("q");
    if (searchQuery) newSearchParams.set("q", searchQuery);

    if (
      collectionName ||
      searchParams.get("type") ||
      searchParams.get("filter")
    ) {
      navigate("/products" + (searchQuery ? `?q=${searchQuery}` : ""));
    } else {
      setSearchParams(newSearchParams);
    }
  };

  const toggleFilterVisibility = () => setIsFilterVisible(!isFilterVisible);

  const getActiveFiltersCount = () => {
    const params = new URLSearchParams(searchParams);
    let count = 0;
    if (params.has("priceRanges")) count++;
    if (params.has("inStock")) count++;
    if (params.has("burners")) count++;
    if (params.has("ignition")) count++;
    if (params.has("types") || params.has("type")) count++;
    return count;
  };

  const getPageTitle = () => {
    const searchQuery = searchParams.get("q");
    const filterType = searchParams.get("filter");
    const typeFilter = searchParams.get("type");

    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (filterType === "featured") return "Featured Products";
    if (filterType === "new") return "New Arrivals";
    if (typeFilter) return `${typeFilter} Products`;
    if (decodedCollectionName)
      return `${
        decodedCollectionName.charAt(0).toUpperCase() +
        decodedCollectionName.slice(1)
      } Products`;
    return "All Products";
  };

const getHeaderStyle = () => {

    const backgroundColor = "#2A4365";
    const subtlePattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2' stroke='%23FFFFFF' stroke-width='0.5' stroke-opacity='0.05'/%3E%3C/svg%3E")`;

    return {
      backgroundColor: backgroundColor,
      backgroundImage: subtlePattern,
    };
  };



  return (
    <div className="min-h-screen pt-12 sm:pt-16 pb-16 bg-gray-50">
      <div className="w-full mx-auto px-4">
        <div
          className="py-10 px-6  mb-8 text-white"
          style={getHeaderStyle()}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3">{getPageTitle()}</h1>
            <p className="text-lg text-gray-100 mb-4">
              Displaying {products.length} products on this page
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4  shadow-sm relative z-20">
          <div className="flex items-center mb-4 md:mb-0">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Filter size={18} />}
              onClick={toggleFilterVisibility}
              className="mr-4"
            >
              Filter{" "}
              {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid" ? "bg-gray-100" : ""
                }`}
              >
                <Grid
                  size={18}
                  className={
                    viewMode === "grid" ? "text-[#2A4365]" : "text-gray-500"
                  }
                />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list" ? "bg-gray-100" : ""
                }`}
              >
                <List
                  size={18}
                  className={
                    viewMode === "list" ? "text-[#2A4365]" : "text-gray-500"
                  }
                />
              </button>
            </div>
          </div>
          <div className="w-full md:w-48">
            <CustomSelect
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div
            className={`w-full sm:w-64 md:w-56 lg:w-60 xl:w-72 mb-6 md:mb-0 md:mr-6 ${
              isFilterVisible ? "block" : "hidden md:block"
            }`}
          >
            <div className="sticky top-24 bg-white  shadow-lg border p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-[#2A4365]">Filters</h3>
                <button
                  onClick={clearFilters}
                  disabled={getActiveFiltersCount() === 0}
                  className="text-sm text-[#C87941] hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2">
                <FilterSection
                  title="Price"
                  isOpen={openSections.price}
                  onToggle={() => toggleSection("price")}
                >
                  <div className="space-y-3">
                    {priceOptions.map((opt) => (
                      <FilterCheckbox
                        key={opt.value}
                        label={opt.label}
                        value={opt.value}
                        checked={selectedPriceRanges.includes(opt.value)}
                        onChange={() =>
                          handleCheckboxChange(
                            opt.value,
                            selectedPriceRanges,
                            "priceRanges"
                          )
                        }
                      />
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Availability"
                  isOpen={openSections.availability}
                  onToggle={() => toggleSection("availability")}
                >
                  <div className="space-y-3">
                    <FilterCheckbox
                      label="In Stock Only"
                      value="inStock"
                      checked={inStockOnly}
                      onChange={() =>
                        updateURLParams("inStock", !inStockOnly ? "true" : "")
                      }
                    />
                  </div>
                </FilterSection>

                {(!decodedCollectionName ||
                  decodedCollectionName === "cooking appliances") && (
                  <>
                    <FilterSection
                      title="Burner Type"
                      isOpen={openSections.burner}
                      onToggle={() => toggleSection("burner")}
                    >
                      <div className="space-y-3">
                        {burnerTypeOptions.map((opt) => (
                          <FilterCheckbox
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                            checked={selectedBurnerTypes.includes(opt.value)}
                            onChange={() =>
                              handleCheckboxChange(
                                opt.value,
                                selectedBurnerTypes,
                                "burners"
                              )
                            }
                          />
                        ))}
                      </div>
                    </FilterSection>
                    <FilterSection
                      title="Ignition Type"
                      isOpen={openSections.ignition}
                      onToggle={() => toggleSection("ignition")}
                    >
                      <div className="space-y-3">
                        {ignitionTypeOptions.map((opt) => (
                          <FilterCheckbox
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                            checked={selectedIgnitionTypes.includes(opt.value)}
                            onChange={() =>
                              handleCheckboxChange(
                                opt.value,
                                selectedIgnitionTypes,
                                "ignition"
                              )
                            }
                          />
                        ))}
                      </div>
                    </FilterSection>
                  </>
                )}

                <FilterSection
                  title="Type"
                  isOpen={openSections.type}
                  onToggle={() => toggleSection("type")}
                >
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {relevantTypes.map((type) => (
                      <FilterCheckbox
                        key={type.id || type._id}
                        label={type.name}
                        value={type.name}
                        checked={selectedTypes.includes(type.name)}
                        onChange={() =>
                          handleCheckboxChange(
                            type.name,
                            selectedTypes,
                            "types"
                          )
                        }
                      />
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading && currentPage === 1 ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin  h-16 w-16 border-b-2 border-[#2A4365]"></div>
              </div>
            ) : products.length === 0 && !loading ? (
              <div className="bg-white p-8  shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        viewMode="list"
                      />
                    ))}
                  </div>
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;