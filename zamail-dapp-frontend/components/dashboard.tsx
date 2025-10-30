"use client"

import { useState } from "react"
import type { ethers } from "ethers"
import { RegisterEmail } from "@/components/register-email"
import { ComposeMail } from "@/components/compose-mail"
import { Inbox } from "@/components/inbox"
import { Outbox } from "@/components/outbox"
import { Settings as SettingsComponent } from "@/components/settings"
import { Button } from "@/components/ui/button"
import { Menu, Search, Settings, HelpCircle, Pencil, InboxIcon, Send, FileText, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface DashboardProps {
  account: string
  provider: ethers.BrowserProvider
  onDisconnect: () => void
}

type View = "inbox" | "sent" | "drafts" | "register" | "compose" | "settings"

export function Dashboard({ account, provider, onDisconnect }: DashboardProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<View>("inbox")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b-2 border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-vermillion/20 border-2 border-vermillion flex items-center justify-center">
                <span className="text-vermillion text-sm font-bold">封</span>
              </div>
              <h1 className="text-2xl font-serif text-foreground">Zamail</h1>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search in mail"
                className="w-full pl-10 pr-4 py-2 bg-background border-2 border-border rounded-lg focus:border-vermillion focus:outline-none font-serif text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground hover:bg-muted">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setActiveView("settings")} className="text-foreground hover:bg-muted">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="ml-2 text-right">
              {userEmail && <p className="text-xs font-serif text-foreground">{userEmail}</p>}
              <p className="text-xs text-muted-foreground">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
            <button
              onClick={onDisconnect}
              className="ml-2 px-3 py-1.5 border-2 border-vermillion text-vermillion rounded-lg hover:bg-vermillion hover:text-white transition-colors font-serif text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-64 border-r-2 border-border bg-background p-4 overflow-y-auto">
            <Button
              onClick={() => setActiveView("compose")}
              className="w-full mb-6 bg-vermillion hover:bg-vermillion/90 text-white font-serif py-6 rounded-2xl shadow-lg"
            >
              <Pencil className="h-5 w-5 mr-2" />
              Compose
            </Button>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveView("inbox")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full font-serif transition-colors ${
                  activeView === "inbox"
                    ? "bg-vermillion/20 text-vermillion font-bold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <InboxIcon className="h-5 w-5" />
                <span>Inbox</span>
              </button>

              <button
                onClick={() => setActiveView("sent")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full font-serif transition-colors ${
                  activeView === "sent"
                    ? "bg-vermillion/20 text-vermillion font-bold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Send className="h-5 w-5" />
                <span>Sent</span>
              </button>

              <button
                onClick={() => setActiveView("drafts")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full font-serif transition-colors ${
                  activeView === "drafts"
                    ? "bg-vermillion/20 text-vermillion font-bold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Drafts</span>
              </button>

              <div className="border-t-2 border-border my-4" />

              <button
                onClick={() => setActiveView("register")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full font-serif transition-colors ${
                  activeView === "register"
                    ? "bg-vermillion/20 text-vermillion font-bold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-lg">📧</span>
                <span>Register Email</span>
              </button>
            </nav>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto">
          {activeView === "compose" && <ComposeMail provider={provider} userEmail={userEmail} />}
          {activeView === "inbox" && <Inbox provider={provider} account={account} />}
          {activeView === "sent" && <Outbox provider={provider} account={account} />}
          {activeView === "settings" && <SettingsComponent />}
          {activeView === "drafts" && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground font-serif">No drafts yet</p>
            </div>
          )}
          {activeView === "register" && (
            <div className="p-8">
              <RegisterEmail provider={provider} account={account} onEmailRegistered={setUserEmail} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
