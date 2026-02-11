import { getPageContent, getPageProperties, getDatabaseItems } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Share2, Bookmark } from "lucide-react";
import ServiceModalButton from "@/app/components/ServiceModalButton";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
    try {
        const posts = await getDatabaseItems();
        return posts.map((post: any) => ({
            id: post.id,
        }));
    } catch (error) {
        console.error("generateStaticParams Error:", error);
        return [];
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // --- 1. 데이터 가져오기 (로직 유지) ---
    let properties = null;
    let markdownBody = "";

    try {
        [properties, markdownBody] = await Promise.all([
            getPageProperties(id),
            getPageContent(id),
        ]);
    } catch (error) {
        console.error("ArticlePage Data Fetch Error:", error);
    }

    if (!properties || !properties.properties) {
        return <div className="p-20 text-white text-center">데이터를 불러올 수 없습니다.</div>;
    }

    const props = properties.properties;

    // --- 2. 변수 매핑 ---
    const title = props["제목"]?.title?.[0]?.plain_text || "제목 없음";
    const categoryProp = props["카테고리"] || props["Category"];
    const sourceProp = props["소스"] || props["Source"];

    const category =
        categoryProp?.select?.name ||
        sourceProp?.multi_select?.[0]?.name ||
        sourceProp?.select?.name ||
        "General";
    const date = props["Date"]?.date?.start || "Unknown Date";

    // Brand Logic
    const brandProp = props["Brand"] || props["브랜드"];
    const brand = brandProp?.rich_text?.[0]?.plain_text || "Micro Hunter Analysis";

    // "AI 분석" 등 다양한 컬럼명 시도
    const aiProperty = props["AI 분석"] || props["시분석"] || props["AI Analysis"] || props["Analysis"];
    const aiText = aiProperty?.rich_text?.map((t: any) => t.plain_text).join("\n") || "";
    const rawContent = aiText || markdownBody || "내용이 없습니다.";

    // Custom Parser for Bold Text (User Request)
    const renderContent = (text: string) => {
        if (!text) return null;

        // 1. Cleaning: Strip wrapping code blocks/quotes if present
        let cleanText = text;
        if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
            cleanText = cleanText.slice(1, -1);
        }
        cleanText = cleanText.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "");
        cleanText = cleanText.replace(/\\n/g, "\n"); // Unescape newlines

        // 2. Split by newlines to preserve paragraphs/breaks
        const lines = cleanText.split('\n');

        return lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();

            // 3-1. Case: H2 (## Title)
            if (trimmedLine.startsWith('## ')) {
                const content = line.replace(/^##\s+/, '');
                return (
                    <h2 key={lineIndex} className="text-2xl font-bold text-white !mt-14 !mb-2">
                        {content}
                    </h2>
                );
            }

            // 3-2. Case: H3 (### Title)
            if (trimmedLine.startsWith('### ')) {
                const content = line.replace(/^###\s+/, '');
                return (
                    <h3 key={lineIndex} className="text-xl font-bold text-white !mt-10 !mb-2">
                        {content}
                    </h3>
                );
            }

            // 3-3. Case: Empty Line (Spacers)
            if (!trimmedLine) {
                return <div key={lineIndex} className="h-6" />;
            }

            // 3-4. Case: Paragraph (Regular Text + Bold Parsing)
            const parts = line.split(/(\*\*.*?\*\*)/g);

            const lineContent = parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    // Remove ** and wrap in strong
                    return <strong key={`${lineIndex}-${partIndex}`} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                }
                return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
            });

            // Return wrapped in p tag for proper spacing
            return (
                <p key={lineIndex} className="text-[17px] leading-relaxed !mb-5 text-gray-300">
                    {lineContent}
                </p>
            );
        });
    };

    // Also add ZWSP (\u200B) after bold to fix CJK parsing issues (e.g., )**에)
    // finalContent logic removed (unused)



    // Thumbnail Logic
    const thumbnailProp = props["썸네일"] || props["Thumbnail"];
    const thumbnailUrl =
        thumbnailProp?.files?.[0]?.file?.url ||
        thumbnailProp?.files?.[0]?.external?.url ||
        null;

    // --- 3. 디자인 적용 (기존 page.tsx 디자인 복구) ---
    return (
        <div className="min-h-screen bg-[#0b0c10] text-gray-300 font-sans pb-20 overflow-x-hidden">

            {/* 헤더 (Sticky) */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0b0c10]/80 border-b border-gray-800/50">
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xl font-bold tracking-tight text-white">Ledgr</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                        <button className="text-gray-400 hover:text-white transition-colors"><Bookmark className="w-5 h-5" /></button>
                    </div>
                </div>
            </header>

            {/* 메인 레이아웃 */}
            <div className="max-w-[1800px] mx-auto px-6 py-6 md:py-10">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

                    {/* 왼쪽: 본문 영역 (col-span-8) */}
                    <main className="col-span-1 xl:col-span-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">뒤로 가기</span>
                        </Link>

                        {/* 아티클 헤더 */}
                        <div className="mb-8">
                            <span className="text-xs font-bold text-gray-500 mb-4 block uppercase tracking-wider">{category}</span>

                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-100 leading-tight mb-6">{title}</h1>

                            <div className="flex items-center gap-4 border-t border-b border-white/5 py-4 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">{brand}</span>
                                </div>
                                <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
                                    <span className="text-xs font-medium text-gray-500">{date}</span>
                                </div>
                            </div>

                            {/* Hero Image (Thumbnail) */}
                            {thumbnailUrl && (
                                <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8">
                                    <img
                                        src={thumbnailUrl}
                                        alt={title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}


                        </div>
                        {/* 썸네일 이미지 (데이터 없으므로 주석 처리) */}
                        {/* <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-gray-800">
               <img src="..." alt={title} className="object-cover w-full h-full" />
            </div> 
            */}

                        <article className="max-w-none text-gray-300 leading-relaxed text-[17px]">
                            {renderContent(rawContent)}
                        </article>


                    </main>

                    {/* 오른쪽 사이드바 (그대로 유지) */}
                    <aside className="col-span-1 xl:col-span-4 space-y-12">

                        {/* 인기 카테고리 */}
                        <div className="hidden xl:block">
                            <div className="flex items-center gap-2 mb-6">
                                <h3 className="text-lg font-bold text-white">인기 카테고리</h3>
                                <div className="h-px bg-gray-800 flex-1 ml-4" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {[{ name: "스타트업" }, { name: "디자인" }, { name: "개발" }, { name: "기획" }, { name: "마케팅" }].map((item) => (
                                    <Link key={item.name} href="/" className="text-gray-400 font-medium text-base px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between hover:bg-[#121212] hover:text-white transition-all group">
                                        <span>{item.name}</span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 배너 영역 (채용공고 등) */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <h3 className="text-lg font-bold text-white">서비스 & 기회</h3>
                                <div className="h-px bg-gray-800 flex-1 ml-4" />
                            </div>
                            {/* 배너 이미지들은 경로 그대로 사용 */}
                            <div className="flex flex-col gap-6">
                                {/* Large Banner 1: Hiring */}
                                <div className="relative w-full h-[250px] rounded-3xl overflow-hidden group cursor-pointer border border-gray-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                                    <img
                                        src="/banner.png"
                                        alt="Hiring"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/50 to-transparent"></div>

                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                        <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                                            만들기 전에 먼저 파세요
                                        </h3>
                                        <p className="text-gray-300 text-xs mb-3 line-clamp-1">
                                            수개월의 고민을 단 몇 주 만에 끝내드립니다.
                                        </p>
                                        <a
                                            href="https://drawn-so.netlify.app/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-white text-xs font-bold bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all border border-white/10 w-fit"
                                        >
                                            더 알아보기 <ChevronRight className="w-3 h-3" />
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
                                                커리어 퀀텀 점프<br />1:1 멘토링
                                            </h3>
                                        </div>
                                        <ServiceModalButton className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit">
                                            오픈 예정 <ChevronRight className="w-3 h-3" />
                                        </ServiceModalButton>
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
                                                실무 중심의<br />기업 강의 문의
                                            </h3>
                                        </div>
                                        <ServiceModalButton className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit">
                                            오픈 예정 <ChevronRight className="w-3 h-3" />
                                        </ServiceModalButton>
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
                                                함께 성장하는<br />멤버십 가입
                                            </h3>
                                        </div>
                                        <ServiceModalButton className="flex items-center gap-1 text-gray-300 text-[10px] font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all border border-white/10 w-fit">
                                            오픈 예정 <ChevronRight className="w-3 h-3" />
                                        </ServiceModalButton>
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
                        </div>
                    </aside>

                </div>
            </div >
        </div >
    );
}
