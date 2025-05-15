import React from "react";
import MinimalShop from "@/components/kokonutui/minimal-shop";

const Browse = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <main className="flex-1">
        <section>
          <MinimalShop />
        </section>
      </main>
    </div>
  );
};

export default Browse;
