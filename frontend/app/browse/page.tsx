import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import MinimalShop from "@/components/kokonutui/minimal-shop";

const Browse = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section>
          <MinimalShop />
        </section>
      </main>
    </div>
  );
};

export default Browse;
