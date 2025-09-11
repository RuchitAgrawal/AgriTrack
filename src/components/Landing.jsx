
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from './Header';
// import Picture1 from '../assets/Picture1.jpg';
import image2 from '../assets/imgae2.png';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Supply Chain
              <span className="text-primary-600 dark:text-primary-400 block">Transparency</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              From Farm to Fork — Verified, Transparent, Fair.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Empowering farmers, protecting consumers, and securing trust with blockchain-powered traceability.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/signin" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto min-w-[180px] bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                🚀 Get Started
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto min-w-[180px] border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-600 dark:hover:bg-primary-400 hover:text-white dark:hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              📖 Learn More
            </motion.button>
          </motion.div>

          {/* HERO IMAGE PLACEHOLDER
          <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, delay: 0.3 }}
  className="mb-16 flex justify-center"
>
  <motion.img
    src={Picture1}
    alt="Farm to Consumer"
    transition={{ type: 'spring', stiffness: 300 }}
    className="rounded-3xl shadow-2xl shadow-gray-900/40 ring-2 ring-gray-300/20 object-contain w-full max-w-5xl h-auto hover:scale-[1.02] hover:shadow-gray-900/60 transition-all duration-500"
  />
</motion.div> */}

        </div>

        {/* FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-4 gap-8 mb-20"
        >
          <FeatureCard
            title="✅ Verified Quality"
            text="Every product is verified at each stage with immutable blockchain records."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            }
          />
          <FeatureCard
            title="📱 QR Tracking"
            text="Track your product from farm to consumer with complete visibility."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            }
          />
          <FeatureCard
            title="🔒 Secure & Trusted"
            text="Blockchain ensures data integrity and builds consumer trust."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            }
          />
          <FeatureCard
            title="💰 Fair Pricing"
            text="See transparent pricing from farm gate to retail shelf, ensuring fairness for farmers and consumers."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3zM6 20h12" />
            }
          />
        </motion.div>

        {/* HOW IT WORKS TIMELINE */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">⚙️ How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StepCard step="1" title="🌱 Farmer Harvests" text="Farmer registers a batch on blockchain." />
            <StepCard step="2" title="🚚 Distributor Verifies" text="Ownership & quality checks recorded." />
            <StepCard step="3" title="🏬 Retailer Sells" text="Retailer logs final sale details." />
            <StepCard step="4" title="📲 Consumer Scans QR" text="Full history & certifications shown." />
          </div>
          <br />
          <br />
          <br />
          <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, delay: 0.3 }}
  className="mb-16 flex justify-center"
>
  <motion.img
  src={image2}
  alt="How it works image"
  transition={{ type: 'spring', stiffness: 300 }}
  className="rounded-3xl shadow-lg shadow-gray-900/40 ring-2 ring-gray-300/20 
             object-contain max-w-full md:max-w-4xl h-auto mx-auto w-30"
/>

</motion.div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">❓ FAQ</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <FAQItem q="🌱 How does blockchain help farmers?" a="It ensures their products and prices are recorded transparently, reducing exploitation." />
            <FAQItem q="📲 Do consumers need a special app?" a="No, they simply scan a QR code on the product packaging." />
            <FAQItem q="🤔 What if farmers don’t have smartphones?" a="Local cooperatives or distributors can onboard them into the system." />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 dark:text-gray-400">
          <p>© 2025 AgriTrack. Powered by Blockchain 🌐</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-600">📘 About</a>
            <a href="#" className="hover:text-primary-600">📞 Contact</a>
            <a href="https://github.com/YashBhansari/AgriTrack" className="hover:text-primary-600">💻 GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// FEATURE CARD
const FeatureCard = ({ title, text, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
      <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{text}</p>
  </div>
);

// STEP CARD
const StepCard = ({ step, title, text }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <div className="text-primary-600 dark:text-primary-400 font-bold text-2xl mb-2">Step {step}</div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{text}</p>
  </div>
);

// STAT CARD
const StatCard = ({ number, label }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{number}</div>
    <p className="text-gray-600 dark:text-gray-300">{label}</p>
  </div>
);

// FAQ ITEM
const FAQItem = ({ q, a }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-left">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{q}</h3>
    <p className="text-gray-600 dark:text-gray-300">{a}</p>
  </div>
);

export default Landing;
