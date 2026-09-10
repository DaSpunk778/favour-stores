// Loading placeholder matching ProductCard's dimensions. Static data returns
// instantly so this won't show today, but it's ready for the DB swap.
export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse">
      <div className="w-full aspect-square bg-gray-100" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3.5 w-full rounded bg-gray-100" />
        <div className="h-3.5 w-2/3 rounded bg-gray-100" />
        <div className="h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        <div className="mt-1 h-8 w-full rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
