export default function LogisticsBanner() {
    return (
      <section
        className="relative flex items-center justify-center min-h-[50vh] md:min-h-[60vh] bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://sinay.ai/wp-content/uploads/2025/03/role-of-a-logistic-manager-scaled.jpg)",
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
  
        {/* content */}
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-4">
            The Role of a Logistic Manager
          </h1>
          <p className="text-white/90 text-lg md:text-xl">
            Optimizing supply chains, managing freight operations, and ensuring
            smooth delivery worldwide.
          </p>
        </div>
      </section>
    );
  }
  