"use client";

import { useState, useEffect, Fragment, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Menu, ArrowUpRight, ChevronRight, Briefcase, X } from "lucide-react";

interface ClientHomeProps {
    items: any[];
}

function ClientHomeContent({ items }: ClientHomeProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const searchParams = useSearchParams();
    const router = useRouter();

    const CATEGORIES = [
        { label: "All", value: "All" },
        { label: "Startups", value: "Startups", keywords: ["스타트업", "startup", "Startups"] },
        { label: "Design", value: "Design", keywords: ["디자인", "design", "Design"] },
        { label: "Tech", value: "Tech", keywords: ["개발", "dev", "Dev", "Development", "Tech"] },
        { label: "Product", value: "Product", keywords: ["기획", "pm", "PM", "Planning", "Product"] },
        { label: "Growth", value: "Growth", keywords: ["마케팅", "marketing", "Marketing", "Growth"] },
    ];

    // Sync URL param with state
    useEffect(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
            const matchedCategory = CATEGORIES.find(c => c.value.toLowerCase() === categoryParam.toLowerCase());
            if (matchedCategory) {
                setSelectedCategory(matchedCategory.value);
            }
        }
    }, [searchParams]);

    // Update URL when category changes
    const handleCategoryChange = (categoryValue: string) => {
        setSelectedCategory(categoryValue);
        if (categoryValue === "All") {
            router.push("/", { scroll: false });
        } else {
            router.push(`/?category=${categoryValue}`, { scroll: false });
        }
        setIsMobileMenuOpen(false);
    };

    // Close search on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };

        if (isSearchOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSearchOpen]);

    const filteredItems = items.filter(item => {
        // 1. Search Filter
        const matchesSearch =
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

        // 2. Category Filter
        if (selectedCategory === "All") return matchesSearch;

        const selectedCatData = CATEGORIES.find(c => c.value === selectedCategory);
        const matchesCategory = selectedCatData?.keywords?.some(keyword =>
            item.category && item.category.toLowerCase().includes(keyword.toLowerCase())
        ) || (item.category && item.category === selectedCategory); // Fallback exact match

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#0b0c10] text-gray-300 font-sans">
            {/* 2. Header (Sticky) */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0b0c10]/80">
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xl font-bold tracking-tight text-white">
                            Ledgr
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="hidden xl:flex items-center text-gray-400 hover:text-white transition-colors"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            className="xl:hidden text-gray-400"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col items-center pt-24 px-6 md:pt-32">
                    <button
                        className="absolute top-6 right-6 text-gray-400 hover:text-white md:top-8 md:right-8"
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-2xl bg-transparent border-b-2 border-gray-800 text-2xl md:text-4xl font-bold text-white pb-4 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
                        autoFocus
                    />
                </div>
            )}

            {/* Hero Section */}
            <section className="relative w-full min-h-[55vh] flex flex-col justify-center items-center px-4 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.8)),url('/hero-bg.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden text-center">


                <div className="relative z-10 text-center max-w-7xl mx-auto space-y-6 px-4">
                    <h1 className="text-4xl lg:text-[50px] font-bold text-white leading-[1.1] tracking-tight break-keep">
                        작은 발견이 <br className="block xl:hidden" />
                        거대한 비즈니스가 <br className="block xl:hidden" />
                        됩니다
                    </h1>
                    <p className="text-sm lg:text-lg text-zinc-400 max-w-3xl mx-auto break-keep leading-relaxed">
                        전 세계 1%의 숨겨진 테크 트렌드와 <br className="block xl:hidden" />
                        수익 모델을 가장 먼저 분석해 드립니다.
                    </p>
                </div>
            </section>

            {/* 3. Main Wide Layout (3-6-3 Grid) */}
            <div className="max-w-[1800px] mx-auto px-6 py-6 md:py-10">
                <div className="grid grid-cols-1 xl:grid-cols-11 gap-6">

                    {/* Left Sidebar (Desktop Only) - Expanded Width (col-span-3) */}
                    <aside className="hidden xl:block col-span-2 sticky top-24 h-fit space-y-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => handleCategoryChange(category.value)}
                                className={`w-full text-left font-medium text-base px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:text-white ${selectedCategory === category.value
                                    ? "text-white font-bold bg-white/5"
                                    : "text-gray-400"
                                    }`}
                            >
                                <span>{category.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Main Feed Content (Center) - col-span-6 */}
                    <main className="col-span-1 xl:col-span-7">

                        {/* Intro Text */}
                        <div className="mb-6 md:mb-8 flex items-center justify-between relative">
                            <h2 className="text-lg md:text-2xl font-bold text-white leading-none">Latest Articles</h2>
                            <button
                                className="md:hidden text-gray-400"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Mobile Dropdown Menu */}
                            {isMobileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-[#121212] rounded-xl shadow-xl z-20 md:hidden overflow-hidden">
                                    <div className="py-2">
                                        {CATEGORIES.map((cat) => (
                                            <div
                                                key={cat.value}
                                                onClick={() => handleCategoryChange(cat.value)}
                                                className={`px-4 py-2 hover:bg-white/5 cursor-pointer text-sm transition-all duration-300 ${selectedCategory === cat.value ? "text-white font-bold" : "text-gray-400 hover:text-white"
                                                    }`}
                                            >
                                                {cat.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Grid Layout (3 Columns inside Center) */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {filteredItems.map((item, index) => (
                                <Fragment key={item.id}>
                                    <Link href={`/article/${item.id}`} className="group block h-full">
                                        <article className="flex flex-col h-full bg-[#121212] rounded-2xl overflow-hidden border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:border-gray-600 hover:shadow-xl hover:shadow-black/50">

                                            {/* Thumbnail Image */}
                                            <div className="relative aspect-video overflow-hidden bg-gray-900">
                                                {item.image_url && (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.title}
                                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                    />
                                                )}
                                                {!item.image_url && (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                                        <span className="text-xs">No Image</span>
                                                    </div>
                                                )}
                                                {/* Overlay (Optional) */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col flex-1 p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-gray-400">
                                                        {item.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{item.date}</span>
                                                </div>

                                                <h3 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2">
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                                                    {item.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-auto">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                        {item.brand}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>

                                    {/* Mobile In-Feed Banners (Inject after 2nd card) */}
                                    {index === 1 && (
                                        <div className="xl:hidden flex flex-col">
                                            {/* Header matching main feed */}
                                            <div className="mb-6 flex items-center justify-between">
                                                <h2 className="text-lg font-bold text-white leading-none">The Studio</h2>
                                            </div>

                                            {/* Banner Container matching Grid structure */}
                                            <div className="flex flex-col gap-6">
                                                {/* Large Banner 1: Hiring */}
                                                <div className="relative w-full h-[250px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                                                    <img
                                                        src="/banner.png"
                                                        alt="Idea Verification"
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>

                                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                                        <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                                                            Sell First, Build Later.
                                                        </h3>
                                                        <p className="text-gray-300 text-xs mb-3 line-clamp-1">
                                                            Validate your idea in weeks, not months.
                                                        </p>
                                                        <a
                                                            href="https://drawn-so.netlify.app/"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-white text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all border border-white/10 w-fit"
                                                        >
                                                            Learn More <ChevronRight className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Large Banner 2: Private Coaching */}
                                                <div className="relative w-full h-[120px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex">
                                                    {/* Left Side (70%) - Content */}
                                                    <div className="w-[70%] bg-[#121212] p-5 flex flex-col justify-center gap-3 relative">
                                                        <div>
                                                            <span className="text-purple-400 font-bold tracking-wider text-[10px] block mb-1 uppercase">Private Coaching</span>
                                                            <h3 className="text-sm font-bold text-white leading-snug">
                                                                Career Quantum Leap<br />1:1 Private Mentoring
                                                            </h3>
                                                        </div>
                                                        <button
                                                            onClick={() => setIsServiceModalOpen(true)}
                                                            className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit"
                                                        >
                                                            Learn More <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    {/* Right Side (30%) - White/Image Area */}
                                                    <div className="w-[30%] bg-white relative">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop"
                                                            alt="Coaching"
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Duplicate Banner 1 */}
                                                <div className="relative w-full h-[120px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex">
                                                    {/* Left Side (70%) - Content */}
                                                    <div className="w-[70%] bg-[#121212] p-5 flex flex-col justify-center gap-3 relative">
                                                        <div>
                                                            <span className="text-blue-400 font-bold tracking-wider text-[10px] block mb-1 uppercase">Business</span>
                                                            <h3 className="text-sm font-bold text-white leading-snug">
                                                                Corporate Training<br />Hands-on Workshops
                                                            </h3>
                                                        </div>
                                                        <button
                                                            onClick={() => setIsServiceModalOpen(true)}
                                                            className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit"
                                                        >
                                                            Learn More <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    {/* Right Side (30%) - White/Image Area */}
                                                    <div className="w-[30%] bg-white relative">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"
                                                            alt="Business"
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Duplicate Banner 2 */}
                                                <div className="relative w-full h-[120px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex">
                                                    {/* Left Side (70%) - Content */}
                                                    <div className="w-[70%] bg-[#121212] p-5 flex flex-col justify-center gap-3 relative">
                                                        <div>
                                                            <span className="text-emerald-400 font-bold tracking-wider text-[10px] block mb-1 uppercase">Community</span>
                                                            <h3 className="text-sm font-bold text-white leading-snug">
                                                                Grow Together<br />Exclusive Membership
                                                            </h3>
                                                        </div>
                                                        <button
                                                            onClick={() => setIsServiceModalOpen(true)}
                                                            className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit"
                                                        >
                                                            Learn More <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    {/* Right Side (30%) - White/Image Area */}
                                                    <div className="w-[30%] bg-white relative">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2670&auto=format&fit=crop"
                                                            alt="Community"
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                        </div>
                    </main>

                    {/* Right Sidebar (Desktop Only) - col-span-3 */}
                    <aside className="hidden xl:block col-span-2 sticky top-24 h-fit">

                        {/* Spacer to align with Main Feed "Latest Articles" header offset */}
                        {/* Header matching main feed */}
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">The Studio</h2>
                        </div>

                        {/* Banner Container matching Grid structure */}
                        <div className="flex flex-col gap-6">
                            {/* Large Banner 1: Hiring */}
                            <div className="relative w-full h-[250px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                                <img
                                    src="/banner.png"
                                    alt="Idea Verification"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                                        Sell First, Build Later.
                                    </h3>
                                    <p className="text-gray-300 text-xs mb-3 line-clamp-1">
                                        Validate your idea in weeks, not months.
                                    </p>
                                    <a
                                        href="https://drawn-so.netlify.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all border border-white/10 w-fit"
                                    >
                                        Learn More <ChevronRight className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            {/* Large Banner 2: Private Coaching */}
                            <div className="relative w-full h-[120px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex">
                                {/* Left Side (70%) - Content */}
                                <div className="w-[70%] bg-[#121212] p-5 flex flex-col justify-center gap-3 relative">
                                    <div>
                                        <span className="text-purple-400 font-bold tracking-wider text-[10px] block mb-1 uppercase">Private Coaching</span>
                                        <h3 className="text-sm font-bold text-white leading-snug">
                                            Career Quantum Leap<br />1:1 Private Mentoring
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setIsServiceModalOpen(true)}
                                        className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit"
                                    >
                                        Learn More <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                {/* Right Side (30%) - White/Image Area */}
                                <div className="w-[30%] bg-white relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop"
                                        alt="Coaching"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Duplicate Banner 1 */}
                            <div className="relative w-full h-[120px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex">
                                {/* Left Side (70%) - Content */}
                                <div className="w-[70%] bg-[#121212] p-5 flex flex-col justify-center gap-3 relative">
                                    <div>
                                        <span className="text-blue-400 font-bold tracking-wider text-[10px] block mb-1 uppercase">Business</span>
                                        <h3 className="text-sm font-bold text-white leading-snug">
                                            Corporate Training<br />Hands-on Workshops
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setIsServiceModalOpen(true)}
                                        className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit"
                                    >
                                        Learn More <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                {/* Right Side (30%) - White/Image Area */}
                                <div className="w-[30%] bg-white relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"
                                        alt="Business"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Duplicate Banner 2 */}
                            <div className="relative w-full h-[120px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex">
                                {/* Left Side (70%) - Content */}
                                <div className="w-[70%] bg-[#121212] p-5 flex flex-col justify-center gap-3 relative">
                                    <div>
                                        <span className="text-emerald-400 font-bold tracking-wider text-[10px] block mb-1 uppercase">Community</span>
                                        <h3 className="text-sm font-bold text-white leading-snug">
                                            Grow Together<br />Exclusive Membership
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setIsServiceModalOpen(true)}
                                        className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit"
                                    >
                                        Learn More <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                {/* Right Side (30%) - White/Image Area */}
                                <div className="w-[30%] bg-white relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1550684848-86a5d8727436?q=80&w=2670&auto=format&fit=crop"
                                        alt="Community"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                    </aside>

                </div>
            </div>
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsServiceModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-[#1a1a1a] border border-black rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsServiceModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center space-y-6">
                            <h2 className="text-xl font-bold text-white">
                                서비스 고도화 작업 중
                            </h2>

                            <div className="space-y-2 text-gray-300 text-sm leading-relaxed keep-all">
                                <p>현재 더 높은 퀄리티의 서비스를 제공하기 위해<br />리뉴얼 작업을 진행하고 있습니다.</p>
                                <p>관련된 <span className="text-white font-bold">비즈니스 제휴나 사전 문의</span>는<br />언제든 환영합니다.</p>
                            </div>

                            <a
                                href="mailto:teamdism2024@gmail.com?subject=[Micro Hunter] 비즈니스 제휴 문의"
                                className="block w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                문의하기
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClientHome(props: ClientHomeProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0b0c10]" />}>
            <ClientHomeContent {...props} />
        </Suspense>
    );
}
