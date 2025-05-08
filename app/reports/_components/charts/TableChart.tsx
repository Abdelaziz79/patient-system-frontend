"use client";

import { TableComponentProps } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const TableComponent = ({
  headers,
  rows,
  title,
}: TableComponentProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Style variables for consistent theming
  const backgroundColor = isDark ? "bg-slate-900/90" : "bg-white/90";
  const headerBackground = isDark
    ? "from-blue-950/40 to-slate-900/95"
    : "from-blue-50/80 to-white/80";
  const borderColor = isDark ? "border-blue-950/30" : "border-blue-100/60";
  const tableBorderColor = isDark ? "border-blue-900/30" : "border-blue-100/50";
  const tableHeadBg = isDark ? "bg-blue-950/50" : "bg-blue-50/70";
  const tableRowHoverBg = isDark
    ? "hover:bg-blue-900/20"
    : "hover:bg-blue-50/50";

  // Animation variants for smooth entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <Card
        className={`w-full overflow-hidden hover:shadow-lg transition-all duration-300 ${borderColor} ${backgroundColor} backdrop-blur-lg`}
      >
        <CardHeader
          className={`pb-2 bg-gradient-to-r ${headerBackground} border-b border-blue-100/50 dark:border-blue-950/20`}
        >
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <motion.div
            variants={item}
            className="max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-800 scrollbar-track-transparent"
          >
            <Table className={`border ${tableBorderColor}`}>
              <TableHeader className={tableHeadBg}>
                <TableRow className={`border-b ${tableBorderColor}`}>
                  {headers.map((header) => (
                    <TableHead
                      key={header.key}
                      className="text-blue-700 dark:text-blue-300 font-semibold py-3"
                    >
                      {header.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    className={`border-b ${tableBorderColor} ${tableRowHoverBg} transition-colors`}
                  >
                    {headers.map((header) => (
                      <TableCell
                        key={`${index}-${header.key}`}
                        className="py-3 text-blue-600/90 dark:text-blue-300/90"
                      >
                        {row[header.key] || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
