'use client';

import { WindowBackground } from "@/app/components/WindowBackground";
import { Character } from "@/app/types";
import { getStatusName } from "@/app/utils/functions";
import { Box, Card, CardContent, Divider, Grid, styled, Typography } from "@mui/material";
import { FastAverageColor } from "fast-average-color";
import { useCallback, useEffect, useMemo, useState } from "react";

const ImageTitle = styled("img")(({ }) => ({
  height: 100,
  display: "block",
  margin: "auto",
  animation: "pulseDropShadow 1s infinite alternate ease"
}))

const CharacterImage = styled("img")(() => ({
  borderRadius: ".625rem",
  display: "block",
  margin: "auto",
  width: "9.37rem",
}));

export default function Home() {
  const [characters, setCharacters] = useState<Map<number, (Character & { color: string })>>(new Map);
  const [page, setPage] = useState<number>(1);

  const fetchCharacters = useCallback(async () => {
    const draftMap = characters;
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${1}`);
    const data = await response.json() as { info: { page: number, next: number | null, prev: number | null }, results: (Character & { color: string })[] };
    const fac = new FastAverageColor();

    const colorsPromise = data.results.map(async (item) => {
      const color = await fac.getColorAsync(item.image);
      item.color = color.hex;

      draftMap.set(item.id, item);
      return item;
    });

    await Promise.all(colorsPromise);

    setCharacters(new Map(draftMap));
  }, [page]);

  const charactersArr = useMemo(() => {
    return Array.from(characters.values()).map(character => {
      return <Grid size={{ xs: 12, md: 3 }} key={character.id} display={"flex"}>
        <Box position={"relative"}>
          <CharacterImage src={character.image} style={{ filter: `drop-shadow(0 0 10px ${character.color})` }} />
          <Box position={"absolute"} top={".625rem"} left=".625rem" className={`status ${character.status.toLowerCase()}`}> {getStatusName(character.status)}</Box>
        </Box>
        <Box flexGrow={1} px={2}>
          <Typography variant="h2" fontSize={"1.2rem"} fontWeight={600}>{character.name}</Typography>

        </Box>
        {/* <Card >
          <CharacterImage src={character.image} />
          <CardContent sx={{ m: 0, p: 0, background: "var(--window-background)" }}>
            <Typography variant="h2" textAlign={"center"} fontSize={"1.2rem"} fontWeight={600} m={0}>{character.name} </Typography>
          </CardContent>
        </Card> */}
      </Grid>
    })
  }, [characters]);

  useEffect(() => {
    fetchCharacters()
  }, []);

  return (
    <WindowBackground>
      <ImageTitle src="/assets/images/title.webp" />
      <Divider style={{ backgroundColor: "white" }} />

      <Grid container spacing={2} rowSpacing={8} mt={2}>
        {charactersArr}
      </Grid>
    </WindowBackground>
  );
}
