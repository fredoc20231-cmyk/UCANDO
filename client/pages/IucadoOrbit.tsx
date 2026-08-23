import React from "react";
import Layout from "@/components/Layout";
import { IucadoOrbitEngine } from "@/components/IucadoOrbitEngine";

export default function IucadoOrbitPage() {
  return (
    <Layout>
      <div className="flex-1 bg-background">
        <IucadoOrbitEngine />
      </div>
    </Layout>
  );
}
