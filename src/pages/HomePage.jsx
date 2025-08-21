// src/pages/Homepage.jsx
import { Link } from "react-router-dom";
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  ChartBarIcon,
  ServerIcon,
  CodeBracketIcon,
  CloudIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/solid";

export default function Homepage() {
  return (
    <div className="bg-gray-50 text-gray-900">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              API Management <span className="block text-yellow-300 mt-2">Made Effortless</span>
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto leading-relaxed">
              Build, test, and scale your APIs with the most intuitive platform. 
              Start free and upgrade as you grow with our flexible plans.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Building Now
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Watch Demo
                <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/20">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>99.9% Uptime</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>2M+ API Calls Daily</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>5,000+ Developers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide mb-10">
            Trusted by innovative teams at
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
              <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need to manage your APIs</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Powerful tools designed for developers and teams of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Secure Access</h3>
              <p className="mt-4 text-gray-600">
                Protect APIs with authentication, API keys, rate-limiting, and advanced security policies out of the box.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">OAuth 2.0 & JWT support</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">IP whitelisting</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">DDoS protection</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-lg">
                <BoltIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Fast Testing</h3>
              <p className="mt-4 text-gray-600">
                Test APIs instantly in the browser with a modern UI, real-time responses, and automated testing workflows.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">Collection runner</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">Automated test scripts</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">CI/CD integration</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Advanced Analytics</h3>
              <p className="mt-4 text-gray-600">
                Track API hits, errors, performance insights, and usage patterns to optimize your services.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm">Real-time monitoring</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm">Custom dashboards</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm">Performance alerts</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg">
                <ServerIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Scalable Infrastructure</h3>
              <p className="mt-4 text-gray-600">
                Global edge network with automatic scaling to handle traffic spikes without any configuration.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Auto-scaling</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Global CDN</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Zero-downtime deployments</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-lg">
                <CodeBracketIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Developer Experience</h3>
              <p className="mt-4 text-gray-600">
                SDKs for all major languages, detailed documentation, and interactive API explorer.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Interactive documentation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Code snippets</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Mock servers</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-lg">
                <CloudIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Multi-Cloud Support</h3>
              <p className="mt-4 text-gray-600">
                Deploy your API gateways across AWS, Google Cloud, Azure, or our optimized global infrastructure.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></div>
                  <span className="text-sm">Hybrid deployments</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></div>
                  <span className="text-sm">Multi-region support</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></div>
                  <span className="text-sm">VPC peering</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-extrabold">99.9%</p>
              <p className="mt-2 text-lg font-medium">Uptime SLA</p>
              <p className="mt-1 text-indigo-200">Guaranteed reliability for your APIs</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold">2B+</p>
              <p className="mt-2 text-lg font-medium">API Calls Daily</p>
              <p className="mt-1 text-indigo-200">Processed across our global network</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold">200ms</p>
              <p className="mt-2 text-lg font-medium">Average Latency</p>
              <p className="mt-1 text-indigo-200">Global edge network performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Loved by developers worldwide</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              See what developers are saying about ReqNest
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Sarah Johnson</h4>
                  <p className="text-gray-600">Lead Developer, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700">
                "ReqNest transformed how our team manages APIs. The testing environment alone saved us countless hours of debugging."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Michael Chen</h4>
                  <p className="text-gray-600">CTO, StartupHub</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The analytics dashboard gives us incredible insights into our API performance. We've optimized our endpoints based on real data."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Alex Rodriguez</h4>
                  <p className="text-gray-600">Software Engineer, FinTech Inc</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The security features give us peace of mind. We know our APIs are protected with best-in-class authentication and rate limiting."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Ready to streamline your API workflow?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Join thousands of developers and teams who use ReqNest to build, test, and scale their APIs.
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-sm text-indigo-700 bg-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              Create Free Account
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-indigo-200">
            No credit card required. Start with our free plan today.
          </p>
        </div>
      </section>
    </div>
  );
}