import React, { useState, useEffect } from "react";
import axios from "axios";
import Ajv from "ajv";
import { 
  ArrowUpTrayIcon, 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  DocumentDuplicateIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const ajv = new Ajv();

export default function UploadSchema() {
  const [name, setName] = useState("");
  const [schema, setSchema] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [exampleVisible, setExampleVisible] = useState(false);
  const [isValidJson, setIsValidJson] = useState(true);
  const [copied, setCopied] = useState(false);

  // Validate JSON syntax in real-time
  useEffect(() => {
    if (!schema) {
      setIsValidJson(true);
      return;
    }
    try {
      JSON.parse(schema);
      setIsValidJson(true);
    } catch (err) {
      setIsValidJson(false);
    }
  }, [schema]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const parsedSchema = JSON.parse(schema);
      const valid = ajv.validateSchema(parsedSchema);
      if (!valid) {
        setMessage({
          text: "Invalid JSON Schema: " + JSON.stringify(ajv.errors, null, 2),
          type: "error"
        });
        return;
      }

      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/apis",
        { name, schemaJson: schema },
        { withCredentials: true }
      );

      setMessage({
        text: `Schema "${response.data.name}" uploaded successfully!`,
        type: "success"
      });
      setName("");
      setSchema("");
      setExampleVisible(false);
    } catch (err) {
      setMessage({
        text: "Error: " + (err.response?.data?.message || err.message),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExample = () => {
    if (exampleVisible) {
      setSchema("");
    } else {
      setSchema(`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Product API",
  "description": "A comprehensive product management API",
  "type": "object",
  "properties": {
    "id": { 
      "type": "integer", 
      "description": "Unique product identifier" 
    },
    "name": { 
      "type": "string", 
      "description": "Product name",
      "minLength": 1,
      "maxLength": 100
    },
    "price": { 
      "type": "number", 
      "minimum": 0,
      "description": "Product price in USD" 
    },
    "category": { 
      "type": "string", 
      "enum": ["electronics", "clothing", "books", "home"],
      "description": "Product category"
    },
    "inStock": { 
      "type": "boolean", 
      "description": "Availability status" 
    },
    "tags": { 
      "type": "array", 
      "items": { "type": "string" }, 
      "minItems": 0,
      "uniqueItems": true,
      "description": "Product tags"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" },
        "rating": { "type": "number", "minimum": 0, "maximum": 5 }
      }
    }
  },
  "required": ["id", "name", "price", "category"]
}`);
    }
    setExampleVisible(!exampleVisible);
  };

  const copyExample = () => {
    navigator.clipboard.writeText(`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Product API",
  "description": "A comprehensive product management API",
  "type": "object",
  "properties": {
    "id": { 
      "type": "integer", 
      "description": "Unique product identifier" 
    },
    "name": { 
      "type": "string", 
      "description": "Product name",
      "minLength": 1,
      "maxLength": 100
    },
    "price": { 
      "type": "number", 
      "minimum": 0,
      "description": "Product price in USD" 
    },
    "category": { 
      "type": "string", 
      "enum": ["electronics", "clothing", "books", "home"],
      "description": "Product category"
    },
    "inStock": { 
      "type": "boolean", 
      "description": "Availability status" 
    },
    "tags": { 
      "type": "array", 
      "items": { "type": "string" }, 
      "minItems": 0,
      "uniqueItems": true,
      "description": "Product tags"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" },
        "rating": { "type": "number", "minimum": 0, "maximum": 5 }
      }
    }
  },
  "required": ["id", "name", "price", "category"]
}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <ArrowUpTrayIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Upload API Schema
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create testable API endpoints by uploading JSON Schema definitions. 
            Perfect for mocking, testing, and documentation.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* API Name Field */}
              <div>
                <label htmlFor="apiName" className="block text-sm font-semibold text-gray-800 mb-3">
                  API Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="apiName"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., UserProfileAPI, ProductCatalog, InventoryService"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Choose a descriptive name that identifies your API
                </p>
              </div>

              {/* JSON Schema Field */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <label htmlFor="jsonSchema" className="text-sm font-semibold text-gray-800 mb-2 sm:mb-0">
                    JSON Schema <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={toggleExample}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <LightBulbIcon className="h-4 w-4" />
                      {exampleVisible ? 'Hide Example' : 'Show Example'}
                    </button>
                    {exampleVisible && (
                      <button
                        type="button"
                        onClick={copyExample}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    id="jsonSchema"
                    rows={14}
                    className={`w-full p-4 border font-mono text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      !isValidJson && schema ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder='Paste your JSON Schema here (e.g., { "type": "object", "properties": { ... } })'
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    required
                  />
                  {!isValidJson && schema && (
                    <div className="absolute top-3 right-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-3 w-3" />
                      Invalid JSON
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <SparklesIcon className="h-4 w-4 mr-1 text-blue-500" />
                  Supports all JSON Schema draft versions
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !isValidJson}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading Schema...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="h-5 w-5" />
                      Upload API Schema
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Message Display */}
            {message.text && (
              <div className={`mt-8 p-6 rounded-xl border-2 ${
                message.type === "error" 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start gap-4">
                  {message.type === "error" ? (
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="font-mono text-sm break-words text-gray-800">
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">JSON Schema Validation</h4>
                  <p>Automatic validation using AJV with comprehensive error reporting</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Instant API Creation</h4>
                  <p>Get working endpoints immediately after schema upload</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">RESTful Endpoints</h4>
                  <p>Automatic generation of CRUD endpoints based on your schema</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-yellow-500" />
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <p>Use descriptive property names and descriptions for better documentation</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <p>Include required fields to ensure data integrity in your API</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <p>Add enum values for fields with limited possible values</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">4</span>
              </div>
              <p>Test your schema with online validators before uploading</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}