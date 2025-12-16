"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Flame, 
  Compass, 
  Plus, 
  ChevronDown, 
  TrendingUp,
  Gamepad2,
  Trophy,
  Star,
  Tv,
  Bitcoin,
  Phone,
  Mail
} from "lucide-react";
import { getAllCommunities, getCurrentUser } from "../lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const [communities, setCommunities] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const [helpExpanded, setHelpExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    
    const fetchCommunities = async () => {
      try {
        const data = await getAllCommunities();
        setCommunities(data || []);
      } catch (err) {
        console.error("Failed to fetch communities");
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const NavItem = ({ href, icon: Icon, label, isActive }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-[var(--reddit-orange)]" : ""}`} />
      {label}
    </Link>
  );

  const SectionHeader = ({ label, expanded, onToggle }) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-6 py-3 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest hover:bg-[var(--bg-hover)]"
    >
      {label}
      <ChevronDown 
        className={`w-4 h-4 transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`} 
      />
    </button>
  );

  const topics = [
    { icon: Gamepad2, label: "Gaming", color: "#FF4500" },
    { icon: Trophy, label: "Sports", color: "#46D160" },
    { icon: Bitcoin, label: "Crypto", color: "#F7931A" },
    { icon: Tv, label: "Television", color: "#0079D3" },
    { icon: Star, label: "Celebrity", color: "#FFD635" },
  ];

  return (
    <aside className="w-[270px] h-[calc(100vh-48px)] sticky top-12 bg-[var(--bg-canvas)] border-r border-[var(--border-primary)] overflow-y-auto">
      <nav className="py-3">
        {/* Main Navigation */}
        <div className="pb-3 border-b border-[var(--border-primary)]">
          <NavItem href="/" icon={Home} label="Home" isActive={pathname === "/"} />
          <NavItem href="/popular" icon={TrendingUp} label="Popular" isActive={pathname === "/popular"} />
          <NavItem href="/explore" icon={Compass} label="Explore" isActive={pathname === "/explore"} />
        </div>

        {/* Topics */}
        <div className="py-1 border-b border-[var(--border-primary)]">
          <SectionHeader 
            label="Topics" 
            expanded={topicsExpanded} 
            onToggle={() => setTopicsExpanded(!topicsExpanded)} 
          />
          {topicsExpanded && (
            <div className="animate-slideIn">
              {topics.map((topic) => (
                <button
                  key={topic.label}
                  className="flex items-center gap-3 w-full px-6 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <topic.icon className="w-5 h-5" style={{ color: topic.color }} />
                  {topic.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="py-1 border-b border-[var(--border-primary)]">
          <SectionHeader 
            label="Resources" 
            expanded={resourcesExpanded} 
            onToggle={() => setResourcesExpanded(!resourcesExpanded)} 
          />
          {resourcesExpanded && (
            <div className="animate-slideIn">
              <Link
                href="/about-reddit"
                className="flex items-center gap-3 px-6 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                About Reddit
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 px-6 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
              >
                Advertise
              </Link>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="py-1 border-b border-[var(--border-primary)]">
          <SectionHeader 
            label="Help" 
            expanded={helpExpanded} 
            onToggle={() => setHelpExpanded(!helpExpanded)} 
          />
          {helpExpanded && (
            <div className="animate-slideIn">
              <div className="px-6 py-3 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                  <div>
                    <p className="text-[var(--text-muted)] text-xs">Phone</p>
                    <a 
                      href="tel:01022765870" 
                      className="text-[var(--text-primary)] hover:text-[var(--text-link)] transition-colors"
                    >
                      01022765870
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
                  <div>
                    <p className="text-[var(--text-muted)] text-xs">Email</p>
                    <a 
                      href="mailto:nagya4546@gmail.com" 
                      className="text-[var(--text-primary)] hover:text-[var(--text-link)] transition-colors break-all"
                    >
                      nagya4546@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Communities */}
        <div className="py-1">
          <SectionHeader 
            label="Communities" 
            expanded={expanded} 
            onToggle={() => setExpanded(!expanded)} 
          />

          {expanded && (
            <div className="animate-slideIn">
              {user && (
                <Link
                  href="/create-community"
                  className="flex items-center gap-3 px-6 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create a community
                </Link>
              )}

              {loading ? (
                <div className="space-y-2 px-6 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 skeleton rounded" />
                  ))}
                </div>
              ) : communities.length === 0 ? (
                <p className="px-6 py-3 text-sm text-[var(--text-muted)]">
                  No communities yet
                </p>
              ) : (
                communities.slice(0, 8).map((c) => (
                  <Link
                    key={c.communityName}
                    href={`/community/${encodeURIComponent(c.communityName)}`}
                    className={`flex items-center gap-3 px-6 py-2 text-sm transition-colors ${
                      pathname === `/community/${c.communityName}`
                        ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8717] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">r/</span>
                    </div>
                    <span className="truncate">r/{c.communityName}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-[var(--border-primary)]">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
          <a href="#" className="hover:text-[var(--text-secondary)]">User Agreement</a>
          <span>·</span>
          <a href="#" className="hover:text-[var(--text-secondary)]">Privacy Policy</a>
          <span>·</span>
          <a href="#" className="hover:text-[var(--text-secondary)]">Content Policy</a>
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Reddit, Inc. © 2025. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
