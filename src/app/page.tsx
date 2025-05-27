'use client';

import { Character } from "@/app/types";
import { getStatusName, hexToRgb } from "@/app/utils/functions";
import { Box, Divider, Grid, styled, Typography } from "@mui/material";
import { FastAverageColor } from "fast-average-color";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { EffectCoverflow, FreeMode, Navigation, Thumbs } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";


const ImageTitle = styled("img")(({ }) => ({
  height: "6.25rem",
  display: "block",
  margin: "auto",
  animation: "pulseDropShadow 1s infinite alternate ease"
}))

const CharacterImage = styled("img")(({ boxShadowColor }: { boxShadowColor: string }) => ({
  borderRadius: "50%",
  boxShadow: `0 0 10px ${boxShadowColor}`,
  display: "block",
  margin: "auto",
  width: "9.37rem",
  filter: `drop-shadow(0 0 5px ${boxShadowColor})`,
  border: `2px solid ${boxShadowColor}`,
  outline: `3px solid ${boxShadowColor}`,
  outlineOffset: "2px"
}));

const H1 = styled("h1")(() => ({
  fontSize: "3rem",
  fontWeight: 900,
  fontFamily: "Orbitron, sans-serif",
  textAlign: "center",
  textTransform: "uppercase"
}));


const H1Emphasis = styled("span")(() => ({
  color: "#00fffb",
  textShadow: "0 0 20px rgba(0, 255, 251, .5)",
  textDecoration: "underline"
}));

const Header = styled("header")(() => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  backgroundImage: "url('/assets/images/background.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center"
}));

const HeaderCard = styled(Box)(({ delay }: { delay: number }) => ({
  width: 200,
  height: 200,
  boxShadow: "0 0 20px rgba(0, 255, 251, .5)",
  border: ".312rem solid #00fffb",
  borderRadius: "1rem",
  textAlign: "center",
  fontFamily: "Orbitron, sans-serif",
  fontSize: "1.2rem",
  fontWeight: 900,
  textTransform: "uppercase",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  position: "relative",
  animation: `moveHeaderCard  4s infinite ${delay}s alternate ease`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('/assets/images/header_card_background.webp')",
    backgroundSize: "cover",
    filter: "blur(5px)",
    zIndex: -1,
    opacity: 0.3,

  }
}));

const TypographyCharacterDescription = styled(Typography)(({ color }) => ({
  fontSize: "1rem",
  fontWeight: 500,
  textAlign: "center",
  color: color || "#00fffb",
}));

