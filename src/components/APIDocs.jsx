import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams

// This is a wrapper component that extracts the apiName from the URL
export function APIDocsWrapper() {
  const { apiName } = useParams(); // Extract apiName from URL params
  
  return <APIDocs apiName={apiName} />;
}

// Your main component (unchanged except for the fix in the useEffect dependency)
function APIDocs({ apiName }) {
  const [schema, setSchema] = useState(null);
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [selectedTab, setSelectedTab] = useState("documentation");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("APIDocs component rendered with apiName:", apiName);
  console.log("Current state - loading:", loading, "error:", error, "schema:", schema);
  
  useEffect(() => {
    if (!apiName) return;
    
    setLoading(true);
    setError(null);
    
    // Fetch actual API data from your backend
    axios.get(`http://localhost:8080/apis/${apiName}`, { 
      withCredentials: true 
    })
    .then(response => {
      const data = response.data;
      try {
        // Parse the schema JSON if it's stored as a string
        const parsedSchema = typeof data.schemaJson === "string" 
          ? JSON.parse(data.schemaJson) 
          : data.schemaJson;
        
        setSchema({
          ...parsedSchema,
          // Add API metadata
          info: {
            title: data.name || "API Documentation",
            version: data.version || "1.0.0",
            description: data.description || "API documentation",
            contact: {
              name: "API Support",
              email: "support@apinexus.com"
            }
          },
          baseUrl: data.baseUrl || "https://api.example.com/v1"
        });
      } catch (err) {
        console.error("Error parsing schema:", err);
        setError("Invalid schema format");
      }
    })
    .catch(err => {
      console.error("Error fetching API docs:", err);
      setError("Failed to load API documentation");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [apiName]); // apiName is now correctly in the dependency array

  const downloadPDF = () => {
    if (!schema) return;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(schema.info.title, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Version: ${schema.info.version}`, 20, 35);
    doc.text(`Base URL: ${schema.baseUrl}`, 20, 45);
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("API Description", 20, 60);
    
    doc.setFontSize(11);
    const descriptionLines = doc.splitTextToSize(schema.info.description, 170);
    doc.text(descriptionLines, 20, 70);
    
    let yPosition = 90;
    doc.setFontSize(14);
    doc.text("Endpoints", 20, yPosition);
    yPosition += 10;
    
    // Check if endpoints exist in the schema
    if (schema.endpoints && schema.endpoints.length > 0) {
      schema.endpoints.forEach(endpoint => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 150);
        doc.text(`${endpoint.method} ${endpoint.path}`, 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(endpoint.description, 20, yPosition);
        yPosition += 10;
      });
    } else if (schema.paths) {
      // Handle OpenAPI format paths
      Object.entries(schema.paths).forEach(([path, methods]) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        Object.entries(methods).forEach(([method, details]) => {
          doc.setFontSize(12);
          doc.setTextColor(30, 30, 150);
          doc.text(`${method.toUpperCase()} ${path}`, 20, yPosition);
          yPosition += 8;
          
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          if (details.summary) {
            doc.text(details.summary, 20, yPosition);
            yPosition += 7;
          }
          yPosition += 5;
        });
      });
    }
    
    doc.save(`${apiName}-documentation.pdf`);
  };

  const renderMethodBadge = (method) => {
    const colorMap = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800",
      PUT: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800",
      PATCH: "bg-purple-100 text-purple-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[method] || "bg-gray-100 text-gray-800"}`}>
        {method}
      </span>
    );
  };

  const renderParameters = (parameters) => {
    if (!parameters || parameters.length === 0) {
      return <p className="text-gray-500 mt-2">No parameters required.</p>;
    }
    
    return (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Parameters</h4>
        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parameters.map((param, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm font-mono">{param.name}</td>
                  <td className="px-4 py-2 text-sm">{param.type || "string"}</td>
                  <td className="px-4 py-2 text-sm">{param.required ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 text-sm">{param.description || "No description"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderResponses = (responses) => {
    if (!responses || responses.length === 0) {
      return <p className="text-gray-500 mt-2">No response information available.</p>;
    }
    
    return (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Responses</h4>
        {responses.map((response, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                response.code === 200 ? "bg-green-100 text-green-800" : 
                response.code >= 400 ? "bg-red-100 text-red-800" : 
                "bg-blue-100 text-blue-800"
              }`}>
                {response.code}
              </span>
              <span className="ml-2 text-sm text-gray-600">{response.description}</span>
            </div>
            {response.example && (
              <div className="mt-2 bg-gray-800 text-green-400 p-3 rounded-lg overflow-auto">
                <pre className="text-sm">{JSON.stringify(response.example, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderEndpointDetail = () => {
    if (!activeEndpoint) return null;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {renderMethodBadge(activeEndpoint.method)}
            <h3 className="text-xl font-mono font-semibold">{activeEndpoint.path}</h3>
          </div>
          <button 
            onClick={() => setActiveEndpoint(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <p className="mt-2 text-gray-600">{activeEndpoint.description}</p>
        
        {activeEndpoint.parameters && activeEndpoint.parameters.length > 0 && 
          renderParameters(activeEndpoint.parameters)}
        
        {activeEndpoint.responses && activeEndpoint.responses.length > 0 && 
          renderResponses(activeEndpoint.responses)}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Example Request</h4>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
{`curl -X ${activeEndpoint.method} ${schema.baseUrl}${activeEndpoint.path} \\
${activeEndpoint.method === 'POST' ? '  -H "Content-Type: application/json" \\\n  -d \'{"name": "example", "email": "user@example.com"}\'' : 
  activeEndpoint.method === 'GET' && activeEndpoint.parameters ? '  -G' : ''}`}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  const renderEndpoints = () => {
    if (!schema) return null;
    
    // Check if we have endpoints in the custom format
    if (schema.endpoints && schema.endpoints.length > 0) {
      return (
        <div className="space-y-6">
          {schema.endpoints.map((endpoint, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setActiveEndpoint(endpoint)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {renderMethodBadge(endpoint.method)}
                  <span className="font-mono text-gray-800">{endpoint.path}</span>
                  <span className="text-gray-500 text-sm">{endpoint.description}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Check if we have paths in OpenAPI format
    if (schema.paths) {
      return (
        <div className="space-y-6">
          {Object.entries(schema.paths).map(([path, methods], index) => (
            <div key={index}>
              {Object.entries(methods).map(([method, details], methodIndex) => (
                <div 
                  key={`${index}-${methodIndex}`} 
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-4"
                  onClick={() => setActiveEndpoint({
                    method: method.toUpperCase(),
                    path,
                    description: details.summary || details.description || "No description available",
                    parameters: details.parameters,
                    responses: details.responses ? Object.entries(details.responses).map(([code, response]) => ({
                      code: parseInt(code),
                      description: response.description,
                      example: response.example || response.schema
                    })) : []
                  })}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {renderMethodBadge(method.toUpperCase())}
                      <span className="font-mono text-gray-800">{path}</span>
                      <span className="text-gray-500 text-sm">{details.summary || "No description"}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    
    return <p className="text-gray-500">No endpoint information available.</p>;
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">API Documentation Error</h3>
        <p className="mt-2 text-gray-500">{error}</p>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">API Documentation Not Found</h3>
        <p className="mt-2 text-gray-500">The documentation for {apiName} could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{schema.info.title}</h1>
                <p className="text-gray-600 mt-1">Version: {schema.info.version}</p>
                <p className="text-gray-600 mt-2">{schema.info.description}</p>
                <p className="text-sm text-gray-500 mt-3">
                  Base URL: <code className="px-2 py-1 bg-gray-100 rounded">{schema.baseUrl}</code>
                </p>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedTab("documentation")}
                className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "documentation"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Documentation
              </button>
              <button
                onClick={() => setSelectedTab("examples")}
                className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "examples"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Code Examples
              </button>
              <button
                onClick={() => setSelectedTab("support")}
                className={`ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "support"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Support
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === "documentation" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">API Endpoints</h2>
                
                {activeEndpoint ? (
                  renderEndpointDetail()
                ) : (
                  renderEndpoints()
                )}
              </div>
            )}
            
            {selectedTab === "examples" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Code Examples</h2>
                <div className="bg-gray-800 rounded-lg p-4 text-white">
                  <pre className="overflow-auto">
{`// JavaScript example using fetch
const fetchUsers = async () => {
  try {
    const response = await fetch('${schema.baseUrl}/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Python example using requests
import requests

url = "${schema.baseUrl}/users"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`}
                  </pre>
                </div>
              </div>
            )}
            
            {selectedTab === "support" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">API Support</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium text-blue-800">Need help with this API?</h3>
                  <p className="mt-2 text-blue-700">Contact our support team for assistance with integration, troubleshooting, or any questions you may have.</p>
                  <div className="mt-4">
                    <p className="text-blue-800"><span className="font-medium">Email:</span> {schema.info.contact.email}</p>
                    <p className="text-blue-800"><span className="font-medium">Documentation:</span> <a href="#" className="underline">Full API Guide</a></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default APIDocs;