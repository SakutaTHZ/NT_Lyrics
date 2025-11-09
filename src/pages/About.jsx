import { Suspense } from "react";
import KpayQR from "../assets/images/Kpaythz.jpg";
import cover from "../assets/images/cover_bg.png";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const About = () => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-screen min-h-screen overflow-hidden overflow-y-auto c-text text-base">
        <div className="flex w-full min-h-screen pt-4 md:pt-16 pb-16 px-4 md:px-24 gap-6">
          {/* Left: Main content */}
          <div className="flex flex-col w-full gap-4">
            {/* 🎸 About */}
            <section>
              <img
                src={cover}
                className="absolute inset-0 w-screen"
                alt="Cover Background"
              />

              <h2 className="font-bold text-2xl text-white italic mb-2 flex gap-2 items-center py-4 z-10 relative">
                {t("aboutNtLyrics")}
              </h2>
              <p className="leading-relaxed c-bg p-4 rounded-md text-md z-10 relative">
                <strong className="text-lg">NT Lyric n Chord</strong>{" "}
                <span>
                  {t("ntlyricsDescription")
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </span>
              </p>
            </section>

            <hr className="c-border" />

            {/* 🧭 How to Read */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2">
                {t("aboutApp")}
              </h2>
              <ul className="list-disc list-inside mt-2 space-y-1  c-bg p-4 rounded-md text-md z-10 relative">
                <li>{t("appDescription")}</li>
                <li>{t("premiumToo")}</li>
              </ul>

              <p className="leading-relaxed px-2 rounded-md text-md z-10 relative">
                {t("3UserTypes")}
              </p>
              <ul className="list-disc list-inside space-y-4 c-bg p-4 rounded-md text-md z-10 relative">
                <li>{t("guestUsers")}</li>
                <li>{t("freeUsers")}</li>
                <li>{t("premiumUsers")}</li>
              </ul>

              <p className="leading-relaxed c-bg p-2 rounded-md text-md z-10 relative ">
                {t("userExtraNote")}
              </p>

              <p className="leading-relaxed c-bg p-2 rounded-md text-md z-10 relative">
                <Link to="/NT_Lyrics/premium?page=2" className="underline rounded-md text-md z-10 relative c-text-primary font-semibold">
                  {t("learnMoreBoutPremium")}
                </Link>
              </p>
            </section>

            <hr className="c-border" />

            <section>
              <p className="leading-relaxed c-bg p-4 px-2 pt-0 rounded-md text-md z-10 relative whitespace-pre-line">
                {t("paymentDescription")}
              </p>

              <Link to="/NT_Lyrics/premium?page=1" className="px-2 underline rounded-md text-md z-10 relative c-text-primary font-semibold">
                  {t("aboutPayment")}
                </Link>

              <p className="leading-relaxed c-bg p-4 px-2 rounded-md text-md z-10 relative whitespace-pre-line">
                {t("noteForPayment")}
              </p>
            </section>

            <hr className="c-border" />

            <section>
              <h2 className="font-bold text-2xl italic mb-2">
                {t("messageToUser")}
              </h2>
              <ul className="list-disc list-inside space-y-4 c-bg p-4 rounded-md text-md z-10 relative">
                <li>{t("futurePlans")}</li>
                <li>{t("weWillAddMoreSongs")}</li>
                <li>{t("weWillCorrectMistakes")}</li>
              </ul>
              <p className="leading-relaxed c-bg p-4 px-2 rounded-md text-md z-10 relative whitespace-pre-line">
                ** {t("WeWillTryOurBestToMakeThisAppBetter")} **
              </p>
            </section>

            <hr className="c-border" />

            {/* 💙 Support */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2">
                Support NT Lyric n Chord
              </h2>
              <p className="leading-relaxed c-bg p-4 px-2 rounded-md text-md z-10 relative whitespace-pre-line">
                {t("supportNT")}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold mb-1">💸 KPay Donation</h4>
                <p>
                  We accept donations via <strong>KBZPay</strong>:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>Phone Number:</strong> 09-xxxxxxx
                  </li>
                  <li>
                    <strong>Scan QR:</strong>
                  </li>
                </ul>

                <div className="mt-4">
                  <img
                    src={KpayQR}
                    alt="KBZPay QR Code"
                    className="w-40 h-40 object-contain border c-border rounded"
                  />
                </div>
              </div>
            </section>

            <hr className="c-border" />

            {/* 👥 Team / Credits */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2">Team & Credits</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Sakuta:</strong> UI/UX Designer & FrontEnd Developer
                </li>
                <li>
                  <strong>Talia:</strong> BackEnd Developer
                </li>
                <li>
                  <strong>NT:</strong> Founder & Curator
                </li>
                <li>
                  <strong>Contributors:</strong> All musicians and users who’ve
                  submitted lyrics and chords over the years — thank you!
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default About;
