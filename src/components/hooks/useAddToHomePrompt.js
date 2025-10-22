import { useEffect, useState } from "react";

export default function useAddToHomePrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSBanner, setShowIOSBanner] = useState(false);

  useEffect(() => {
    console.log("Checking installability...");
    const userAgent = window.navigator.userAgent.toLowerCase();
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    // Check installation status
    if (standalone) {
      setIsInstalled(true);
    }

    // Detect iOS devices
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Show custom banner for iOS (since Safari doesn’t support beforeinstallprompt)
    if (isIOSDevice && !standalone) {
      setShowIOSBanner(true);
    }

    // Capture Chrome/Android install prompt
    const beforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Detect successful installation
    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIOSBanner(false);
    };

    console.log("✅ Hook init");
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("✅ beforeinstallprompt fired");
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener("appinstalled", () => {
      console.log("📲 App installed");
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstalled(true);
      return true;
    } else {
      console.log("User dismissed install — can retry later");
      return false;
    }
  };

  return {
    promptInstall,
    isInstalled,
    isIOS,
    showIOSBanner,
  };
}
