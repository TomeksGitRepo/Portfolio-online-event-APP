import { useEffect } from "react";
import { useState } from "react";
import hideShowSpecificLanguageVersion from "../utils/translator";

export default function WeAreLiveBanner() {
  useEffect(() => {
    hideShowSpecificLanguageVersion();
  });

  return (
    <div className="row" style={{ padding: "5px", textAlign: "center" }}>
      <h3 className="PL">Nadajemy na żywo:</h3>
      <h3 className="EN">We are live:</h3>
    </div>
  );
}
