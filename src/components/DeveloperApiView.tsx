import React, { useState } from 'react';
import {
  Code,
  Send,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DeveloperApiView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'health' | 'chat' | 'sources' | 'programs'>('chat');
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        message: 'Tell me about the 400+ bus transportation fleet to Rajahmundry',
        session_id: 'api_test_session',
        language: 'English',
        persona: 'Student'
      },
      null,
      2
    )
  );
  const [responseOutput, setResponseOutput] = useState<string>('Click "Execute API Request" to test live endpoint...');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python' | 'javascript'>('curl');

  const copyToClipboard = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setStatusCode(null);
    setResponseOutput('Executing request...');

    try {
      let res: globalThis.Response;
      if (selectedEndpoint === 'health') {
        res = await fetch('/health');
      } else if (selectedEndpoint === 'sources') {
        res = await fetch('/api/v1/sources');
      } else if (selectedEndpoint === 'programs') {
        res = await fetch('/api/v1/programs');
      } else {
        res = await fetch('/api/v1/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });
      }

      setStatusCode(res.status);
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setStatusCode(500);
      setResponseOutput(JSON.stringify({ error: e.message || 'API request failed' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurlSnippet = () => {
    if (selectedEndpoint === 'chat') {
      return `curl -X POST https://aditya-campus-ai.cloudrun.app/api/v1/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "What programs have Google Cloud tie-up?",
    "persona": "Student",
    "language": "English"
  }'`;
    }
    return `curl -X GET https://aditya-campus-ai.cloudrun.app/${selectedEndpoint === 'health' ? 'health' : 'api/v1/' + selectedEndpoint}`;
  };

  const getPythonSnippet = () => {
    if (selectedEndpoint === 'chat') {
      return `import requests

url = "https://aditya-campus-ai.cloudrun.app/api/v1/chat"
payload = {
    "message": "Who is the Vice Chancellor of Aditya University?",
    "persona": "Student",
    "language": "English"
}

response = requests.post(url, json=payload)
data = response.json()
print("Answer:", data["answer"])
print("Grounded:", data["grounded"])
print("Sources:", [s["title"] for s in data.get("sources", [])])`;
    }
    return `import requests

response = requests.get("https://aditya-campus-ai.cloudrun.app/${selectedEndpoint === 'health' ? 'health' : 'api/v1/' + selectedEndpoint}")
print(response.json())`;
  };

  const getJsSnippet = () => {
    if (selectedEndpoint === 'chat') {
      return `const response = await fetch("https://aditya-campus-ai.cloudrun.app/api/v1/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Tell me about hostel room AC options",
    persona: "Parent",
    language: "English"
  })
});

const data = await response.json();
console.log(data.answer);`;
    }
    return `const response = await fetch("https://aditya-campus-ai.cloudrun.app/${selectedEndpoint === 'health' ? 'health' : 'api/v1/' + selectedEndpoint}");
const data = await response.json();
console.log(data);`;
  };

  const embedScriptCode = `<!-- Place this snippet before the closing </body> tag of adityauniversity.in -->
<script
  src="https://adityauniversity.in/widget/campus-ai-widget.js"
  data-api-endpoint="https://aditya-campus-ai.cloudrun.app/api/v1/chat"
  data-primary-color="#c25e00"
  data-title="Aditya Campus AI"
  data-position="bottom-right"
  async>
</script>`;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 md:p-8 text-white shadow-md border-l-4 border-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block bg-amber-500/20 text-amber-300 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-amber-500/30">
              REST API & Embeddable Integration
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Developer REST API Console
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Integrate Aditya Campus AI directly into official university web applications, mobile portals, or embed the floating widget on external domains.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>API Gateway Online</span>
          </div>
        </div>

        {/* API Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-600" />
                  <span>Interactive API Request</span>
                </h3>
                <span className="text-xs text-slate-500">Live Backend Test</span>
              </div>

              {/* Endpoint selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'chat', label: 'POST /chat' },
                  { id: 'health', label: 'GET /health' },
                  { id: 'sources', label: 'GET /sources' },
                  { id: 'programs', label: 'GET /programs' }
                ].map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                      selectedEndpoint === ep.id
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>

              {/* Payload Editor (if POST) */}
              {selectedEndpoint === 'chat' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Request Body (JSON):</label>
                  <textarea
                    value={requestBody}
                    onChange={e => setRequestBody(e.target.value)}
                    rows={7}
                    className="w-full font-mono text-xs bg-slate-900 text-amber-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleExecuteRequest}
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Executing Request...' : 'Execute API Request'}</span>
            </button>
          </div>

          {/* Response Panel */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">Response Payload</span>
                {statusCode && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusCode === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                    HTTP {statusCode}
                  </span>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(responseOutput, 'response')}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                {copiedTab === 'response' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'response' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="flex-1 overflow-auto font-mono text-xs text-emerald-300 bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 leading-relaxed max-h-80">
              {responseOutput}
            </pre>
          </div>
        </div>

        {/* Code Snippets Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-600" />
                <span>Client Integration Code Snippets</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ready-to-use boilerplate for calling Aditya Campus AI from your applications
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              {(['curl', 'python', 'javascript'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                    activeCodeTab === tab
                      ? 'bg-white text-amber-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'javascript' ? 'JavaScript' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {activeCodeTab === 'curl' && getCurlSnippet()}
              {activeCodeTab === 'python' && getPythonSnippet()}
              {activeCodeTab === 'javascript' && getJsSnippet()}
            </pre>
            <button
              onClick={() => {
                const text = activeCodeTab === 'curl' ? getCurlSnippet() : activeCodeTab === 'python' ? getPythonSnippet() : getJsSnippet();
                copyToClipboard(text, activeCodeTab);
              }}
              className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-xs flex items-center gap-1 transition-colors border border-slate-700"
            >
              {copiedTab === activeCodeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === activeCodeTab ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Embed Script Snippet for adityauniversity.in */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Embeddable University Web Widget Snippet</span>
              </h3>
              <p className="text-xs text-slate-500">
                Embed the floating chat assistant on the official Aditya University website (`adityauniversity.in`) with zero external dependencies.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(embedScriptCode, 'widget')}
              className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedTab === 'widget' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTab === 'widget' ? 'Copied Snippet' : 'Copy Embed Script'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 text-amber-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
            {embedScriptCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
