/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";

export default function Navbar({ testSettings, setTestSettings }: any) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Typewriter Test</h1>
        <div className="flex items-center space-x-4 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="punctuation"
              checked={testSettings.includePunctuation}
              onCheckedChange={(checked) =>
                setTestSettings({
                  ...testSettings,
                  includePunctuation: checked,
                })
              }
            />
            <Label htmlFor="punctuation">Punctuation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="numbers"
              checked={testSettings.includeNumbers}
              onCheckedChange={(checked) =>
                setTestSettings({ ...testSettings, includeNumbers: checked })
              }
            />
            <Label htmlFor="numbers">Numbers</Label>
          </div>
          <Select
            value={testSettings.wordCount.toString()}
            onValueChange={(value: any) =>
              setTestSettings({ ...testSettings, wordCount: parseInt(value) })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Word Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 words</SelectItem>
              <SelectItem value="25">25 words</SelectItem>
              <SelectItem value="40">40 words</SelectItem>
              <SelectItem value="50">50 words</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="timerMode"
              checked={testSettings.timerMode}
              onCheckedChange={(checked) =>
                setTestSettings({ ...testSettings, timerMode: checked })
              }
            />
            <Label htmlFor="timerMode">Timer Mode</Label>
          </div>
          {testSettings.timerMode && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="timerDuration">Duration (s)</Label>
              <Input
                id="timerDuration"
                type="number"
                value={testSettings.timerDuration}
                onChange={(e) =>
                  setTestSettings({
                    ...testSettings,
                    timerDuration: parseInt(e.target.value),
                  })
                }
                className="w-20"
              />
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {theme === "dark" ? (
                  <SunIcon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
