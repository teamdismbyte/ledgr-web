import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";

// ⚠️ API Key & DB ID (하드코딩 유지)
const API_KEY = process.env.NOTION_API_KEY || ""; // Key removed for security
const DATABASE_ID = "2fed4a94bc8380139e03c4a7dd9f4427";

// 상세 페이지 본문 변환용 (라이브러리 사용)
const notion = new Client({ auth: API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// 1. 메인 페이지용 (목록 가져오기 - POST + 필터링)
export const getDatabaseItems = async () => {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: {
                    property: "Status",
                    status: { equals: "발행하기" }
                },
                sorts: [{ timestamp: "created_time", direction: "descending" }],
            }),
        });

        if (!response.ok) throw new Error(`List Error: ${response.status}`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("목록 가져오기 실패:", error);
        return [];
    }
};

// 2. 상세 페이지용 정보 가져오기 (제목, 태그 등 - GET)
export const getPageProperties = async (pageId: string) => {
    try {
        const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Notion-Version": "2022-06-28",
            },
        });

        if (!response.ok) throw new Error(`Page Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("상세 정보 가져오기 실패:", error);
        return null;
    }
};

// 3. 상세 페이지 본문 가져오기 (핵심 수정!)
export const getPageContent = async (pageId: string) => {
    try {
        const mdblocks = await n2m.pageToMarkdown(pageId);
        const mdString = n2m.toMarkdownString(mdblocks);

        // 🚨 수정된 부분: 객체({})가 아니라 문자열(.parent)을 반환해야 함
        return mdString.parent;
    } catch (error) {
        console.error("본문 변환 실패:", error);
        return "";
    }
};
