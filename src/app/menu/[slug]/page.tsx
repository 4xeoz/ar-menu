import { publicApi, type MenuItem } from "@/lib/api";
import MenuClient from "./MenuClient";

type Props = { params: Promise<{ slug: string }> };

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;

  try {
    const restaurant = await publicApi.getRestaurantBySlug(slug);
    const items = await publicApi.getMenuItems(restaurant.id);
    return <MenuClient restaurant={restaurant} items={items} />;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
        <p className="text-gray-400">Menu not found.</p>
      </div>
    );
  }
}
