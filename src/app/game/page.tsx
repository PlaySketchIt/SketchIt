"use client";
 
import dynamic from "next/dynamic";

import "@fontsource-variable/open-sans";
import "../../index.css";
 
const App = dynamic(() => import("../../App"), { ssr: false });
 
export default function Page() {
  return <App />;
}
