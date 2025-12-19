"use client";

import { useEffect } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { Info, Users, MessageSquare, TrendingUp, Globe, Shield, Sparkles } from "lucide-react";

export default function AboutRedditPage() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
              <svg viewBox="0 0 20 20" className="w-10 h-10">
                <circle fill="white" cx="10" cy="10" r="10"/>
                <circle fill="#FF4500" cx="10" cy="10" r="7"/>
                <circle fill="white" cx="6.5" cy="9" r="1"/>
                <circle fill="white" cx="13.5" cy="9" r="1"/>
                <path fill="white" d="M6.5 12.5c0 0 1.5 2 3.5 2s3.5-2 3.5-2" stroke="white" strokeWidth="1" strokeLinecap="round" fillOpacity="0"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">About Reddit</h1>
              <p className="text-[var(--text-secondary)] mt-1">The front page of the internet</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* What is Reddit Card */}
          <div className="reddit-card p-6">
            <div className="flex items-start gap-4 mb-4">
              <Info className="w-6 h-6 text-[var(--reddit-orange)] shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">What is Reddit?</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Reddit is a network of communities where people can dive into their interests, hobbies, and passions. 
                  There's a community for whatever you're interested in on Reddit.
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Redditors submit content to the site such as links, text posts, images, and videos, which are then voted 
                  up or down by other members. Posts are organized by subject into user-created boards called "communities" 
                  or "subreddits", which cover a variety of topics.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Communities */}
            <div className="reddit-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0079D3] to-[#00A8E8] flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Communities</h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Join millions of communities and discover content tailored to your interests. From technology to cooking, 
                there's a community for everyone.
              </p>
            </div>

            {/* Discussions */}
            <div className="reddit-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Discussions</h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Engage in meaningful conversations with like-minded individuals. Ask questions, share experiences, 
                and learn from others in the community.
              </p>
            </div>

            {/* Trending Content */}
            <div className="reddit-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#46D160] to-[#00A8E8] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Trending Content</h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Stay up-to-date with the latest trends, breaking news, and viral content. Reddit's voting system 
                ensures the best content rises to the top.
              </p>
            </div>

            {/* Global Platform */}
            <div className="reddit-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD635] to-[#FF4500] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Global Platform</h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Connect with people from around the world. Reddit is available in multiple languages and hosts 
                communities from every corner of the globe.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="reddit-card p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">How Reddit Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--reddit-orange)] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Join Communities</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Discover and join communities (subreddits) that match your interests. Each community has its own rules, 
                    moderators, and culture.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--reddit-blue)] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Post & Share</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Share links, images, text posts, or videos. Create engaging content that sparks conversations and 
                    connects with the community.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Vote & Discuss</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Upvote content you like and downvote content that doesn't contribute. Engage in discussions through 
                    comments and help shape the community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="reddit-card p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[var(--reddit-orange)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">User-Driven Content</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Content is entirely user-generated and curated through voting.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[var(--reddit-blue)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Moderated Communities</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Each community is moderated by dedicated volunteers to maintain quality.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Voting System</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Upvote and downvote content to help the best posts rise to the top.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[var(--reddit-orange)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">Diverse Communities</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    From niche hobbies to major topics, find communities for everything.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div className="reddit-card p-6 bg-gradient-to-r from-[#FF4500]/10 to-[#0079D3]/10 border-2 border-[var(--reddit-orange)]/30">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Ready to Get Started?</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Join Reddit today and become part of the world's largest community-driven platform. 
              Explore communities, share your thoughts, and connect with millions of users.
            </p>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="h-10 px-6 bg-[var(--reddit-orange)] hover:bg-[var(--reddit-orange-hover)] text-white font-bold rounded-full flex items-center justify-center transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/explore"
                className="h-10 px-6 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] font-bold rounded-full flex items-center justify-center border border-[var(--border-primary)] transition-colors"
              >
                Explore Communities
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