export default function Home() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [characterProperties, setCharacterProperties] = useState<{ color: string, index: number }>({ color: "#151622", index: 0 });
  const [characters, setCharacters] = useState<Map<number, (Character & { color: string })>>(new Map);
  const [page, setPage] = useState<number>(1);

  const rgbaByHex = (hex: string, alpha: number = 1) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

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
      const color = character.color || "#00fffb";

      return <SwiperSlide key={`${character.name}-${character.id}`} style={{ height: 500, padding: "1rem" }}>
        <Box position={"relative"} height={200}>
          <CharacterImage src={character.image} boxShadowColor={color} />
        </Box>
        <Typography variant="h2" fontSize={"1.2rem"} fontWeight={600} textAlign="center" color={color} fontFamily={"Orbitron, sans-serif"}>{character.name}</Typography>
        <Box my={"1rem"}>
          <Divider sx={{ background: color, padding: "2px", boxShadow: `0px 0px 10px ${color}` }} />
        </Box>
        <Box>
          <TypographyCharacterDescription color={character.color}>Status: {getStatusName(character.status)}</TypographyCharacterDescription>
          <TypographyCharacterDescription color={character.color}>Espécie: {character.species}
            {character.type && ` - ${character.type}`}</TypographyCharacterDescription>
          <TypographyCharacterDescription color={character.color}>Genero: {character.gender}</TypographyCharacterDescription>
          <TypographyCharacterDescription color={character.color}>Origem: {character.origin.name}</TypographyCharacterDescription>
          <TypographyCharacterDescription color={character.color}>Local: {character.location.name}</TypographyCharacterDescription>
        </Box>
      </SwiperSlide>
    })
  }, [characters]);

  useEffect(() => {
    fetchCharacters()
  }, []);

  return (
    <React.Fragment>
      <Header>
        <Box component={"nav"} padding="2rem" position={"relative"} sx={{ backgroundColor: "var(--window-background)" }}></Box>
        <Box>
          <ImageTitle src="/assets/images/title.webp" />
          <H1>
            Explorador de  perfis<br />
            do <H1Emphasis>Multiverso</H1Emphasis>
          </H1>
        </Box>
        <Box display={"flex"} flexGrow={1} gap={"5rem"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"} >
          <HeaderCard delay={0}>
            <span >Explore personagens</span>
            <img src="/assets/images/portal.webp" width={100} height={100} style={{ filter: "drop-shadow(0 0 5px #E6FFB4)" }} />
            <img src="/assets/images/morty.webp" style={{ position: "absolute", top: "-139px", filter: "drop-shadow(0 0 5px rgba(0, 255, 251, .5))" }} />
          </HeaderCard>
          <HeaderCard delay={1}>
            <span>Sobre o Projeto</span>
            <img src="/assets/images/hat.webp" width={100} height={100} style={{ filter: "drop-shadow(0 0 5px rgba(0, 255, 251, .5))" }} />
          </HeaderCard>
          <HeaderCard delay={2}>
            <span>Get Started</span>
            <img src="/assets/images/ship.webp" width={150} height={100} style={{ filter: "drop-shadow(0 0 5px rgba(0, 255, 251, .5))" }} />
            <img src="/assets/images/rick.webp" style={{ position: "absolute", top: "-161px", filter: "drop-shadow(0 0 5px rgba(0, 255, 251, .5))" }} />
          </HeaderCard>
        </Box>
      </Header>
      <Box component={"main"} sx={{ backgroundColor: "var(--window-background)" }}>
        <Box p="2rem">
          <Typography textAlign={"center"} variant="h2" fontFamily={"Orbitron, sans-serif"} fontSize={"2rem"} fontWeight={600}>Personagens do Multiverso</Typography>
          <Typography textAlign={"center"} mt={2}>
            Prepare-se para conhecer os personagens mais icônicos (e bizarros) do universo de Rick and Morty — todos reunidos em um só lugar!<br />
            De cientistas geniais a criaturas interdimensionais totalmente fora da realidade, essa lista traz o melhor (e o pior) que o multiverso tem a oferecer.<br />
            Seja para encontrar aliados, inimigos, ou só o próximo ser que o Rick acidentalmente transformou em alguma aberração cósmica… essa é a sua central de referência.<br />
            Cada personagem vem com uma breve descrição, sprite personalizado e, claro, uma pitada generosa de loucura sci-fi.
          </Typography>
        </Box>
        <Box sx={{ padding: "2rem", backgroundImage: `linear-gradient(0deg, transparent, ${rgbaByHex(characterProperties.color, .1)} 10%, rgba(21, 22, 34, 1) 60%)` }}>
          <Swiper
            modules={[EffectCoverflow]}
            effect="coverflow"
            spaceBetween={30}
            style={{ padding: "2rem 0" }}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={5}
            initialSlide={10}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 300,
              slideShadows: true
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 40
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 50
              }
            }}
            onActiveIndexChange={async (swiper) => {
              setCharacterProperties({
                color: characters.get(swiper.activeIndex + 1)?.color || "#151622",
                index: (swiper.activeIndex + 1)
              });
              if ((charactersArr.length - (swiper.activeIndex + 1)) < 10 && charactersArr.length > 0) {
                const nextPage = page + 1;
                setPage(nextPage);
                const response = await fetch(`https://rickandmortyapi.com/api/character?page=${nextPage}`);
                const data = await response.json() as { info: { page: number, next: number | null, prev: number | null }, results: (Character & { color: string })[] };
                const fac = new FastAverageColor();

                const colorsPromise = data.results.map(async (item) => {
                  const color = await fac.getColorAsync(item.image);
                  item.color = color.hex;

                  characters.set(item.id, item);
                  return item;
                });

                await Promise.all(colorsPromise);

                setCharacters(new Map(characters));

              }
            }}
          >
            {charactersArr}
          </Swiper>
        </Box>
        <Box p={"2rem"}>
          <Grid container alignItems={"center"} justifyContent={"center"}>
            <Grid size={{ md: 6 }}>
              <Swiper
                spaceBetween={10}
                modules={[FreeMode, Thumbs]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                style={{ height: "400px" }}
              >
                {
                  Array.from({ length: 35 }).map((_, index) => {
                    return <SwiperSlide key={index} className="img">
                      <img src={`/assets/images/gallery/${index + 1}.webp`} />
                    </SwiperSlide>
                  })
                }
              </Swiper>
              <Swiper
                spaceBetween={10}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                navigation={true}
                modules={[FreeMode, Navigation, Thumbs]}
                style={{ height: "200px", marginTop: "1rem" }}
              >
                {
                  Array.from({ length: 35 }).map((_, index) => {
                    return <SwiperSlide key={index} className="img">
                      <img src={`/assets/images/gallery/${index + 1}.webp`} />
                    </SwiperSlide>
                  })
                }
              </Swiper>
            </Grid>
            <Grid size={{ md: 6 }} p={"2rem"}>
              <Typography textAlign={"center"} variant="h2" fontFamily={"Orbitron, sans-serif"} fontSize={"2rem"} fontWeight={600} mb={"6.25rem"}>Galeria Interdimensional</Typography>
              <Typography mt={2} textAlign={"center"}>
                Explore a galeria visual do universo de Rick and Morty! Aqui você encontrará imagens estilizadas dos personagens, locais e criaturas mais icônicos da série, tudo reunido em um só lugar.
              </Typography>
              <Typography mt={2} textAlign={"center"}>
                Deslize pelos cards, mergulhe em cenas malucas de diferentes dimensões e veja o multiverso ganhar vida com artes vibrantes e cheias de personalidade. A galeria também conta com imagens exclusivas de universos mesclados, onde realidades alternativas se cruzam, criando combinações inesperadas e visualmente incríveis.
              </Typography>
              <Typography mt={2} textAlign={"center"}>
                Se você é fã do estilo visual da série, vai se sentir em casa aqui. Aproveite a viagem!
              </Typography>
            </Grid>

          </Grid>
        </Box>
        <Box p={"2rem"}>
          <Grid container>
            <Grid size={{ md: 6 }}>
              <Typography textAlign={"center"} variant="h2" fontFamily={"Orbitron, sans-serif"} fontSize={"2rem"} fontWeight={600}>Sobre o Projeto</Typography>
              <Typography mt={2}>
                Rick and Morty Enciclopédia é uma aplicação web interativa que reúne informações detalhadas sobre personagens, episódios, localizações e espécies do universo caótico de Rick and Morty. Todos os dados são consumidos em tempo real a partir da Rick and Morty API, apresentados em um layout moderno, responsivo e com efeitos visuais estilizados.
              </Typography>
              <Typography mt={2}>
                Você pode navegar por cards ilustrados dos personagens, ver de onde vieram, onde estão, em quais episódios apareceram — tudo organizado de forma prática e visual. E, para deixar a experiência mais divertida, o projeto ainda conta com um mini-jogo temático que adiciona uma camada extra de interação para os fãs da série.
              </Typography>
              <Typography mt={2}>
                🚀 Se você curtiu o projeto, considere deixar uma ⭐ lá no GitHub — isso ajuda muito a divulgar e valorizar o trabalho!
              </Typography>
            </Grid>
            <Grid size={{ md: 6 }}>
              <img src="/assets/images/about_side_2.webp" style={{ width: "100%" }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </React.Fragment >
  );
}
