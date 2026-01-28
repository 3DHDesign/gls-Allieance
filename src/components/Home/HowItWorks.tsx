// components/HowItWorks.tsx
export default function HowItWorks() {
    return (
      <section
       className="py-16 text-white bg-[#021127] bg-[url('/images/bg.svg')] bg-repeat bg-center"
      >
        <div className="container mx-auto text-center">
          {/* Heading */}
          <h2 className="text-3xl font-bold mb-3 relative inline-block">
            How it Works
            <span className="block w-12 h-[2px] bg-white mt-2 mx-auto"></span>
          </h2>
          <p className="mb-10 max-w-xl mx-auto text-lg">
          GLS Alliance Close cooperation leads to better resulted Cooperation Among Globally Members
          </p>
  
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div>
              <div className="text-yellow-400 text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-xl">Search Locations</h3>
              <p className="mt-2 text-white/80">
                An nec placerat repudiare scripserit, temporibus complectitur at sea, vel ignota fierent eloquentiam id.
              </p>
            </div>
  
            {/* Step 2 */}
            <div>
              <div className="text-yellow-400 text-5xl mb-4">ℹ️</div>
              <h3 className="font-semibold text-xl">View Location Info</h3>
              <p className="mt-2 text-white/80">
                An nec placerat repudiare scripserit, temporibus complectitur at sea, vel ignota fierent eloquentiam id.
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors">
                Register Now
              </button>
            </div>
  
            {/* Step 3 */}
            <div>
              <div className="text-yellow-400 text-5xl mb-4">👍</div>
              <h3 className="font-semibold text-xl">Book, Reach or Call</h3>
              <p className="mt-2 text-white/80">
                An nec placerat repudiare scripserit, temporibus complectitur at sea, vel ignota fierent eloquentiam id.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  