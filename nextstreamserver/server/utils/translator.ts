export default function hideShowSpecificLanguageVersion() {
  console.log("In hideShowSpecificLanguageVersion");
  var language = localStorage.getItem("xxxxLanguageVersion");
  if (language == null) {
    language = "polish";
    localStorage.setItem("xxxxLanguageVersion", language);
  }
  if (language === "polish") {
    var enElements = document.getElementsByClassName("EN");
    console.log("enElements is");
    console.log(enElements);
    for (var i = 0; i < enElements.length; i++) {
      (enElements[i] as any).style.display = "none";
    }
    var plElements = document.getElementsByClassName("PL");
    for (var i = 0; i < plElements.length; i++) {
      (plElements[i] as any).style.display = "block";
    }
  } else if (language === "english") {
    var enElements = document.getElementsByClassName("EN");
    for (var i = 0; i < enElements.length; i++) {
      (enElements[i] as any).style.display = "block";
    }
    var plElements = document.getElementsByClassName("PL");
    for (var i = 0; i < plElements.length; i++) {
      (plElements[i] as any).style.display = "none";
    }
  }
}

export function changeLanguageInLocalStorage(language: string) {
  localStorage.setItem("xxxxLanguageVersion", language);
}

export function getLocalStorageLanguage(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("xxxxLanguageVersion");
  }
  return null;
}
