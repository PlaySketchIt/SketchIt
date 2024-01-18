"use client";
 
import dynamic from "next/dynamic";

import "@fontsource-variable/open-sans";
import "./page.css";
 
const App = dynamic(() => import("../../app_components/GameApp"), { ssr: false });
 
export default function Page() {
  return <App />;
}
