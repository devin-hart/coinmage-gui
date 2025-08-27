import type { CardItem } from "../types";
import HorizontalCard from "./HorizontalCard";

export default function ResultList({ items }: { items: CardItem[] }) {
  return (
    <section className="space-y-4">
      {items.map((item) => (
        <HorizontalCard key={item.id} item={item} />
      ))}
    </section>
  );
}
