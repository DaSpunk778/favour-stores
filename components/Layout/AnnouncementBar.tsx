

export default function AnnouncementBar() {
    return (
        <div className="bg-gray-950 text-white text-xs py-2">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
                <span> This place is for announcement</span>
                <span className="font-medium text-brand-light">
                    10% Off Your First Order — Use Code: <strong>FAVOR10</strong>
                </span>
                <span className="hidden sm:block">30-Day warantee Returns</span>
            </div>
        </div>
    );
}