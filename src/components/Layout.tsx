import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDogsAPI } from "../apis/getDogs";

const Container = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Header = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Body = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HorizontalBarContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HorizontalBar = styled(Divider)(({ theme }) => ({
  width: "100%",
}));

const ImageCard = styled(Card)(({ theme }) => ({
  width: 300,
  height: 300,
  margin: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "lightgray",
  transition: "background-color 0.3s ease",
}));

const StyledImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const Layout: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [cards, setCards] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(event.target.value);
    setAmount(newAmount);
  };

  const handleLoadImages = async () => {
    const dogsList = await getDogsAPI(amount);
    const newCards = dogsList;
    if (selectedCards.length > 0) {
      const selectedIndices = selectedCards.map((card) => cards.indexOf(card));
      const updatedCards = [...cards];
      selectedIndices.forEach((index, i) => {
        updatedCards[index] = newCards[i];
      });
      setCards(updatedCards);
    } else {
      setCards([...cards, ...newCards]);
    }
  };

  const handleClearImages = () => {
    setCards(cards.filter((card) => selectedCards.includes(card)));
    setSelectedCards([]);
  };

  const handleCardClick = (card: string) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(
        selectedCards.filter((selectedCard) => selectedCard !== card)
      );
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <Container container>
      <Header container alignItems="center">
        <Grid item sx={{ ml: 1 }}>
          <TextField
            type="number"
            label="Amount"
            variant="outlined"
            value={amount}
            onChange={handleAmountChange}
            size="small"
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item sx={{ ml: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoadImages}
          >
            LOAD 🐶
          </Button>
        </Grid>
        <Grid item sx={{ ml: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearImages}
          >
            CLEAR
          </Button>
        </Grid>
      </Header>

      <HorizontalBarContainer container>
        <HorizontalBar sx={{ ml: 1 }} />
      </HorizontalBarContainer>

      <Body container>
        {cards.map((card) => (
          <Grid item key={card}>
            <ImageCard
              onClick={() => handleCardClick(card)}
              style={{
                backgroundColor: selectedCards.includes(card)
                  ? "lightblue"
                  : "lightgray",
              }}
            >
              <CardContent>
                <StyledImage src={card} alt="dog" />
              </CardContent>
            </ImageCard>
          </Grid>
        ))}
      </Body>
    </Container>
  );
};

export default Layout;
