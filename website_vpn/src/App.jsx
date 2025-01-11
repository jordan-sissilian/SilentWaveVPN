import React, { useState } from "react";
import NavbarComponent from "./components/Navbar";
import HeaderComponent from "./pages/home/Header";
import InfoServerComponent from "./pages/home/InfoServer";
import EtapeComponent from "./pages/home/Etape";

function App() {

  return (
    <>
      <NavbarComponent />
      <HeaderComponent />
      <InfoServerComponent />
      <EtapeComponent />

      <div className="tw-w-full tw-h-screen">

      </div>

      <div className="tw-h-screen tw-w-full tw-flex tw-flex-col tw-items-center" style={{ background: "linear-gradient(-6deg, #0a2540 80%, rgb(255, 255, 255) 0%)", }}>
      </div>

      <div className="tw-w-full tw-h-[250px]" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
      </div>

    </>
  );
}

export default App;
