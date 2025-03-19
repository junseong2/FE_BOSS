import HomeBanner from "./components/HomeBanner";
import HomeCategories from "./components/HomeCategories";
import HomeProducts from "./components/HomeProducts";

export default function HomePage() {
  return (
    <div className="w-full h-full">
      <HomeBanner/>
      <HomeCategories/>
      <HomeProducts/>
    </div>
  );
}
