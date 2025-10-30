"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const FONT_SIZES = [
  { label: "Small", value: "14px", class: "text-sm" },
  { label: "Medium", value: "16px", class: "text-base" },
  { label: "Large", value: "18px", class: "text-lg" },
  { label: "Extra Large", value: "20px", class: "text-xl" },
]

const FONT_FAMILIES = [
  { label: "Serif (Default)", value: "serif" },
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Monospace", value: "monospace" },
]

export function Settings() {
  const [fontSize, setFontSize] = useState("16px")
  const [fontFamily, setFontFamily] = useState("serif")

  useEffect(() => {
    // Load settings from localStorage
    const savedFontSize = localStorage.getItem("zamail_fontSize")
    const savedFontFamily = localStorage.getItem("zamail_fontFamily")
    
    if (savedFontSize) setFontSize(savedFontSize)
    if (savedFontFamily) setFontFamily(savedFontFamily)
    
    // Apply to document
    applySettings(savedFontSize || fontSize, savedFontFamily || fontFamily)
  }, [])

  const applySettings = (size: string, family: string) => {
    document.documentElement.style.setProperty("--mail-font-size", size)
    document.documentElement.style.setProperty("--mail-font-family", family)
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem("zamail_fontSize", size)
    applySettings(size, fontFamily)
  }

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family)
    localStorage.setItem("zamail_fontFamily", family)
    applySettings(fontSize, family)
  }

  const resetSettings = () => {
    setFontSize("16px")
    setFontFamily("serif")
    localStorage.removeItem("zamail_fontSize")
    localStorage.removeItem("zamail_fontFamily")
    applySettings("16px", "serif")
  }

  return (
    <div className="p-8">
      <Card className="max-w-2xl mx-auto border-2 border-muted-ink/20 bg-paper shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-ink">Settings</CardTitle>
          <CardDescription className="text-muted-ink font-serif">
            Customize your mail reading experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-ink font-serif text-lg">Font Size</Label>
            <div className="grid grid-cols-2 gap-3">
              {FONT_SIZES.map((size) => (
                <Button
                  key={size.value}
                  variant={fontSize === size.value ? "default" : "outline"}
                  onClick={() => handleFontSizeChange(size.value)}
                  className={`${
                    fontSize === size.value
                      ? "bg-vermillion text-white hover:bg-vermillion/90"
                      : "border-2 border-muted-ink/30 text-ink hover:bg-vermillion/10"
                  } font-serif`}
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-3">
            <Label className="text-ink font-serif text-lg">Font Style</Label>
            <div className="grid grid-cols-1 gap-3">
              {FONT_FAMILIES.map((font) => (
                <Button
                  key={font.value}
                  variant={fontFamily === font.value ? "default" : "outline"}
                  onClick={() => handleFontFamilyChange(font.value)}
                  className={`${
                    fontFamily === font.value
                      ? "bg-vermillion text-white hover:bg-vermillion/90"
                      : "border-2 border-muted-ink/30 text-ink hover:bg-vermillion/10"
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-ink font-serif text-lg">Preview</Label>
            <div
              className="border-2 border-muted-ink/30 rounded-lg p-4 bg-white"
              style={{
                fontSize: fontSize,
                fontFamily: fontFamily,
              }}
            >
              <p className="text-ink">
                This is how your emails will look with the current settings. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </p>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            onClick={resetSettings}
            variant="outline"
            className="w-full border-2 border-vermillion text-vermillion hover:bg-vermillion hover:text-white font-serif"
          >
            Reset to Default
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
