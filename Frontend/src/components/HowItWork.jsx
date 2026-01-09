import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowItWork() {
    const navigate = useNavigate()
  return (
    <div>
      <header class="bg-white shadow-md py-8 flex justify-around">
        <h1 class="text-3xl font-bold text-center">How It Works</h1>
        <button className="bg-black text-white px-4 py-2 rounded-md" onClick={()=>navigate('/')}>back</button>
      </header>

      <main class="max-w-4xl mx-auto p-6 space-y-12">
        <section class="flex items-start gap-4">
          <div class="text-4xl">👤</div>
          <div>
            <h2 class="text-xl font-semibold mb-2">What it is</h2>
            <p>
              This is a real-time chat application where users can sign up, log
              in, and chat with available users instantly.
            </p>
          </div>
        </section>

        <section class="flex items-start gap-4">
          <div class="text-4xl">⚡</div>
          <div>
            <h2 class="text-xl font-semibold mb-2">Key Features</h2>
            <ul class="list-disc pl-5 space-y-1">
              <li>💬 Real-time messaging</li>
              <li>✅ Message delivery status</li>
              <li>🕒 Time & date for every message</li>
              <li>🔒 Secure login & authentication</li>
              <li>🌐 Online/offline user status</li>
            </ul>
          </div>
        </section>

        <section class="flex items-start gap-4">
          <div class="text-4xl">🛠️</div>
          <div>
            <h2 class="text-xl font-semibold mb-2">How it works</h2>
            <ol class="list-decimal pl-5 space-y-1">
              <li>User signs up or logs in.</li>
              <li>See available users in real time.</li>
              <li>Select a user to start a conversation.</li>
              <li>
                Messages are sent and received instantly with status and
                timestamps.
              </li>
            </ol>
          </div>
        </section>

        <section class="flex items-start gap-4">
          <div class="text-4xl">🚀</div>
          <div>
            <h2 class="text-xl font-semibold mb-2">Ongoing improvements</h2>
            <p>
              The app is actively being improved with new features, better
              performance, and enhanced user experience over time.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
