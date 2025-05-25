'use client';

import { Box } from "@mui/material";
import { ReactNode } from "react";

export function WindowBackground({ children}: { children: ReactNode}) {
    return <Box
        height={"100%"}
        width="100%"
        borderRadius={2}
        padding={2}
        style={{
            background: "var(--window-background)",
            overflowY: "auto"
        }}
    >
        {children}
    </Box>
}