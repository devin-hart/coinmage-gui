import type { CardItem } from "../types";
import HorizontalCard from "./HorizontalCard";
import SkeletonCard from "./SkeletonCard";

type Props = {
  items: CardItem[];
  loading?: boolean;
  skeletonCount?: number;
};

export default function ResultList({
  items,
  loading = false,
  skeletonCount = 6,
}: Props) {
  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {items.map((item) => (
        <HorizontalCard key={item.id} item={item} />
      ))}
    </section>
  );
}
