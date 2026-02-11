import { getDatabaseItems } from "@/lib/notion";
import ClientHome from "./ClientHome";

export const revalidate = 60;

export default async function Home() {
  let databaseItems = [];
  try {
    databaseItems = await getDatabaseItems();
  } catch (error) {
    console.error("Home Data Fetch Error:", error);
  }

  console.log("가져온 글 개수:", databaseItems.length);

  const items = databaseItems.map((item: any) => {
    const properties = item.properties;

    // Helper to safely get values
    const getTitle = (prop: any) => prop?.title?.[0]?.plain_text || "Untitled";
    const getRichText = (prop: any) => prop?.rich_text?.[0]?.plain_text || "";
    // Using created_time if Date property is missing or empty
    const getDate = (prop: any) => prop?.date?.start || item.created_time?.slice(0, 10) || "날짜 미정";

    // Category Logic: Category > Source > General
    const categoryProp = properties["카테고리"] || properties["Category"];
    const sourceProp = properties["소스"] || properties["Source"];

    const category =
      categoryProp?.select?.name ||
      sourceProp?.multi_select?.[0]?.name ||
      sourceProp?.select?.name ||
      "General";

    // Brand Logic: Brand > 브랜드 > "Tech Startup"
    const brandProp = properties["Brand"] || properties["브랜드"];
    const brand = brandProp?.rich_text?.[0]?.plain_text || "Tech Startup";

    return {
      id: item.id,
      title: getTitle(properties["제목"]),
      category: category,
      brand: brand,
      description: getRichText(properties["시분석"]),
      date: getDate(properties["Date"]),
      // Thumbnail Logic
      image_url:
        (properties["썸네일"] || properties["Thumbnail"])?.files?.[0]?.file?.url ||
        (properties["썸네일"] || properties["Thumbnail"])?.files?.[0]?.external?.url ||
        null,
    };
  });

  return <ClientHome items={items} />;
}
