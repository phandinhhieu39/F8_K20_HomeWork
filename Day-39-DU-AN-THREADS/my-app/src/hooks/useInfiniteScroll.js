import { useEffect, useRef } from "react";

export function useInfiniteScroll({
  callback,
  hasMore = true,
  isLoading = false,
}) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          callback();
        }
      },
      { threshold: 0.1, rootMargin: "150px" },
    );

    const currentElem = triggerRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
      observer.disconnect();
    };
  }, [callback, hasMore, isLoading]);

  return triggerRef;
}

export default useInfiniteScroll;
