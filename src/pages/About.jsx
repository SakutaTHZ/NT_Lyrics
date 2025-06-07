import { Suspense } from "react";
import KpayQR from "../assets/images/Kpaythz.jpg";

const About = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        
      <div className="w-screen min-h-screen overflow-hidden overflow-y-auto bg-white text-gray-800">
        <div className="flex w-full min-h-screen pt-4 md:pt-16 pb-16 px-4 md:px-24 gap-6">
          {/* Left: Main content */}
          <div className="flex flex-col w-full gap-6">
            {/* 🎸 About */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2 flex gap-2 items-center pb-2">
                About NT Lyric n Chord
              </h2>
              <p className="leading-relaxed">
                <strong>NT Lyric n Chord</strong> began as a humble Facebook
                page — created out of necessity to help beginner musicians
                navigate the often messy world of Burmese music chords.
                <br />
                <br />
                Back in the early days, finding accurate chords and lyrics for
                local songs was more about guesswork than guidance. That
                frustration gave birth to this project.
                <br />
                <br />
                What started as a few shared posts quickly gained traction.
                Musicians, singers, and hobbyists began using and contributing,
                turning the page into a quiet but growing hub.
                <br />
                <br />
                Today, NT Lyric n Chord is a dedicated space — built not just to
                host lyrics and chords, but to make playing and learning music
                feel accessible for everyone. We’re not a corporation, and we’re
                not some faceless aggregator. This project is run by people who
                play music too.
              </p>
            </section>

            <hr />

            {/* 🧭 How to Read */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2">
                How to Read Lyrics and Chords
              </h2>
              <p className="leading-relaxed">
                We keep things simple but consistent. Here’s how to understand
                the structure:
              </p>

              <ul className="list-disc list-inside mt-2 space-y-1 text-sm md:text-base">
                <li>
                  <strong>🔤 Chord Placement:</strong> Chords appear{" "}
                  <em>above</em> the lyrics at the exact point they should be
                  played.
                </li>
                <li>
                  <strong>🪕 Common Markings:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>
                      <code>(*)</code> — Indicates chorus repetition.
                    </li>
                    <li>
                      <code>[Intro]</code>, <code>[Verse]</code>,{" "}
                      <code>[Chorus]</code> — Structural parts of the song.
                    </li>
                    <li>
                      <code>{"//"}</code> — Used for transliteration or repeated
                      lines.
                    </li>
                    <li>
                      <code>Capo: 2</code> — Use a capo on the 2nd fret.
                    </li>
                    <li>
                      <code>(x2)</code>, <code>(x4)</code> — Repeat a section
                      this many times.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>📝 Translations & Notes:</strong> Some songs include
                  Romanized lyrics or rhythm guidance for clarity.
                </li>
                <li>
                  If something feels off, or you’d like to see a new format or
                  song,{" "}
                  <a href="#" className="text-blue-500 underline">
                    contact us here
                  </a>
                  .
                </li>
              </ul>
            </section>

            <hr />

            {/* 💙 Support */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2">
                Support NT Lyric n Chord
              </h2>
              <p className="leading-relaxed">
                This project is free and always will be. But maintaining and
                improving it — from song formatting to web development — takes
                effort.
                <br />
                <br />
                If you’d like to support us:
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
                    className="w-40 h-40 object-contain border rounded"
                  />
                </div>
              </div>
            </section>

            <hr />

            {/* ⚖️ Disclaimer */}
            <section>
              <h2 className="font-bold text-2xl italic mb-2">Disclaimer</h2>
              <p className="leading-relaxed">
                All lyrics and chords are shared for educational and personal
                use only. We do not claim ownership of any original music or
                lyrics.
                <br />
                If you’re a copyright holder and would like your work removed or
                properly credited, please contact us.
              </p>
            </section>

            <hr />

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
