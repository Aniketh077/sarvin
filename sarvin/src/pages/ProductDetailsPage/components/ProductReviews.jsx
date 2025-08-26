import React, { useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "../../../components/ui/Button";

const ProductReviews = ({
  product,
  currentReviewPage,
  setCurrentReviewPage,
  reviewsPerPage,
}) => {
  // State for expanded comments
  const [expandedComments, setExpandedComments] = useState({});

  // Filter reviews to only include those with comments
  const validReviews =
    product?.reviews?.filter(
      (review) => review.comment && review.comment.trim() !== ""
    ) || [];

  // Pagination logic for reviews
  const paginatedReviews = validReviews.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  );

  const totalPages = Math.ceil(validReviews.length / reviewsPerPage);

  const handlePreviousPage = () => {
    if (currentReviewPage > 1) {
      setCurrentReviewPage(currentReviewPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentReviewPage < totalPages) {
      setCurrentReviewPage(currentReviewPage + 1);
    }
  };

  // Function to toggle comment expansion
  const toggleCommentExpansion = (reviewId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Function to check if comment needs truncation
  const needsTruncation = (comment) => {
    return comment.split(" ").length > 100;
  };

  // Function to truncate comment
  const truncateComment = (comment, limit = 100) => {
    const words = comment.split(" ");
    if (words.length <= limit) return comment;
    return words.slice(0, limit).join(" ") + "...";
  };

  if (!product?.reviews || product.reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
      <div className="p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
          Customer Reviews
        </h2>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - 30% width */}
          <div className="w-full lg:w-[30%] space-y-6">
            {/* Overall Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-gradient-to-br from-[#2A4365] to-[#3A5A7A] rounded-lg p-4 lg:p-6 text-white text-center">
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {product.rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = product.rating;
                    const isFullStar = star <= Math.floor(rating);
                    const isPartialStar =
                      star === Math.ceil(rating) && rating % 1 !== 0;
                    const partialPercent = isPartialStar
                      ? (rating % 1) * 100
                      : 0;

                    return (
                      <div key={star} className="relative">
                        {isPartialStar ? (
                          <div className="relative">
                            <Star className="h-4 w-4 lg:h-5 lg:w-5 text-white/40" />
                            <div
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{ width: `${partialPercent}%` }}
                            >
                              <Star className="h-4 w-4 lg:h-5 lg:w-5 text-[#C87941] fill-[#C87941]" />
                            </div>
                          </div>
                        ) : (
                          <Star
                            className={`h-4 w-4 lg:h-5 lg:w-5 ${
                              isFullStar
                                ? "text-[#C87941] fill-[#C87941]"
                                : "text-white/40"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs lg:text-sm text-white/80">
                  Based on {product.reviewCount} reviews
                </div>
              </div>
            )}

            {/* Rating Breakdown */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 text-gray-900">
                  Rating Breakdown
                </h3>
                <div className="space-y-2 lg:space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = product.reviews
                      ? product.reviews.filter(
                          (r) => Math.round(r.rating) === rating
                        ).length
                      : 0;
                    const percentage =
                      product.reviewCount > 0
                        ? (count / product.reviewCount) * 100
                        : 0;

                    return (
                      <div key={rating} className="flex items-center space-x-0">
                        <div className="flex items-center space-x-1 w-14 lg:w-16">
                          <span className="text-xs lg:text-sm font-medium w-3">
                            {rating}
                          </span>
                          <Star className="h-3 w-3 lg:h-4 lg:w-4 text-[#C87941] fill-[#C87941]" />
                        </div>
                        <div className="flex-1 h-2 lg:h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C87941] to-[#D4935C] rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs lg:text-sm text-gray-600 w-6 lg:w-8 text-right font-medium">
                          {count}
                        </span>
                        <span className="text-xs text-gray-500 w-10 lg:w-12 text-right">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 70% width */}
          <div className="w-full lg:w-[70%]">
            {/* Reviews List */}
            <div className=" lg:pt-6">
              {validReviews.length > 0 ? (
                <>
                  {/* Reviews List */}
                  <div className="space-y-4 lg:space-y-6">
                    {paginatedReviews.map((review) => {
                      const isExpanded = expandedComments[review._id];
                      const needsExpansion = needsTruncation(review.comment);

                      return (
                        <div
                          key={review._id}
                          className="bg-white border border-gray-200 rounded-lg p-4 lg:p-4 "
                        >
                          <div className="flex items-start justify-between mb-3 lg:mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#2A4365] to-[#3A5A7A] rounded-full flex items-center justify-center text-white font-semibold text-base lg:text-lg">
                                {(review.user?.name || "A")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                {/* Stars on top */}
                                <div className="flex mb-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 lg:h-4 lg:w-4 ${
                                        star <= review.rating
                                          ? "text-[#C87941] fill-[#C87941]"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>

                                {/* Name + Verified Badge */}
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-gray-900 text-sm lg:text-base">
                                    {review.user?.name || "Anonymous"}
                                  </span>
                                  {review.orderId && (
                                    <span className="text-[10px] bg-[#587297] text-white  px-1 py-0.5 rounded-full font-medium">
                                      ✓ Verified Purchase
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs lg:text-sm text-gray-500 font-medium">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>

                          <div className="ml-13 lg:ml-15">
                            <p className="text-gray-700 text-xs lg:text-sm leading-relaxed">
                              {isExpanded || !needsExpansion
                                ? review.comment
                                : truncateComment(review.comment)}
                            </p>

                            {needsExpansion && (
                              <button
                                onClick={() =>
                                  toggleCommentExpansion(review._id)
                                }
                                className="mt-2 flex items-center space-x-1 text-[#2A4365] hover:text-[#3A5A7A] text-sm font-medium transition-colors duration-200"
                              >
                                {isExpanded ? (
                                  <>
                                    <span>Show less</span>
                                    <ChevronUp className="h-4 w-4" />
                                  </>
                                ) : (
                                  <>
                                    <span>Read more</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 lg:py-16">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-400 mb-2">
                    No reviews yet
                  </h3>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
                  <div className="text-xs lg:text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentReviewPage - 1) * reviewsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentReviewPage * reviewsPerPage,
                        validReviews.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{validReviews.length}</span>{" "}
                    reviews
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentReviewPage === 1}
                      className="px-3 py-2 text-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden lg:inline ml-1">Previous</span>
                    </Button>

                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isActive = pageNumber === currentReviewPage;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentReviewPage(pageNumber)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-[#2A4365] text-white shadow-lg transform scale-105"
                                : "text-gray-500 hover:text-[#2A4365] hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentReviewPage === totalPages}
                      className="px-3 py-2 text-sm"
                    >
                      <span className="hidden lg:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
