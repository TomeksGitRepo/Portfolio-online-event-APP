import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Head from "next/head";
import "react-awesome-slider/dist/styles.css";
import { Dropdown, Icon } from "semantic-ui-react";
import hideShowSpecificLanguageVersion, {
  changeLanguageInLocalStorage,
  getLocalStorageLanguage,
} from "../server/utils/translator";
import { useState } from "react";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/32x32icon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
          integrity="sha512-8bHTC73gkZ7rZ7vpqUQThUDhqcNFyYi2xgDgPDHc+GXVGHXq+xPjynxIopALmOPqzo9JZj0k6OqqewdGO3EsrQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <Provider session={pageProps.session}>
        <div
          className="container-fluid d-flex justify-content-end align-items-end"
          style={{ fontSize: "25px", paddingBottom: "10px" }}
        >
          {languageDropdown()}
        </div>
        <Component {...pageProps} />
      </Provider>
    </>
  );

  function languageDropdown() {
    const [langauge, setLanguage] = useState("polish");
    useEffect(() => {
      var localStorageLanguage = localStorage.getItem("xxxxLanguageVersion");
      if (localStorageLanguage != null) {
        setLanguage(localStorageLanguage);
      }
    }, []);
    return (
      <div className="row">
        <div className="col-10">
          <Dropdown text="Język" inline className="PL">
            <Dropdown.Menu>
              <Dropdown.Item
                flag={"pl"}
                text="PL"
                className="iconBig"
                onClick={() => {
                  changeLanguageInLocalStorage("polish");
                  hideShowSpecificLanguageVersion();
                  setLanguage("polish");
                }}
              />
              <Dropdown.Item
                flag={"gb eng"}
                text="EN"
                className="iconBig"
                onClick={() => {
                  changeLanguageInLocalStorage("english");
                  hideShowSpecificLanguageVersion();
                  setLanguage("english");
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown text="Language" inline className="EN">
            <Dropdown.Menu>
              <Dropdown.Item
                flag={"pl"}
                text="PL"
                className="iconBig"
                onClick={() => {
                  changeLanguageInLocalStorage("polish");
                  hideShowSpecificLanguageVersion();
                  setLanguage("polish");
                }}
              />
              <Dropdown.Item
                flag={"gb eng"}
                text="EN"
                className="iconBig"
                onClick={() => {
                  changeLanguageInLocalStorage("english");
                  hideShowSpecificLanguageVersion();
                  setLanguage("english");
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="col-1">
          {langauge !== "english" ? (
            <i className="pl flag" />
          ) : (
            <i className="en gb flag" />
          )}
        </div>
      </div>
    );
  }
}

export default MyApp;
