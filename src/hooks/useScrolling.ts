import React from "react";

export const useScrolling = (size: number, pageSize: number, page: number,
                             setPage: (page: number) => void) => {
  const observer = React.useRef<IntersectionObserver | null>(null);
  const [forceUpdate, setForceUpdate] = React.useState(0)

  const lastItemRef = (node: HTMLDivElement | null) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const totalPages = Math.ceil(size / pageSize);

        if (page + 1 < totalPages) {
          setPage(page + 1);
        }
        else {
          setPage(totalPages)
          setForceUpdate(f => f + 1)
        }
      }
    }, { threshold: 1.0 });

    if (node) {
      observer.current.observe(node);
    }
  }

  const scrollRef = (index: number, length: number) =>
    length === index + 1 ? lastItemRef : null;

  return {
    scrollRef,
    forceUpdate
  }
}