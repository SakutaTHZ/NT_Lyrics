import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiExpand } from "react-icons/bi";

const AnnouncementBoard = () => {
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);
  return (
    <>
      <div className="relative p-4 md:px-24">
        <div
          className={`flex transition-all duration-300 relative bg-blue-50 rounded-md p-2 text-blue-950 text-md md:text-base border border-dashed border-blue-200 ${
            expand ? "p-4" : "pr-8"
          }`}
          onClick={() => setExpand(!expand)}
        >
          <p
            className={`${
              expand ? "flex flex-col gap-2" : "text-nowrap flex"
            } w-full transition-all  duration-300 `}
          >
            <b className={`${expand ? "font-bold text-lg italic pb-2" : "pr-2"}`}>
              {t("Announcement")} {!expand && ":"}
            </b>
            {expand &&
            <span className="mb-1 h-1 border-b border-dashed border-gray-400"/>}
            <span className="w-full overflow-hidden text-ellipsis leading-relaxed">
              သီချင်းစာသားအသစ်များ မကြာမီ ရလာမည်!
              သင့်အကြိုက်ဆုံးအနုပညာရှင်များထံမှ သီချင်းစာသားအသစ်များကို
              စိတ်လှုပ်ရှားစွာ စောင့်မျှော်ထားပါ။
              ကျွန်ုပ်တို့၏သီချင်းစာသားဝက်ဘ်ဆိုဒ်ကို Premium ဝယ်ယူခြင်းဖြင့်
              ပံ့ပိုးပါ — ကြော်ငြာမပါသောအတွေ့အကြုံနှင့်
              သီးသန့်အကြောင်းအရာများကို အမြန်ရယူနိုင်သည်။ တေးသံနှင့်အတူရှိနေတဲ့
              သင့်အား ကျေးဇူးအထူးတင်ပါသည်။
            </span>
          </p>
          <p
            className={`absolute ${
              expand ? "top-3" : "bottom-3"
            } right-2  text-gray-400 animate-pulse`}
          >
            <BiExpand />
          </p>
        </div>
      </div>
    </>
  );
};

export default AnnouncementBoard;
