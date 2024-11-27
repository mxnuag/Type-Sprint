/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Graph from "./Graph";

export default function PerformanceReport({ data, onRestart }: any) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics = [
    {
      title: "WPM",
      value: data.wpm,
      info: "Words Per Minute: The number of words you typed correctly in one minute.",
    },
    {
      title: "Time",
      value: `${data.timeElapsed.toFixed(2)}s`,
      info: "The total time you spent on the typing test.",
    },
    {
      title: "Accuracy",
      value: `${data.accuracy.toFixed(2)}%`,
      info: "The percentage of characters you typed correctly.",
    },
    {
      title: "Words Typed",
      value: data.wordsTyped,
      info: "The total number of words you typed during the test.",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
        >
          <Card className="w-full max-w-3xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                Performance Report
              </CardTitle>
              <CardDescription>
                Here&apos;s how you did on your typing test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <TooltipProvider key={metric.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-muted p-4 rounded-lg text-center hover:bg-muted/80 transition-colors cursor-help"
                        >
                          <h3 className="text-lg font-semibold mb-2">
                            {metric.title}
                          </h3>
                          <p className="text-3xl font-bold">{metric.value}</p>
                          <HelpCircle className="inline-block ml-2 text-muted-foreground" />
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{metric.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <Graph data={data} />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={onRestart} size="lg" className="w-full max-w-xs">
                <ReloadIcon className="mr-2 h-4 w-4" /> Restart Test
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
