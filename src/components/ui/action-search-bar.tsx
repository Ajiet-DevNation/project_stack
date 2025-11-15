"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "./input-search-bar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Package, 
  User, 
} from "lucide-react";
import { useRouter } from "next/navigation";

function useDebounce<T>(value: T, delay: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  end?: string;
  href?: string;
  prefix?: string;
}

interface ApiProject {
  id: string;
  title: string;
  author: {
    name: string;
  };
}

interface ApiProfile {
  id: string;
  name: string;
  bio: string | null;
}

const defaultActions: Action[] = [
  {
    id: "search-projects",
    label: "Search Projects",
    icon: <Package className="h-4 w-4 text-blue-500" />,
    description: "by title or description",
    end: "Action",
    prefix: "project: ",
  },
  {
    id: "search-profiles",
    label: "Search Profiles",
    icon: <User className="h-4 w-4 text-green-500" />,
    description: "by name or skill",
    end: "Action",
    prefix: "profile: ",
  },
];

function ActionSearchBar({
  autoFocus,
  onClose,
}: {
  autoFocus?: boolean;
  onClose?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<{
    label: string;
    color: string;
    type: string;
  } | null>(null);
  const [result, setResult] = useState<Action[]>(defaultActions);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (!isFocused) {
      setResult([]);
      return;
    }

    const currentQuery = debouncedQuery.trim();
    const searchType = activeFilter ? activeFilter.type : "all";

    if (!currentQuery) {
      if (!activeFilter) {
        setResult(defaultActions);
      } else {
        setResult([]);
      }
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        let projectResults: Action[] = [];
        let profileResults: Action[] = [];

        if (searchType === "all" || searchType === "project") {
          const res = await fetch(`/api/projects?search=${currentQuery}`);
          if (res.ok) {
            const projects: ApiProject[] = await res.json();
            projectResults = projects.map((project) => ({
              id: project.id,
              label: project.title,
              description: `by ${project.author.name}`,
              icon: <Package className="h-4 w-4 text-blue-500" />,
              end: "Project",
              href: `/projects/${project.id}`,
            }));
          }
        }

        if (searchType === "all" || searchType === "profile") {
          const res = await fetch(`/api/profile?search=${currentQuery}`, {
            method: "GET",
          });
          if (res.ok) {
            const profiles: ApiProfile[] = await res.json();
            profileResults = profiles.map((profile) => ({
              id: profile.id,
              label: profile.name,
              description: profile.bio || "No bio",
              icon: <User className="h-4 w-4 text-green-500" />,
              end: "Profile",
              href: `/profile/${profile.id}`,
            }));
          }
        }

        setResult([...projectResults, ...profileResults]);
      } catch (err) {
        console.error(err);
        setResult([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, isFocused, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim() === "" && activeFilter) {
    } else if (newQuery.trim() === "" && !activeFilter) {
      setActiveFilter(null);
    }
  };

  const handleItemClick = (action: Action) => {
    if (action.href) {
      router.push(action.href);
      inputRef.current?.blur();
      setQuery("");
      setActiveFilter(null);
      if (onClose) onClose();
    } else if (action.prefix) {
      setActiveFilter({
        label: action.prefix.trim(),
        color:
          action.id === "search-projects" ? "text-blue-500" : "text-green-500",
        type: action.id === "search-projects" ? "project" : "profile",
      });
      setQuery(""); 
      inputRef.current?.focus();
    }
  };

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { height: { duration: 0.4 }, staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current?.matches(":focus-within")) {
        setIsFocused(false);
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (onClose) {
        onClose();
      } else {
        inputRef.current?.blur();
        setIsFocused(false);
      }
      setQuery("");
      setActiveFilter(null);
      setResult([]);
    } else if (e.key === "Backspace" && query === "" && activeFilter) {
      e.preventDefault();
      setActiveFilter(null);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative flex flex-col justify-start items-center min-h-[300px]">
        
        <div className="w-full sticky top-0 bg-background z-10 pt-4 pb-1 px-4">
          <label
            className="text-sm font-semibold text-foreground mb-2 block"
            htmlFor="search"
          >
            Search
            {activeFilter && (
              <span className={`ml-2 ${activeFilter.color}`}>
                {activeFilter.label}
              </span>
            )}
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search projects, profiles, or skills..."
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
              ref={inputRef}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full px-4">
          <AnimatePresence>
            {isFocused && result.length > 0 && (
              <motion.div
                className="w-full border rounded-md shadow-sm overflow-hidden border-border bg-card mt-1"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul>
                  {result.map((action) => (
                    <motion.li
                      key={action.id}
                      className="px-3 py-2 flex items-center justify-between hover:bg-accent cursor-pointer rounded-md"
                      variants={item}
                      layout
                      onMouseDown={() => handleItemClick(action)}
                    >
                      <div className="flex items-center gap-2 justify-between overflow-hidden">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-muted-foreground">
                            {action.icon}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {action.label}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {action.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground text-right">
                          {action.end}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                <div className="mt-2 px-3 py-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Search ProjectStack</span>
                    <span>ESC to cancel</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export { ActionSearchBar };